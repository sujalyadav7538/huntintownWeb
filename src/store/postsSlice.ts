import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Post, Comment } from "../types";
import { apiFetch } from "../lib/api";
import type { RootState } from "./index";

const initialState: Post[] = [];

// Prevents concurrent duplicate initial fetches across components
let _fetchPostsInFlight = false;

/** Normalize a raw backend post document into the frontend Post shape */
export function normalizePost(p: any): Post {
  return {
    ...p,
    _id: p._id,
    id: p._id || p.id,
    author: {
      ...p.author,
      _id: p.author?._id,
      // id (UUID) is only returned when explicitly selected; fall back to _id
      id: p.author?.id || p.author?._id || "",
      avatar: p.author?.avatar || "",
      role: p.author?.role || "",
      location: p.author?.location || p.location || "",
    },
    status: p.status, // raw backend value: live | in_progress | completed | expired | cancelled
    comments: p.comments ?? [],
    responsesCount: p.responsesCount ?? 0,
    questions: p.questions ?? [],
    images: p.images ?? [],
  } as Post;
}

// Fetch all posts from public endpoint
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_arg, thunkAPI) => {
    _fetchPostsInFlight = true; // lock immediately, before any await
    try {
      const state = thunkAPI.getState() as RootState;
      const isAuthenticated = Boolean(state.auth?.isAuthenticated);

      if (isAuthenticated) {
        const token = state.auth?.token || "";
        const res = await apiFetch("/api/posts/getAvailablePosts?refresh=true", {
          method: "GET",
          headers: { Authorization: `${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: { success: boolean; count: number; hasMore: boolean; posts: any[] } =
          await res.json();
        return { posts: data.posts.map(normalizePost), hasMore: data.hasMore };
      }

      const res = await apiFetch("/api/posts?page=1");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data: { success: boolean; count: number; hasMore: boolean; posts: any[] } =
        await res.json();
      return { posts: data.posts.map(normalizePost), hasMore: data.hasMore };
    } catch (e) {
      _fetchPostsInFlight = false; // release lock so a retry is possible
      throw e;
    }
  },
  {
    // Skip if a fetch is already in flight — prevents concurrent duplicate calls
    condition: () => !_fetchPostsInFlight,
  },
);

// Fetch a specific page and append to existing list
export const fetchPostsPage = createAsyncThunk(
  "posts/fetchPostsPage",
  async (page: number, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const isAuthenticated = Boolean(state.auth?.isAuthenticated);
    const token = (state.auth as any)?.token || "";

    const url = isAuthenticated
      ? `/api/posts/getAvailablePosts?page=${page}`
      : `/api/posts?page=${page}`;

    const headers: Record<string, string> = isAuthenticated
      ? { Authorization: token }
      : {};

    const res = await apiFetch(url, { method: "GET", headers });
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data: { success: boolean; hasMore: boolean; posts: any[] } =
      await res.json();
    return { posts: data.posts.map(normalizePost), hasMore: data.hasMore };
  },
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    upsertPost: (state, action: PayloadAction<Post>) => {
      const idx = state.findIndex(
        (p) => p._id === action.payload._id || p.id === action.payload.id,
      );
      if (idx >= 0) {
        state[idx] = action.payload;
      } else {
        state.unshift(action.payload);
      }
    },
    appendPosts: (state, action: PayloadAction<Post[]>) => {
      const existingIds = new Set(state.map((p) => p._id || p.id));
      for (const post of action.payload) {
        if (!existingIds.has(post._id || post.id)) state.push(post);
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      return state.filter(
        (p) => p._id !== action.payload && p.id !== action.payload,
      );
    },
    addComment: (
      state,
      action: PayloadAction<{
        postId: string;
        comment: Comment;
        isOffer: boolean;
      }>,
    ) => {
      const post = state.find(
        (p) =>
          p._id === action.payload.postId || p.id === action.payload.postId,
      );
      if (post) {
        post.comments.push(action.payload.comment);
        if (action.payload.isOffer) post.responsesCount++;
      }
    },
    updatePostStatus: (
      state,
      action: PayloadAction<{
        postId: string;
        status: Post["status"];
      }>,
    ) => {
      const post = state.find(
        (p) =>
          p._id === action.payload.postId || p.id === action.payload.postId,
      );
      if (post) post.status = action.payload.status;
    },
    // Call on logout to allow a fresh fetch on next login
    clearPosts: () => {
      _fetchPostsInFlight = false;
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (_state, action) => {
      _fetchPostsInFlight = false;
      return action.payload.posts;
    });
    builder.addCase(fetchPostsPage.fulfilled, (state, action) => {
      const existingIds = new Set(state.map((p) => p._id || p.id));
      for (const post of action.payload.posts) {
        if (!existingIds.has(post._id || post.id)) state.push(post);
      }
    });
  },
});

export const {
  upsertPost,
  appendPosts,
  deletePost,
  addComment,
  updatePostStatus,
  clearPosts,
} = postsSlice.actions;
export default postsSlice.reducer;

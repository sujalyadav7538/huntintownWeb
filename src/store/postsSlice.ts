import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Post, Comment } from "../types";
import { apiFetch } from "../lib/api";

const initialState: Post[] = [];

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
      rating: p.author?.rating ?? undefined,
      reputation: p.author?.reputation ?? undefined,
      location: p.author?.location || p.location || "",
    },
    status: p.status,          // raw backend value: live | in_progress | completed | expired | cancelled
    comments: p.comments ?? [],
    offersCount: p.offersCount ?? 0,
    questions: p.questions ?? [],
    images: p.images ?? [],
  } as Post;
}

// Fetch all posts from public endpoint
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await apiFetch("/api/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  const data: { success: boolean; count: number; posts: any[] } = await res.json();
  return data.posts.map(normalizePost);
});

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (_state, action: PayloadAction<Post[]>) => {
      return action.payload;
    },
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
    createPost: (state, action: PayloadAction<Post>) => {
      state.unshift(action.payload);
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
        (p) => p._id === action.payload.postId || p.id === action.payload.postId,
      );
      if (post) {
        post.comments.push(action.payload.comment);
        if (action.payload.isOffer) post.offersCount++;
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
        (p) => p._id === action.payload.postId || p.id === action.payload.postId,
      );
      if (post) post.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (_state, action) => {
      return action.payload;
    });
  },
});

export const {
  setPosts,
  upsertPost,
  createPost,
  deletePost,
  addComment,
  updatePostStatus,
} = postsSlice.actions;
export default postsSlice.reducer;

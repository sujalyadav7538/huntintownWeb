import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, Comment } from '../types';

const initialState: Post[] = [];

// Map API status strings to local status type
function mapStatus(apiStatus: string): Post['status'] {
  switch (apiStatus?.toLowerCase()) {
    case 'live':
    case 'open':
      return 'open';
    case 'fulfilled':
      return 'fulfilled';
    case 'cancelled':
    case 'canceled':
      return 'cancelled';
    default:
      return 'open';
  }
}

// Fetch posts from the API
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data: {
    success: boolean;
    count: number;
    posts: Array<{
      _id: string;
      title: string;
      description: string;
      category: string;
      location: string;
      type: 'help_needed' | 'skill_offered';
      budget?: string;
      timeline?: string;
      status: string;
      expiryDays?: number;
      expiresAt: string;
      questions?: string[];
      images?: string[];
      comments: Comment[];
      offersCount: number;
      createdAt: string;
      updatedAt: string;
      author: { id: string; name: string; email?: string; avatar: string };
    }>;
  } = await res.json();

  return data.posts.map((p) => ({
    id: p._id,
    title: p.title,
    description: p.description,
    category: p.category,
    location: p.location,
    type: p.type,
    budget: p.budget,
    author: {
      id: p.author.id,
      name: p.author.name,
      avatar: p.author.avatar,
      role: '',
      location: p.location,
    },
    createdAt: p.createdAt,
    expiresAt: p.expiresAt,
    expiryDays: p.expiryDays,
    questions: p.questions ?? [],
    status: mapStatus(p.status),
    comments: p.comments ?? [],
    offersCount: p.offersCount ?? 0,
  } satisfies Post));
});

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    createPost: (state, action: PayloadAction<Post>) => {
      state.unshift(action.payload);
    },
    deletePost: (state, action: PayloadAction<string>) => {
      return state.filter((p) => p.id !== action.payload);
    },
    addComment: (
      state,
      action: PayloadAction<{ postId: string; comment: Comment; isOffer: boolean }>
    ) => {
      const post = state.find((p) => p.id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload.comment);
        if (action.payload.isOffer) post.offersCount++;
      }
    },
    updatePostStatus: (
      state,
      action: PayloadAction<{ postId: string; status: 'open' | 'fulfilled' | 'cancelled' }>
    ) => {
      const post = state.find((p) => p.id === action.payload.postId);
      if (post) post.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (_state, action) => {
      return action.payload;
    });
  },
});

export const { createPost, deletePost, addComment, updatePostStatus } = postsSlice.actions;
export default postsSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postsReducer from './postsSlice';
import conversationsReducer from './conversationsSlice';
import uiReducer from './uiSlice';
import { persistAuthStorage } from '../lib/authStorage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    conversations: conversationsReducer,
    ui: uiReducer,
  },
});

// Sync entire relevant state to localStorage on every change
store.subscribe(() => {
  const state = store.getState();

  persistAuthStorage({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.currentUser,
    token: state.auth.token,
  });

  if (state.auth.isAuthenticated && state.auth.token) {
    localStorage.setItem('neighbourly_posts', JSON.stringify(state.posts));
    localStorage.setItem(
      'neighbourly_conversations',
      JSON.stringify(state.conversations.conversations)
    );
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postsReducer from './postsSlice';
import conversationsReducer from './conversationsSlice';
import uiReducer from './uiSlice';

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
  localStorage.setItem('neighbourly_auth', String(state.auth.isAuthenticated));
  localStorage.setItem('neighbourly_user', JSON.stringify(state.auth.currentUser));
  localStorage.setItem('neighbourly_posts', JSON.stringify(state.posts));
  localStorage.setItem(
    'neighbourly_conversations',
    JSON.stringify(state.conversations.conversations)
  );
  if (state.auth.token) {
    localStorage.setItem('access_token', state.auth.token);
  } else {
    localStorage.removeItem('access_token');
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

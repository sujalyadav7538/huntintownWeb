import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postsReducer from './postsSlice';
import conversationsReducer from './conversationsSlice';
import uiReducer from './uiSlice';
import reputationReducer from './reputationSlice';
import { persistAuthStorage } from '../lib/authStorage';
import { setApiTokenGetter } from '../lib/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    conversations: conversationsReducer,
    ui: uiReducer,
    reputation: reputationReducer,
  },
});

// Single source of truth for auth token — all apiFetch calls read from here
setApiTokenGetter(() => store.getState().auth.token);

// Sync auth + conversations to localStorage on every state change
store.subscribe(() => {
  const state = store.getState();

  persistAuthStorage({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.currentUser,
    token: state.auth.token,
  });

  if (state.auth.isAuthenticated && state.auth.token) {
    localStorage.setItem(
      'neighbourly_conversations',
      JSON.stringify(state.conversations.conversations)
    );
  } else {
    localStorage.removeItem('neighbourly_conversations');
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

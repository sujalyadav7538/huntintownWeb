import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/src/store/authSlice";
import postsReducer from "@/src/store/postsSlice";
import conversationsReducer from "@/src/store/conversationsSlice";
import uiReducer from "@/src/store/uiSlice";
import reputationReducer from "@/src/store/reputationSlice";

/**
 * Kept separate from `store/index.ts` so `RootState` can be derived from the
 * reducers alone. Deriving it from the store instance instead would make it
 * circular: the store's `preloadedState` comes from persistence, which is typed
 * against `RootState`.
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  conversations: conversationsReducer,
  ui: uiReducer,
  reputation: reputationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

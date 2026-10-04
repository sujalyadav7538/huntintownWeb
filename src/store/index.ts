import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "@/src/store/rootReducer";
import {
  loadPersistedState,
  persistenceMiddleware,
} from "@/src/store/persistence";
import { setApiTokenGetter } from "@/src/shared/lib/api";

export const store = configureStore({
  reducer: rootReducer,

  // Rehydrated from localStorage; see store/persistence.ts for what survives.
  preloadedState: loadPersistedState(),

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});

// Single source of truth for the auth token — all apiFetch calls read from here
setApiTokenGetter(() => store.getState().auth.token);

export type { RootState } from "@/src/store/rootReducer";
export type AppDispatch = typeof store.dispatch;

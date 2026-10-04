import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/src/shared/types";
import { socket } from "@/src/shared/lib/socket";
import { AUTH_REDIRECT_LOCK_KEY } from "@/src/shared/lib/authStorage";

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
}

// A stored session is rehydrated through store/persistence.ts (preloadedState),
// not read here — the slice itself stays free of storage access.
const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      // persistenceMiddleware writes the session to localStorage
      socket.auth = { token: action.payload.token };
      sessionStorage.removeItem(AUTH_REDIRECT_LOCK_KEY);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.token = null;
      // persistenceMiddleware clears the stored session
      socket.auth = { token: "" };
      socket.disconnect();
    },
    updateProfile: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      // persistenceMiddleware persists the updated user
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;

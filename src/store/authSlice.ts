import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import { socket } from "../lib/socket";
import { AUTH_REDIRECT_LOCK_KEY } from "../lib/authStorage";

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated:
    !!localStorage.getItem("access_token") &&
    localStorage.getItem("neighbourly_auth") === "true",
  currentUser: (() => {
    const saved = localStorage.getItem("neighbourly_user");
    return saved ? (JSON.parse(saved) as User) : null;
  })(),
  token: localStorage.getItem("access_token"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      // store subscriber persists to localStorage via persistAuthStorage
      socket.auth = { token: action.payload.token };
      sessionStorage.removeItem(AUTH_REDIRECT_LOCK_KEY);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.token = null;
      // store subscriber calls persistAuthStorage which clears localStorage
      socket.auth = { token: "" };
      socket.disconnect();
    },
    updateProfile: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      // store subscriber persists the updated user via persistAuthStorage
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;

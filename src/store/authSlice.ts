import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { INITIAL_USER } from '../data';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem('neighbourly_auth') === 'true',
  currentUser: (() => {
    const saved = localStorage.getItem('neighbourly_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  })(),
  token: localStorage.getItem('access_token'),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
    updateProfile: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;

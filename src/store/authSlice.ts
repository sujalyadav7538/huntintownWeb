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
    return saved ? (JSON.parse(saved) as User) : INITIAL_USER;
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
      localStorage.setItem('neighbourly_auth', 'true');
      localStorage.setItem('neighbourly_user', JSON.stringify(action.payload.user));
      localStorage.setItem('access_token', action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = INITIAL_USER;
      state.token = null;
      localStorage.removeItem('neighbourly_auth');
      localStorage.removeItem('neighbourly_user');
      localStorage.removeItem('access_token');
    },
    updateProfile: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      localStorage.setItem('neighbourly_user', JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;

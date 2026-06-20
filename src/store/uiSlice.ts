import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isCreatePostOpen: boolean;
  isLoginOpen: boolean;
  isMobileSimulated: boolean;
  searchTerm: string;
}

const initialState: UIState = {
  isCreatePostOpen: false,
  isLoginOpen: false,
  isMobileSimulated: false,
  searchTerm: '',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCreatePost: (state) => { state.isCreatePostOpen = true; },
    closeCreatePost: (state) => { state.isCreatePostOpen = false; },
    openLoginModal: (state) => { state.isLoginOpen = true; },
    closeLoginModal: (state) => { state.isLoginOpen = false; },
    setMobileSimulated: (state, action: PayloadAction<boolean>) => {
      state.isMobileSimulated = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const {
  openCreatePost,
  closeCreatePost,
  openLoginModal,
  closeLoginModal,
  setMobileSimulated,
  setSearchTerm,
} = uiSlice.actions;
export default uiSlice.reducer;

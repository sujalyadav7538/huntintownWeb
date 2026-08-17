import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isCreatePostOpen: boolean;
  searchTerm: string;
  hideMobileBottomNav?: boolean;
}

const initialState: UIState = {
  isCreatePostOpen: false,
  searchTerm: '',
  hideMobileBottomNav: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCreatePost: (state) => { state.isCreatePostOpen = true; },
    closeCreatePost: (state) => { state.isCreatePostOpen = false; },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    handleHideMobileBottomNav: (state, action: PayloadAction<boolean>) => {
      state.hideMobileBottomNav = action.payload;
    }
  },
});

export const {
  openCreatePost,
  closeCreatePost,
  setSearchTerm,
  handleHideMobileBottomNav,
} = uiSlice.actions;
export default uiSlice.reducer;

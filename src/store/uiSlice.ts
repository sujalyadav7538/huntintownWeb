import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isCreatePostOpen: boolean;
  searchTerm: string;
}

const initialState: UIState = {
  isCreatePostOpen: false,
  searchTerm: '',
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
  },
});

export const {
  openCreatePost,
  closeCreatePost,
  setSearchTerm,
} = uiSlice.actions;
export default uiSlice.reducer;

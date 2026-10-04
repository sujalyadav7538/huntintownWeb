import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppTheme = "dark" | "light";

interface UIState {
  /** Persisted preference — see store/persistence.ts */
  theme: AppTheme;

  /** Transient: never persisted, always false on a fresh load. */
  isCreatePostOpen: boolean;
  isSidePanelOpen: boolean;
  searchTerm: string;
  hideMobileBottomNav: boolean;
  hideUpperNavigation: boolean;
}

const prefersDark = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const initialState: UIState = {
  theme: prefersDark() ? "dark" : "light",
  isCreatePostOpen: false,
  isSidePanelOpen: false,
  searchTerm: "",
  hideMobileBottomNav: false,
  hideUpperNavigation: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    openCreatePost: (state) => {
      state.isCreatePostOpen = true;
    },
    closeCreatePost: (state) => {
      state.isCreatePostOpen = false;
    },
    openSidePanel: (state) => {
      state.isSidePanelOpen = true;
    },
    closeSidePanel: (state) => {
      state.isSidePanelOpen = false;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    handleHideMobileBottomNav: (state, action: PayloadAction<boolean>) => {
      state.hideMobileBottomNav = action.payload;
    },
    handleHideUpperNavigation: (state, action: PayloadAction<boolean>) => {
      state.hideUpperNavigation = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  openCreatePost,
  closeCreatePost,
  openSidePanel,
  closeSidePanel,
  setSearchTerm,
  handleHideMobileBottomNav,
  handleHideUpperNavigation,
} = uiSlice.actions;

export default uiSlice.reducer;

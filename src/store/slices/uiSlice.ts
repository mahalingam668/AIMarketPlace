import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarCollapsed: boolean;
  activePage: string;
  searchOpen: boolean;
  notificationsOpen: boolean;
  theme: 'dark' | 'light';
}

const initialState: UIState = {
  sidebarCollapsed: false,
  activePage: 'dashboard',
  searchOpen: false,
  notificationsOpen: false,
  theme: (localStorage.getItem('theme') as 'dark' | 'light') || 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setActivePage(state, action: PayloadAction<string>) {
      state.activePage = action.payload;
    },
    toggleSearch(state) {
      state.searchOpen = !state.searchOpen;
      if (state.searchOpen) {
        state.notificationsOpen = false;
      }
    },
    toggleNotifications(state) {
      state.notificationsOpen = !state.notificationsOpen;
      if (state.notificationsOpen) {
        state.searchOpen = false;
      }
    },
    setTheme(state, action: PayloadAction<'dark' | 'light'>) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setActivePage,
  toggleSearch,
  toggleNotifications,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;

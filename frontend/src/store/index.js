import { configureStore, createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
  },
});

export const { toggleSidebar, closeSidebar, openSidebar } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});
import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dashboardSummary: null,
    notifications: [],
    status: "idle",
  },
  reducers: {
    setDashboardSummary: (state, action) => {
      state.dashboardSummary = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

export const { setDashboardSummary, setNotifications } = adminSlice.actions;
export const adminReducer = adminSlice.reducer;

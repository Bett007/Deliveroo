import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    currentOrders: [],
    orderHistory: [],
    selectedOrderId: null,
    filters: {
      status: "all",
      query: "",
    },
    status: "idle",
    error: null,
  },
  reducers: {
    setOrders: (state, action) => {
      state.currentOrders = action.payload.currentOrders ?? [];
      state.orderHistory = action.payload.orderHistory ?? [];
    },
    selectOrder: (state, action) => {
      state.selectedOrderId = action.payload;
    },
    setOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { setOrders, selectOrder, setOrderFilters } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;

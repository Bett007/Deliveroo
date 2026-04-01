import { createSlice } from "@reduxjs/toolkit";
import { mockCurrentOrders, mockOrderHistory } from "./mockOrders";

function createOrderId() {
  return `DLV-${Math.floor(1000 + Math.random() * 9000)}`;
}

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    currentOrders: mockCurrentOrders,
    orderHistory: mockOrderHistory,
    selectedOrderId: null,
    filters: {
      status: "all",
      query: "",
    },
    status: "idle",
    error: null,
  },
  reducers: {
    createOrder: {
      reducer: (state, action) => {
        state.currentOrders.unshift(action.payload);
      },
      prepare: (payload) => {
        const now = new Date().toISOString();
        return {
          payload: {
            id: createOrderId(),
            status: "placed",
            createdAt: now,
            updatedAt: now,
            distanceKm: 0,
            durationMinutes: 0,
            ...payload,
          },
        };
      },
    },
    updateOrderDestination: (state, action) => {
      const order = state.currentOrders.find((item) => item.id === action.payload.id);

      if (!order) {
        return;
      }

      order.destination = action.payload.destination;
      order.updatedAt = new Date().toISOString();
    },
    cancelOrder: (state, action) => {
      const index = state.currentOrders.findIndex((item) => item.id === action.payload);

      if (index === -1) {
        return;
      }

      const order = state.currentOrders[index];
      order.status = "cancelled";
      order.updatedAt = new Date().toISOString();
      state.orderHistory.unshift(order);
      state.currentOrders.splice(index, 1);
    },
    selectOrder: (state, action) => {
      state.selectedOrderId = action.payload;
    },
    setOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { createOrder, updateOrderDestination, cancelOrder, selectOrder, setOrderFilters } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;

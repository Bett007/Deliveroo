import { createSlice } from "@reduxjs/toolkit";
import { registerUser, updateProfile, verifyRegistration } from "../auth/authSlice";
import { cancelOrder, createOrder, fetchOrders } from "../orders/ordersSlice";

function buildNotification(message, type = "info") {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
    type,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    seenOrderIds: [],
  },
  reducers: {
    markAllNotificationsRead: (state) => {
      state.items = state.items.map((item) => ({ ...item, read: true }));
    },
    dismissNotification: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    addNotification: (state, action) => {
      state.items.unshift(buildNotification(action.payload.message, action.payload.type));
      state.items = state.items.slice(0, 12);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        const unseenOrders = action.payload.items.filter((order) => !state.seenOrderIds.includes(String(order.id)));

        if (unseenOrders.length) {
          state.items.unshift(
            buildNotification(
              unseenOrders.length === 1
                ? `Order #${unseenOrders[0].id} received.`
                : `${unseenOrders.length} new orders received.`,
              "order",
            ),
          );
          state.items = state.items.slice(0, 12);
        }

        state.seenOrderIds = action.payload.items.map((order) => String(order.id));
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(buildNotification(`Order #${action.payload.order.id} created successfully.`, "success"));
        state.items = state.items.slice(0, 12);
        state.seenOrderIds = Array.from(new Set([String(action.payload.order.id), ...state.seenOrderIds]));
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.items.unshift(buildNotification(`Order #${action.payload.order.id} cancelled.`, "warning"));
        state.items = state.items.slice(0, 12);
      })
      .addCase(verifyRegistration.fulfilled, (state) => {
        state.items.unshift(buildNotification("Verification step completed.", "success"));
        state.items = state.items.slice(0, 12);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.items.unshift(buildNotification(`Account created for ${action.payload.user.email}.`, "success"));
        state.items = state.items.slice(0, 12);
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.items.unshift(buildNotification("Profile updated successfully.", "success"));
        state.items = state.items.slice(0, 12);
      });
  },
});

export const { addNotification, dismissNotification, markAllNotificationsRead } = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;

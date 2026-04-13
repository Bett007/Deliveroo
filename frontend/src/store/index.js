import { configureStore } from "@reduxjs/toolkit";
import { adminReducer } from "../features/admin/adminSlice";
import { authReducer } from "../features/auth/authSlice";
import { notificationsReducer } from "../features/notifications/notificationsSlice";
import { ordersReducer } from "../features/orders/ordersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    admin: adminReducer,
    notifications: notificationsReducer,
  },
});

import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/authSlice";
import { ordersReducer } from "../features/orders/ordersSlice";
import { adminReducer } from "../features/admin/adminSlice";
import { notificationsReducer } from "../features/notifications/notificationsSlice";
import { AppRouter } from "../routes/AppRouter";

function createTestStore(preloadedAuth = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      orders: ordersReducer,
      admin: adminReducer,
      notifications: notificationsReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        verificationPending: false,
        verificationEmail: "",
        verificationCode: "",
        verificationExpiresAt: null,
        status: "idle",
        registerStatus: "idle",
        verifyStatus: "idle",
        resendStatus: "idle",
        error: null,
        fieldErrors: {},
        ...preloadedAuth,
      },
    },
  });
}

describe("AppRouter", () => {
  it("renders landing page on /", () => {
    window.history.pushState({}, "", "/");
    const store = createTestStore();

    render(
      <Provider store={store}>
        <AppRouter />
      </Provider>,
    );

    expect(screen.getByText(/move parcels with confidence from booking to delivery/i)).toBeInTheDocument();
  });

  it("renders login route on /login", () => {
    window.history.pushState({}, "", "/login");
    const store = createTestStore();

    render(
      <Provider store={store}>
        <AppRouter />
      </Provider>,
    );

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it("renders not found page on unknown route", () => {
    window.history.pushState({}, "", "/route-that-does-not-exist");
    const store = createTestStore();

    render(
      <Provider store={store}>
        <AppRouter />
      </Provider>,
    );

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});

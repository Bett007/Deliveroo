import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/authSlice";
import { LoginPage } from "../pages/LoginPage";

function renderLoginPage() {
  const store = configureStore({
    reducer: {
      auth: authReducer,
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
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>,
  );
}

describe("LoginPage", () => {
  it("renders auth heading", () => {
    renderLoginPage();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it("renders email and password fields", () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  });

  it("renders sign in button", () => {
    renderLoginPage();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});

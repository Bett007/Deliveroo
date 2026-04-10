import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { LoginPage } from "../pages/LoginPage";

const renderWithStore = () => {
  const store = configureStore({
    reducer: {
      auth: () => ({
        status: "idle",
        error: null,
        fieldErrors: {},
        user: null,
      }),
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
};

describe("LoginPage", () => {
  it("renders heading", () => {
    renderWithStore();

    expect(
      screen.getByText(/access your role-specific workspace/i)
    ).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    renderWithStore();

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  });

  it("renders sign in button", () => {
    renderWithStore();

    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });
});
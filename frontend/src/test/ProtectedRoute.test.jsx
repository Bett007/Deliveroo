import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ProtectedRoute } from "../routes/ProtectedRoute";

function renderRoute(token) {
  const store = configureStore({
    reducer: {
      auth: (state = { token, user: token ? { role: "customer", email: "test@deliveroo.app" } : null }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/orders"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/orders" element={<div>Protected Orders</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe("ProtectedRoute", () => {
  it("renders protected content when token exists", () => {
    renderRoute("token-value");
    expect(screen.getByText(/protected orders/i)).toBeInTheDocument();
  });

  it("redirects to login when token is missing", () => {
    renderRoute(null);
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});

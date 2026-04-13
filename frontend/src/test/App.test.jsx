import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "../App";

describe("App", () => {
  it("renders without crashing", () => {
    const store = configureStore({
      reducer: {
        auth: () => ({
          status: "idle",
          error: null,
          fieldErrors: {},
          user: null,
        }),
        orders: () => ({}),
        admin: () => ({}),
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(document.body).toBeInTheDocument();
  });
});

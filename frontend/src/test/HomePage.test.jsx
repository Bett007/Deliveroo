import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";

describe("HomePage", () => {
  it("renders landing title", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(
      screen.getByText(/move parcels with confidence from booking to delivery/i)
    ).toBeInTheDocument();
  });

  it("renders role sections", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/built for delivery teams/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Customers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Riders" })).toBeInTheDocument();
  });
});

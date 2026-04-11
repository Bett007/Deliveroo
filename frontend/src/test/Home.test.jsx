import { render, screen } from "@testing-library/react";
import { HomePage } from "../pages/HomePage";

describe("HomePage", () => {
  it("renders hero section", () => {
    render(<HomePage />);

    expect(
      screen.getByText(/deliver parcels with a faster/i)
    ).toBeInTheDocument();
  });

  it("renders customer section", () => {
    render(<HomePage />);

    expect(
      screen.getByText(/customer experience/i)
    ).toBeInTheDocument();
  });

  it("renders admin section", () => {
    render(<HomePage />);

    expect(
      screen.getByText(/admin workspace/i)
    ).toBeInTheDocument();
  });
});
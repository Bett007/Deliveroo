import { render, screen } from "@testing-library/react";
import { HomePage } from "../pages/HomePage";

describe("HomePage", () => {
  it("renders landing title", () => {
    render(<HomePage />);
    expect(screen.getByText(/deliver parcels with a faster, clearer way/i)).toBeInTheDocument();
  });

  it("renders customer and admin sections", () => {
    render(<HomePage />);
    expect(screen.getByText(/customer experience/i)).toBeInTheDocument();
    expect(screen.getByText(/admin workspace/i)).toBeInTheDocument();
  });
});

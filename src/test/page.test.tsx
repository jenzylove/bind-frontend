import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Bind landing page", () => {
  it("renders the headline", () => {
    render(<Home />);
    expect(screen.getByText("Hire the marketplace.")).toBeInTheDocument();
  });

  it("renders prompt chips", () => {
    render(<Home />);
    expect(screen.getByText("token due diligence")).toBeInTheDocument();
    expect(screen.getByText("market brief")).toBeInTheDocument();
  });

  it("renders the generate plan button", () => {
    render(<Home />);
    expect(screen.getByText("Generate plan and quote")).toBeInTheDocument();
  });

  it("renders the footer", () => {
    render(<Home />);
    expect(screen.getByText("Built for the OKX AI Genesis Hackathon")).toBeInTheDocument();
  });
});
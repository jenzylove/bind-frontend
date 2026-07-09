import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Bind landing page", () => {
  it("renders the headline", () => {
    render(<Home />);
    expect(screen.getByText("What are you building?")).toBeInTheDocument();
  });

  it("renders prompt chips", () => {
    render(<Home />);
    expect(screen.getByText("token due diligence")).toBeInTheDocument();
    expect(screen.getByText("market brief")).toBeInTheDocument();
    expect(screen.getByText("honeypot check")).toBeInTheDocument();
  });

  it("renders the generate plan button", () => {
    render(<Home />);
    expect(screen.getByText("Generate Plan")).toBeInTheDocument();
  });

  it("renders the footer", () => {
    render(<Home />);
    expect(screen.getByText("Built for the OKX AI Genesis Hackathon")).toBeInTheDocument();
  });
});
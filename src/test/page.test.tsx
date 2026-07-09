import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Landing from "@/app/page";

describe("Bind landing page", () => {
  it("renders the headline", () => {
    render(<Landing />);
    expect(screen.getByText("One goal. A team of specialists. Verified outcomes.")).toBeInTheDocument();
  });

  it("renders the input", () => {
    render(<Landing />);
    const inputs = screen.getAllByPlaceholderText("What do you want to accomplish?");
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it("renders how it works section", () => {
    render(<Landing />);
    expect(screen.getByText("Plan")).toBeInTheDocument();
    expect(screen.getByText("Execute")).toBeInTheDocument();
    expect(screen.getByText("Deliver")).toBeInTheDocument();
  });

  it("renders use cases", () => {
    render(<Landing />);
    expect(screen.getByText("NFT Collection")).toBeInTheDocument();
    expect(screen.getByText("Smart Contract")).toBeInTheDocument();
  });

  it("renders powered by badge", () => {
    render(<Landing />);
    expect(screen.getByText("Powered by OKX AI")).toBeInTheDocument();
  });
});
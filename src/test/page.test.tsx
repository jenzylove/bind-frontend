import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Mission from "@/app/mission/page";

// The mission page requires WalletProvider — wrap it for tests
import { WalletProvider } from "@/lib/wallet";

function WrappedMission() {
  return (
    <WalletProvider>
      <Mission />
    </WalletProvider>
  );
}

describe("Bind mission dashboard", () => {
  it("renders the goal input", () => {
    render(<WrappedMission />);
    expect(screen.getByPlaceholderText("What do you want to accomplish?")).toBeInTheDocument();
  });

  it("renders the plan button", () => {
    render(<WrappedMission />);
    expect(screen.getByText("Plan workflow")).toBeInTheDocument();
  });
});
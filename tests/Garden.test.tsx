import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Garden } from "@/components/todo/Garden";

describe("Garden", () => {
  it("shows the seed stage and prompt at count 0", () => {
    render(<Garden count={0} />);
    expect(screen.getByRole("img")).toHaveAccessibleName("Today's plant: seed");
    expect(screen.getByText("Harvest a task to start growing.")).toBeVisible();
  });

  it("reflects today's harvest count and remaining-to-bloom", () => {
    render(<Garden count={2} />);
    expect(screen.getByText("2 harvested today")).toBeVisible();
    expect(screen.getByText("3 more to bloom")).toBeVisible();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "2",
    );
  });

  it("shows full bloom at the threshold", () => {
    render(<Garden count={5} />);
    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Today's plant: bloom",
    );
    expect(screen.getByText("In full bloom 🌳")).toBeVisible();
  });
});

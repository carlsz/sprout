import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Checkbox } from "@/components/ui/Checkbox";

describe("Button", () => {
  it("defaults to type=button and the primary variant", () => {
    render(<Button>Plant task</Button>);
    const btn = screen.getByRole("button", { name: "Plant task" });
    expect(btn).toHaveAttribute("type", "button");
    expect(btn.className).toContain("bg-primary");
  });

  it("applies the danger variant", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button", { name: "Delete" }).className).toContain(
      "bg-negative",
    );
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("TextInput", () => {
  it("forwards ref and accepts typing", async () => {
    render(<TextInput aria-label="title" />);
    const input = screen.getByLabelText("title");
    await userEvent.type(input, "hi");
    expect(input).toHaveValue("hi");
  });
});

describe("Checkbox", () => {
  it("renders a native checkbox that toggles", async () => {
    render(<Checkbox aria-label="done" />);
    const box = screen.getByRole("checkbox", { name: "done" });
    expect(box).not.toBeChecked();
    await userEvent.click(box);
    expect(box).toBeChecked();
  });
});

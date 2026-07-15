import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTodo } from "@/components/todo/AddTodo";

describe("AddTodo", () => {
  it("creates a todo on Enter and clears + refocuses the input", async () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);
    const input = screen.getByLabelText("New task");
    await userEvent.type(input, "water plants{Enter}");
    expect(onAdd).toHaveBeenCalledWith("water plants");
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("creates a todo when the Seed button is clicked", async () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);
    await userEvent.type(screen.getByLabelText("New task"), "feed cat");
    await userEvent.click(screen.getByRole("button", { name: "Seed" }));
    expect(onAdd).toHaveBeenCalledWith("feed cat");
  });

  it("ignores whitespace-only input", async () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);
    await userEvent.type(screen.getByLabelText("New task"), "   {Enter}");
    expect(onAdd).not.toHaveBeenCalled();
  });
});

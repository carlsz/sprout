import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "@/components/todo/TodoItem";
import type { Todo } from "@/lib/todos";

const todo: Todo = {
  id: "a",
  title: "water plants",
  done: false,
  createdAt: 0,
};

function setup(overrides: Partial<Todo> = {}) {
  const handlers = { onToggle: vi.fn(), onEdit: vi.fn(), onRemove: vi.fn() };
  render(<TodoItem todo={{ ...todo, ...overrides }} {...handlers} />);
  return handlers;
}

describe("TodoItem", () => {
  it("toggles via the checkbox", async () => {
    const { onToggle } = setup();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith("a");
  });

  it("edits the title inline and saves on Enter", async () => {
    const { onEdit } = setup();
    await userEvent.click(screen.getByRole("button", { name: "water plants" }));
    const input = screen.getByLabelText("Edit task");
    await userEvent.clear(input);
    await userEvent.type(input, "feed plants{Enter}");
    expect(onEdit).toHaveBeenCalledWith("a", "feed plants");
  });

  it("cancels an edit on Escape without saving", async () => {
    const { onEdit } = setup();
    await userEvent.click(screen.getByRole("button", { name: "water plants" }));
    const input = screen.getByLabelText("Edit task");
    await userEvent.clear(input);
    await userEvent.type(input, "changed{Escape}");
    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "water plants" })).toBeVisible();
  });

  it("does not save an empty edit", async () => {
    const { onEdit } = setup();
    await userEvent.click(screen.getByRole("button", { name: "water plants" }));
    const input = screen.getByLabelText("Edit task");
    await userEvent.clear(input);
    await userEvent.type(input, "{Enter}");
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("deletes only after a two-step confirm", async () => {
    const { onRemove } = setup();
    await userEvent.click(
      screen.getByRole("button", { name: 'Delete "water plants"' }),
    );
    expect(onRemove).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledWith("a");
  });

  it("renders completed todos struck through", () => {
    setup({ done: true });
    expect(
      screen.getByRole("button", { name: "water plants" }).className,
    ).toContain("line-through");
  });
});

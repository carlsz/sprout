import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList } from "@/components/todo/TodoList";
import { TodoCount } from "@/components/todo/TodoCount";
import type { Todo } from "@/lib/todos";

const handlers = { onToggle: vi.fn(), onEdit: vi.fn(), onRemove: vi.fn() };
const todos: Todo[] = [
  { id: "a", title: "one", done: false, createdAt: 0 },
  { id: "b", title: "two", done: true, createdAt: 0 },
];

describe("TodoList", () => {
  it("shows the empty state when there are no todos", () => {
    render(<TodoList todos={[]} {...handlers} />);
    expect(screen.getByText("Nothing seeded yet")).toBeVisible();
  });

  it("renders one item per todo", () => {
    render(<TodoList todos={todos} {...handlers} />);
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "one" })).toBeVisible();
  });
});

describe("TodoCount", () => {
  it("counts only active todos", () => {
    render(<TodoCount todos={todos} />);
    expect(screen.getByText("1 task growing")).toBeVisible();
  });

  it("celebrates when all are done", () => {
    render(<TodoCount todos={[{ ...todos[1] }]} />);
    expect(screen.getByText("All harvested 🎉")).toBeVisible();
  });

  it("renders nothing when there are no todos", () => {
    const { container } = render(<TodoCount todos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

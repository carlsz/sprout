import { describe, it, expect } from "vitest";
import {
  addTodo,
  toggleTodo,
  editTodo,
  removeTodo,
  activeCount,
  type Todo,
} from "@/lib/todos";

function make(overrides: Partial<Todo> = {}): Todo {
  return {
    id: crypto.randomUUID(),
    title: "task",
    done: false,
    createdAt: 0,
    ...overrides,
  };
}

describe("addTodo", () => {
  it("prepends a new todo (newest-first)", () => {
    const existing = make({ title: "old" });
    const result = addTodo([existing], "new");
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("new");
    expect(result[1]).toBe(existing);
  });

  it("trims the title", () => {
    expect(addTodo([], "  water plants  ")[0].title).toBe("water plants");
  });

  it("rejects empty and whitespace-only titles (no-op)", () => {
    const todos: Todo[] = [];
    expect(addTodo(todos, "")).toBe(todos);
    expect(addTodo(todos, "   ")).toBe(todos);
  });

  it("assigns a unique id, done=false, and a createdAt", () => {
    const [a] = addTodo([], "a");
    const [b] = addTodo([], "b");
    expect(a.id).not.toBe(b.id);
    expect(a.done).toBe(false);
    expect(typeof a.createdAt).toBe("number");
  });
});

describe("toggleTodo", () => {
  it("flips only the matching todo and stamps completedAt when done", () => {
    const a = make({ id: "a", done: false });
    const b = make({ id: "b", done: false });
    const result = toggleTodo([a, b], "a", 1234);
    expect(result[0].done).toBe(true);
    expect(result[0].completedAt).toBe(1234);
    expect(result[1].done).toBe(false);
    expect(result[1]).toBe(b); // untouched reference
  });

  it("clears completedAt when a todo becomes active again", () => {
    const a = make({ id: "a", done: true, completedAt: 999 });
    const result = toggleTodo([a], "a", 5000);
    expect(result[0].done).toBe(false);
    expect(result[0].completedAt).toBeUndefined();
  });

  it("is a no-op for an unknown id", () => {
    const a = make({ id: "a", done: false });
    expect(toggleTodo([a], "missing", 1)[0].done).toBe(false);
  });
});

describe("editTodo", () => {
  it("renames the matching todo, trimmed", () => {
    const a = make({ id: "a", title: "old" });
    expect(editTodo([a], "a", "  fresh  ")[0].title).toBe("fresh");
  });

  it("rejects an empty edit (list unchanged)", () => {
    const todos = [make({ id: "a", title: "keep" })];
    expect(editTodo(todos, "a", "   ")).toBe(todos);
  });
});

describe("removeTodo", () => {
  it("removes the matching todo and keeps the rest", () => {
    const a = make({ id: "a" });
    const b = make({ id: "b" });
    const result = removeTodo([a, b], "a");
    expect(result).toEqual([b]);
  });
});

describe("activeCount", () => {
  it("counts only not-done todos", () => {
    expect(
      activeCount([
        make({ done: false }),
        make({ done: true }),
        make({ done: false }),
      ]),
    ).toBe(2);
  });
});

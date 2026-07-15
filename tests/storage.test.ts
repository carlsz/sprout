import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { loadTodos, saveTodos, useTodos, STORAGE_KEY } from "@/lib/storage";
import type { Todo } from "@/lib/todos";

const sample: Todo = {
  id: "a",
  title: "water plants",
  done: false,
  createdAt: 1,
};

beforeEach(() => localStorage.clear());

describe("loadTodos / saveTodos", () => {
  it("round-trips through localStorage", () => {
    saveTodos([sample]);
    expect(loadTodos()).toEqual([sample]);
  });

  it("returns [] when nothing is stored", () => {
    expect(loadTodos()).toEqual([]);
  });

  it("degrades to [] on corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadTodos()).toEqual([]);
  });

  it("degrades to [] when stored value is not an array", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nope: true }));
    expect(loadTodos()).toEqual([]);
  });

  it("filters out malformed entries", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([sample, { id: "b" }, null, "x"]),
    );
    expect(loadTodos()).toEqual([sample]);
  });
});

describe("useTodos", () => {
  it("hydrates from localStorage after mount", () => {
    saveTodos([sample]);
    const { result } = renderHook(() => useTodos());
    expect(result.current.hydrated).toBe(true);
    expect(result.current.todos).toEqual([sample]);
  });

  it("adds a todo and persists it", () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo("new task"));
    expect(result.current.todos[0].title).toBe("new task");
    expect(loadTodos()[0].title).toBe("new task");
  });

  it("toggles, edits, and removes, persisting each change", () => {
    saveTodos([sample]);
    const { result } = renderHook(() => useTodos());

    act(() => result.current.toggleTodo("a"));
    expect(result.current.todos[0].done).toBe(true);

    act(() => result.current.editTodo("a", "feed plants"));
    expect(result.current.todos[0].title).toBe("feed plants");

    act(() => result.current.removeTodo("a"));
    expect(result.current.todos).toEqual([]);
    expect(loadTodos()).toEqual([]);
  });
});

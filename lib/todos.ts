// Pure, framework-free domain logic for Sprout todos.
// No React, no storage — every function takes an array and returns a new array.

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  /** Epoch ms the todo was last completed; undefined while not done. Feeds the harvest log. */
  completedAt?: number;
};

/** Create a todo and prepend it (newest-first). Empty/whitespace titles are rejected (no-op). */
export function addTodo(todos: Todo[], title: string): Todo[] {
  const trimmed = title.trim();
  if (!trimmed) return todos;
  const todo: Todo = {
    id: crypto.randomUUID(),
    title: trimmed,
    done: false,
    createdAt: Date.now(),
  };
  return [todo, ...todos];
}

/**
 * Flip the `done` flag of the matching todo, stamping `completedAt` with `now`
 * when it becomes done (and clearing it when it becomes active again).
 * Non-matching ids are untouched.
 */
export function toggleTodo(todos: Todo[], id: string, now: number): Todo[] {
  return todos.map((t) => {
    if (t.id !== id) return t;
    const done = !t.done;
    return { ...t, done, completedAt: done ? now : undefined };
  });
}

/** Rename a todo. Empty/whitespace titles are rejected (returns the list unchanged). */
export function editTodo(todos: Todo[], id: string, title: string): Todo[] {
  const trimmed = title.trim();
  if (!trimmed) return todos;
  return todos.map((t) => (t.id === id ? { ...t, title: trimmed } : t));
}

/** Remove the matching todo. */
export function removeTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((t) => t.id !== id);
}

/** Count of not-yet-done todos. */
export function activeCount(todos: Todo[]): number {
  return todos.reduce((n, t) => (t.done ? n : n + 1), 0);
}

import { activeCount, type Todo } from "@/lib/todos";

/** Live count of active (not-done) todos. */
export function TodoCount({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) return null;
  const active = activeCount(todos);
  return (
    <p className="text-sm font-semibold text-body" aria-live="polite">
      {active === 0
        ? "All harvested 🎉"
        : `${active} ${active === 1 ? "task" : "tasks"} growing`}
    </p>
  );
}

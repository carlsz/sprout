import { EmptyState } from "@/components/todo/EmptyState";
import { TodoItem } from "@/components/todo/TodoItem";
import type { Todo } from "@/lib/todos";

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onRemove: (id: string) => void;
};

export function TodoList({ todos, onToggle, onEdit, onRemove }: TodoListProps) {
  if (todos.length === 0) return <EmptyState />;

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}

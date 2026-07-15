"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { TextInput } from "@/components/ui/TextInput";
import { cn } from "@/lib/cn";
import type { Todo } from "@/lib/todos";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onRemove: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onEdit, onRemove }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [confirming, setConfirming] = useState(false);
  // Set when Escape fires so the subsequent blur cancels instead of saving.
  const escapedRef = useRef(false);

  function startEditing() {
    setDraft(todo.title);
    setEditing(true);
  }

  function commit() {
    if (escapedRef.current) {
      escapedRef.current = false;
      setDraft(todo.title); // discard edit
      setEditing(false);
      return;
    }
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.title) onEdit(todo.id, trimmed);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="flex items-center gap-3 rounded-xl bg-canvas p-4">
        <TextInput
          autoFocus
          value={draft}
          aria-label="Edit task"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Escape") {
              escapedRef.current = true;
              setEditing(false);
            }
          }}
        />
      </li>
    );
  }

  if (confirming) {
    return (
      <li className="flex items-center justify-between gap-2 rounded-xl bg-canvas p-4">
        <span className="min-w-0 truncate text-sm text-body">
          Delete “{todo.title}”?
        </span>
        <span className="flex shrink-0 gap-2">
          <Button
            variant="danger"
            className="px-3 py-1.5 text-sm"
            autoFocus
            onClick={() => onRemove(todo.id)}
          >
            Remove
          </Button>
          <Button
            variant="tertiary"
            className="px-3 py-1.5 text-sm"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </Button>
        </span>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-xl bg-canvas p-4">
      <Checkbox
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={
          todo.done
            ? `Mark "${todo.title}" active`
            : `Mark "${todo.title}" done`
        }
      />

      <button
        type="button"
        onClick={startEditing}
        className={cn(
          "flex-1 truncate text-left text-base",
          todo.done ? "text-mute line-through" : "text-ink",
        )}
        title="Edit task"
      >
        {todo.title}
      </button>

      <Button
        variant="tertiary"
        className="border-0 px-3 py-1.5 text-sm text-body hover:text-negative"
        onClick={() => setConfirming(true)}
        aria-label={`Delete "${todo.title}"`}
      >
        Delete
      </Button>
    </li>
  );
}

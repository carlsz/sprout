"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";

type AddTodoProps = {
  onAdd: (title: string) => void;
};

export function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return; // whitespace-only is a no-op
    onAdd(title);
    setTitle("");
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={submit} className="flex gap-3">
      <TextInput
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Seed a new task…"
        aria-label="New task"
        autoFocus
      />
      <Button type="submit" className="shrink-0">
        Seed
      </Button>
    </form>
  );
}

"use client";

import { AddTodo } from "@/components/todo/AddTodo";
import { Garden } from "@/components/todo/Garden";
import { TodoCount } from "@/components/todo/TodoCount";
import { TodoList } from "@/components/todo/TodoList";
import { useTodos } from "@/lib/storage";

export default function Home() {
  const {
    todos,
    todayCount,
    hydrated,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
  } = useTodos();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          🌱 Sprout
        </h1>
        <p className="mt-2 text-body">Seed a task, watch it grow.</p>
      </header>

      <div className="mb-6">
        <Garden count={todayCount} />
      </div>

      <TodoCount todos={todos} />

      <div className="mt-3 mb-6">
        {hydrated ? (
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onRemove={removeTodo}
          />
        ) : (
          // Reserve space until localStorage hydrates to avoid a content flash.
          <div className="min-h-40" aria-hidden />
        )}
      </div>

      <AddTodo onAdd={addTodo} />
    </main>
  );
}

"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  addTodo as addPure,
  toggleTodo as togglePure,
  editTodo as editPure,
  removeTodo as removePure,
  type Todo,
} from "@/lib/todos";
import { localDate, logToggle, type HarvestLog } from "@/lib/harvest";

export const STORAGE_KEY = "sprout.todos.v1";
export const HARVEST_KEY = "sprout.harvestLog.v1";
const EMPTY: Todo[] = [];
const EMPTY_LOG: HarvestLog = {};

function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    typeof t.done === "boolean" &&
    typeof t.createdAt === "number"
  );
}

function parseTodos(raw: string | null): Todo[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(isTodo);
  } catch {
    return EMPTY;
  }
}

function parseLog(raw: string | null): HarvestLog {
  if (!raw) return EMPTY_LOG;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
      return EMPTY_LOG;
    const out: HarvestLog = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isFinite(value) && value > 0)
        out[key] = value;
    }
    return out;
  } catch {
    return EMPTY_LOG;
  }
}

function readItem(key: string): string | null {
  return typeof window === "undefined"
    ? null
    : window.localStorage.getItem(key);
}

function writeItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage full or unavailable — nothing actionable at this layer.
  }
}

// Cache last parsed results so getSnapshot returns a stable reference until the
// underlying string actually changes (useSyncExternalStore requires this).
let todoCache: { raw: string | null; todos: Todo[] } = {
  raw: null,
  todos: EMPTY,
};
let logCache: { raw: string | null; log: HarvestLog } = {
  raw: null,
  log: EMPTY_LOG,
};

/** Read + validate todos from localStorage. Any corruption/absence degrades to []. */
export function loadTodos(): Todo[] {
  const raw = readItem(STORAGE_KEY);
  if (raw !== todoCache.raw) todoCache = { raw, todos: parseTodos(raw) };
  return todoCache.todos;
}

/** Read + validate the harvest log. Any corruption/absence degrades to {}. */
export function loadLog(): HarvestLog {
  const raw = readItem(HARVEST_KEY);
  if (raw !== logCache.raw) logCache = { raw, log: parseLog(raw) };
  return logCache.log;
}

// Same-document writes don't fire the native "storage" event, so we keep our
// own listener set and notify it after every write.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (typeof window !== "undefined")
    window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    if (typeof window !== "undefined")
      window.removeEventListener("storage", onChange);
  };
}

function notify(): void {
  listeners.forEach((l) => l());
}

/** Persist todos to localStorage and notify subscribers. */
export function saveTodos(todos: Todo[]): void {
  writeItem(STORAGE_KEY, JSON.stringify(todos));
  notify();
}

/** Persist the harvest log to localStorage and notify subscribers. */
export function saveLog(log: HarvestLog): void {
  writeItem(HARVEST_KEY, JSON.stringify(log));
  notify();
}

export type UseTodos = {
  todos: Todo[];
  log: HarvestLog;
  /** Tasks harvested today (local date). Derived from the log. */
  todayCount: number;
  hydrated: boolean;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, title: string) => void;
  removeTodo: (id: string) => void;
};

// Reads the clock, so it lives in a getSnapshot (the sanctioned place for
// impure external reads) rather than a component render body.
function todayHarvestSnapshot(): number {
  return loadLog()[localDate(Date.now())] ?? 0;
}

// Server + first hydration render report `false`, then `true` on the client —
// lets the UI reserve space until localStorage is readable, with no mismatch.
const noopSubscribe = () => () => {};

/**
 * Single source of truth for the UI. localStorage IS the state; reads go through
 * useSyncExternalStore (SSR-safe, cross-tab). Swap this file to move off localStorage.
 */
export function useTodos(): UseTodos {
  const todos = useSyncExternalStore(subscribe, loadTodos, () => EMPTY);
  const log = useSyncExternalStore(subscribe, loadLog, () => EMPTY_LOG);
  const todayCount = useSyncExternalStore(
    subscribe,
    todayHarvestSnapshot,
    () => 0,
  );
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const addTodo = useCallback((title: string) => {
    saveTodos(addPure(loadTodos(), title));
  }, []);
  const toggleTodo = useCallback((id: string) => {
    const now = Date.now();
    const current = loadTodos();
    const todo = current.find((t) => t.id === id);
    saveTodos(togglePure(current, id, now));
    if (todo) saveLog(logToggle(loadLog(), todo, now));
  }, []);
  const editTodo = useCallback((id: string, title: string) => {
    saveTodos(editPure(loadTodos(), id, title));
  }, []);
  const removeTodo = useCallback((id: string) => {
    saveTodos(removePure(loadTodos(), id));
  }, []);

  return {
    todos,
    log,
    todayCount,
    hydrated,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
  };
}

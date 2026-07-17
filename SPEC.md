# Spec: Sprout — a small TODOs app

> **Project status (paused here):** v1 ✅ and Garden **Slice 1** (today's plant) ✅ — all acceptance criteria met; `build`/`typecheck`/`lint`/`test` (49) /`e2e` (1) green. Nothing committed yet. **Next when resumed:** Garden Slice 2 (history) → Slice 3 (trends), per the roadmap below.
>
> **Page layout order:** 🌱 wordmark → Garden card → active-task count → task list → Seed input+button (input sits at the **bottom**, below the list).
>
> This is a living document — update it when decisions change, then implement.

## Objective

Sprout is a fast, single-user TODO app that feels less like a productivity tool and more like a calm, friendly place to keep track of what you're growing toward. It adapts the Wise-inspired design language in [DESIGN.md](DESIGN.md) — heavy display sans, lime-green accent, sage canvas, generous 24px rounded cards — and rebrands it around a **plant/growth** motif ("plant a task, watch it sprout, harvest it done").

**User:** one person managing their own tasks in their browser. No accounts, no collaboration.

**Success looks like:**

- A user can add, edit, complete, and delete todos in under a second each, with no page reload.
- Todos persist across refreshes and browser restarts (localStorage).
- The UI is unmistakably "Sprout" — it applies the design tokens faithfully and reads as a polished, intentional brand, not a generic template.
- The app is accessible (keyboard-operable, WCAG AA contrast) and responsive from 320px to desktop.

### Acceptance criteria (v1)

- [x] **Add:** Typing a title and pressing Enter (or clicking Add) creates a todo; the input clears and refocuses. Empty/whitespace-only titles are rejected.
- [x] **List:** Todos render newest-first in a card list. An empty list shows a branded empty state.
- [x] **Complete:** Toggling a todo's checkbox marks it done (visual: strikethrough + muted + a "sprouted/harvested" affordance) and persists.
- [x] **Edit:** A todo's title can be edited inline; Enter/blur saves, Escape cancels. Empty edit is rejected (reverts).
- [x] **Delete:** A todo can be deleted with a confirming affordance; it disappears and persists.
- [x] **Persist:** All of the above survive a full page reload and a browser restart.
- [x] **Count:** A header shows a live count of active (not-done) todos.

### Out of scope for v1 (explicitly deferred)

Due dates, sorting/grouping, categories/tags/multiple lists, filtering/search, auth, multi-device sync, drag-to-reorder, and any backend/database. The data layer will be abstracted so a future SQLite/Prisma backend can replace localStorage without touching UI components.

## Tech Stack

- **Next.js** (latest, App Router) + **React 19** + **TypeScript** (strict).
- **Tailwind CSS v4** (CSS-first `@theme` config; design tokens mapped from DESIGN.md).
- **Fonts:** Inter (body + sub-display) and a heavy display substitute for the "Wise Sans" role — **Manrope 800** (ExtraBold; Google Fonts' heaviest Manrope) via `next/font`. No proprietary fonts.
- **State/persistence:** localStorage as the single source of truth, read via React's `useSyncExternalStore` (SSR-safe, cross-tab); no external state library.
- **IDs/time:** `crypto.randomUUID()` and `Date.now()`.
- **Testing:** Vitest + React Testing Library (unit/component); Playwright (one e2e happy-path).
- **Tooling:** ESLint (next/core-web-vitals) + Prettier.
- No runtime data dependencies beyond React/Next. Keep the dependency list minimal.

## Commands

```
Install:   npm install
Dev:       npm run dev            # http://localhost:3000
Build:     npm run build
Start:     npm start              # serve production build
Lint:      npm run lint           # eslint
Format:    npm run format         # prettier --write .
Typecheck: npm run typecheck      # tsc --noEmit
Test:      npm test               # vitest run
Test (watch): npm run test:watch  # vitest
E2E:       npm run e2e            # playwright test
```

## Project Structure

```
app/
  layout.tsx          → Root layout: fonts, <body> canvas, metadata
  page.tsx            → The single TODO page (Sprout home)
  globals.css         → Tailwind entry + @theme design tokens
components/
  todo/               → Feature components (TodoList, TodoItem, AddTodo, EmptyState, TodoCount)
  ui/                 → Reusable primitives (Button, Card, TextInput, Checkbox) built on tokens
lib/
  todos.ts            → Todo type + pure CRUD helpers (add/toggle/edit/remove on an array)
  storage.ts          → localStorage read/write + useTodos hook (data abstraction seam)
tests/                → Vitest unit/component tests (mirrors lib/ + components/)
e2e/                  → Playwright specs
DESIGN.md        → Source design language (reference)
SPEC.md               → This spec
```

**Data abstraction seam:** UI talks only to `useTodos()` from `lib/storage.ts`, which returns `{ todos, addTodo, toggleTodo, editTodo, removeTodo }`. Swapping localStorage for a backend later means rewriting only `lib/storage.ts`.

## Code Style

- TypeScript strict; no `any`. Explicit types on exported functions and the `Todo` model.
- Functional React components, hooks for state. Server Components by default; `"use client"` only where interactivity requires it (the todo widgets).
- Tailwind utility classes referencing design tokens (`bg-canvas-soft`, `text-ink`, `rounded-xl`) — no hardcoded hex in components; colors live in `@theme`.
- Pure logic (`lib/todos.ts`) is framework-free and directly unit-testable.
- Naming: `PascalCase` components, `camelCase` functions/vars, `kebab-case` files for non-components, `SCREAMING_SNAKE` consts.

```ts
// lib/todos.ts — pure, testable domain logic (no React, no storage)
export type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
};

export function addTodo(todos: Todo[], title: string): Todo[] {
  const trimmed = title.trim();
  if (!trimmed) return todos; // reject empty; caller shows nothing changed
  const todo: Todo = {
    id: crypto.randomUUID(),
    title: trimmed,
    done: false,
    createdAt: Date.now(),
  };
  return [todo, ...todos]; // newest-first
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}
```

## Design Tokens (Sprout adaptation)

Map DESIGN.md into `app/globals.css` via Tailwind `@theme`. Reuse the token _system_ verbatim, rebranded as Sprout:

- **Accent** `--color-primary: #9fe870` (Sprout green) — reserved for the single primary CTA ("Plant task") and brand mark. Never used as a generic success color.
- **Canvas** `--color-canvas-soft: #e8ebe6` (page), `--color-canvas: #ffffff` (cards). Surface contrast = elevation.
- **Ink** `--color-ink: #0e0f0c` for text/headings; `--color-body: #454745`; `--color-mute: #868685`.
- **Semantic** positive/warning/negative families carried over for status (e.g. delete = negative).
- **Radius** `--radius-xl: 24px` canonical for buttons + cards; `--radius-md: 12px` for inputs; `pill` for badges.
- **Type** heavy display (Manrope 800) for the Sprout wordmark/hero; Inter 600 sub-display; Inter 400 body.
- **Spacing** Tailwind's default numeric scale, which maps 1:1 to the DESIGN 4px scale (`p-6`=24px, `p-3`=12px). Named `--spacing-*` tokens are deliberately avoided — `xl`/`2xl`/`3xl` would shadow Tailwind's size keys used by `max-w-*`/`text-*`.

**Brand voice:** seed/growth language — a new todo is "seeded," completing it is "harvested," the empty state invites you to "seed your first task." "Seed" is the planting verb (button + placeholder); "grow" and "harvest" mark the lifecycle. Keep it light, never twee.

**Wordmark:** "Sprout" set in the heavy display face (Manrope 800) preceded by a 🌱 plant emoji as the mark — no custom SVG asset needed.

## Testing Strategy

- **Framework:** Vitest + React Testing Library; Playwright for e2e.
- **Unit (`tests/`):** `lib/todos.ts` pure helpers — add rejects empty/whitespace, add prepends newest-first, toggle flips only the target, edit trims + rejects empty, remove deletes the right one. Aim for 100% on `lib/todos.ts`.
- **Component:** AddTodo (Enter creates + clears), TodoItem (toggle, inline edit save/cancel, delete), EmptyState renders when list empty.
- **Persistence:** test `lib/storage.ts` against a mocked/`jsdom` localStorage — writes round-trip, corrupt/missing data degrades to empty list.
- **E2E (one happy path):** load → add two todos → complete one → edit one → delete one → reload → state persists.
- **Coverage expectation:** `lib/` ≥ 90%; components cover the interactions above. Run `npm test` before every commit.

## Boundaries

- **Always:** Run `npm run typecheck` + `npm test` + `npm run lint` before committing. Reference design tokens (never hardcode hex/px in components). Keep UI decoupled from storage via `useTodos`. Keep `lib/todos.ts` React-free and pure. Maintain keyboard accessibility and AA contrast.
- **Ask first:** Adding any runtime dependency. Introducing a backend/database or auth. Expanding scope beyond the v1 acceptance criteria. Changing the data model shape. Changing brand colors/tokens away from the DESIGN.md system.
- **Never:** Commit secrets. Reintroduce Wise's literal copy/trademarks (this is Sprout, inspired by, not a clone). Use Sprout green as a generic success indicator. Ship sharp-cornered CTAs (24px pill geometry is non-negotiable). Remove or skip failing tests to make a commit pass.

## Success Criteria (definition of done for v1)

1. All acceptance-criteria checkboxes pass, verified by tests + manual check.
2. `npm run build`, `npm run typecheck`, `npm run lint`, and `npm test` all pass clean.
3. The e2e happy-path passes and persistence survives reload.
4. The rendered app visibly applies the Sprout tokens (green CTA, sage canvas, 24px cards, heavy display wordmark) and is responsive 320px→desktop.
5. No hardcoded colors in components; all sourced from `@theme` tokens.

## Resolved Questions

1. **Display font:** Manrope **800** (Google Fonts' heaviest Manrope; 900 unavailable) as the "Wise Sans" substitute. **Resolved.**
2. **Delete affordance:** two-step inline confirm ("Delete '…'?" → Remove / Cancel). **Resolved.**
3. **Completed todos:** stay in the list, muted + struck-through (no separate "Harvested" section in v1). **Resolved.**
4. **App name/wordmark:** "Sprout" in the heavy display face + a 🌱 plant emoji mark — no custom SVG asset. **Resolved.**

---

# Roadmap: v1.1 — The Garden (Today's Harvest)

> Status: **Slice 1 implemented** ✅ (today's plant). Builds on v1 without touching its acceptance criteria. Slices 2 (history) and 3 (trends) remain planned.

## Objective

Turn completing a task into visible growth. A virtual plant grows through stages as you **harvest** (complete) tasks _today_, resetting fresh each day. A persisted **daily harvest log** is the foundation — the same data later powers a history view and trend/streak stats.

**Why today's-harvest:** daily reset gives a fresh, low-pressure motivation loop (yesterday's undone tasks don't shrink today's plant), and the per-day log is exactly what history + trends read from.

## Data model

- **New store** `sprout.harvestLog.v1` → `Record<string, number>` keyed by **local** date `YYYY-MM-DD`, value = tasks harvested that day. Own load/save with validation (same defensive parsing as todos: corrupt → `{}`).
- **Extend `Todo`** with optional `completedAt?: number` (epoch ms). Backward-compatible — existing stored todos lack it and are treated as `undefined`; `isTodo` continues to ignore extra/optional fields.
- **Harvest events** (all in pure functions taking an explicit `now`, so they're unit-testable across day boundaries):
  - complete (not-done → done): set `completedAt = now`; `log[localDate(now)] += 1`.
  - un-complete (done → not-done): `log[localDate(completedAt)] -= 1` (floor 0); clear `completedAt`. Correct even if un-checked on a later day.
  - delete a completed task: **no change** to the log — a harvest that happened, stays logged.

## Plant stages

Stage derives from today's count `n = log[today] ?? 0`:

| n   | stage    | emoji |
| --- | -------- | ----- |
| 0   | seed     | 🌰    |
| 1   | sprout   | 🌱    |
| 2   | seedling | 🌿    |
| 3–4 | leafing  | 🪴    |
| 5+  | bloom    | 🌳    |

Bloom threshold = **5 harvests/day** (tunable constant). Caption: `"{n} harvested today"` + hint `"{5−n} to bloom"`, switching to `"In full bloom 🌳"` at ≥5. Subtle scale/fade transition on stage change.

## UI — Slice 1 (this round)

A **Garden card** at the top of the page (below the wordmark, above the task list): large plant emoji, a thin progress bar (`n/5` capped, `bg-primary` fill on `bg-canvas-soft` track), and the caption. Token-driven `Card`. On an empty/zero-harvest day it shows 🌰 with a gentle "Harvest a task to start growing" caption.

### Acceptance criteria (Slice 1)

- [x] Completing a task increments today's count; the plant advances a stage when a threshold is crossed. Persists across reload.
- [x] Un-completing a task decrements today's count and regresses the plant; midnight-correct (decrements the day it was completed).
- [x] Deleting an already-completed task does **not** reduce today's count.
- [x] Reaching 5 harvests shows full bloom 🌳; below 5 shows the "N to bloom" hint.
- [x] Garden card renders at 🌰 seed on a fresh day with no harvests.
- [x] Stage + log logic covered by unit tests with an injected `now` (including a complete-on-day-A, un-complete-on-day-B case).

## Later slices (spec'd when we get there)

- **Slice 2 — Garden history:** a calendar/grid of past days, each showing that day's final plant stage + count. Reads `harvestLog`.
- **Slice 3 — Trends:** current & best streak (consecutive days with ≥1 harvest), a 7-day sparkline, all-time total harvested.

## Resolved decisions

1. **Bloom at 5 harvests/day.** Resolved.
2. **Stage emojis 🌰→🌱→🌿→🪴→🌳** (tree as the permanent-growth bloom). Resolved.
3. **Garden card placement** above the Seed input. Resolved.

## Critical User Journeys

<!-- BEGIN ux-agent-skills:cuj-index — generated from .ux/cujs/; edit the CUJ files, not this table -->
| ID | Journey | Actor | Criticality | Goal | File |
|---|---|---|---|---|---|
| CUJ-001 | Add a task | Casual gamer evaluating Sprout for the first time, with no tasks saved yet | critical | Seed a first task from the empty state without navigating away | [.ux/cujs/CUJ-001-add-a-task.md](.ux/cujs/CUJ-001-add-a-task.md) |
| CUJ-002 | Complete a task | The same casual gamer, now holding the single task they seeded — Sprout is a single-user app | high | Harvest a task and see it credited to today's plant | [.ux/cujs/CUJ-002-complete-a-task.md](.ux/cujs/CUJ-002-complete-a-task.md) |
| CUJ-003 | Reach full bloom | The same casual gamer, working through a day's list of five tasks, chasing the garden's full-bloom reward | medium | Grow today's plant to full bloom by harvesting five tasks in a single day | [.ux/cujs/CUJ-003-reach-full-bloom.md](.ux/cujs/CUJ-003-reach-full-bloom.md) |
<!-- END ux-agent-skills:cuj-index -->

# Tasks: Sprout v1

Ordered by dependency. Each task fits one focused session and touches ≤5 files. See [plan.md](plan.md) and [SPEC.md](../SPEC.md).

> **Status: all 12 tasks complete.** `build` · `typecheck` · `lint` · `test` (37) · `e2e` (1) all green; walked through every acceptance criterion live at 320px→desktop.
>
> **Deviations from plan (intentional):**
>
> - **Display font is Manrope 800**, not 900 — Google Fonts' Manrope tops out at ExtraBold (800). Plenty heavy for the Wise-Sans role.
> - **`lib/storage.ts` uses `useSyncExternalStore`**, not a `useEffect` hydration pattern. React 19's `react-hooks/set-state-in-effect` lint rule flagged setState-in-effect; `useSyncExternalStore` is the idiomatic external-store read — SSR-safe via `getServerSnapshot`, single source of truth, plus free cross-tab sync.
> - **Spacing uses Tailwind's default numeric scale** (which maps 1:1 to the DESIGN 4px scale) rather than named `--spacing-*` tokens, which would shadow Tailwind's `xl`/`2xl` size keys used by `max-w-*`/`text-*`.

## Slice 1 — Foundation

- [x] **T1. Scaffold Next.js app**
  - Acceptance: `create-next-app` (App Router, TS strict, Tailwind v4, ESLint) initialized in repo root without clobbering `DESIGN.md`/`SPEC.md`/`tasks/`; dev server renders default page.
  - Verify: `npm run dev` serves localhost:3000; `npm run build` clean.
  - Files: `package.json`, `tsconfig.json`, `next.config.*`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

- [x] **T2. Wire test + format tooling**
  - Acceptance: Vitest + RTL configured (jsdom env), Playwright installed, Prettier added; `test`/`test:watch`/`e2e`/`format`/`typecheck` scripts present per SPEC Commands.
  - Verify: `npm test` runs (0 tests OK), `npm run typecheck` and `npm run lint` clean, `npx playwright --version` works.
  - Files: `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `package.json`, `.prettierrc`

- [x] **T3. Design tokens + fonts**
  - Acceptance: DESIGN.md tokens mapped into `app/globals.css` `@theme` (colors, radius, spacing); Inter + Manrope loaded via `next/font`; a token smoke element (sage canvas + green pill + ink display text) renders correctly.
  - Verify: manual dev check shows correct colors/radius/fonts; no hardcoded hex outside `globals.css`.
  - Files: `app/globals.css`, `app/layout.tsx`

## Slice 2 — Domain (parallel with Slice 4)

- [x] **T4. `lib/todos.ts` pure domain + tests**
  - Acceptance: `Todo` type + `addTodo`/`toggleTodo`/`editTodo`/`removeTodo` pure fns; add rejects empty/whitespace and prepends newest-first; edit trims + rejects empty; toggle/remove target only the matching id.
  - Verify: `npm test` green; `lib/todos.ts` 100% covered.
  - Files: `lib/todos.ts`, `tests/todos.test.ts`

## Slice 3 — Persistence

- [x] **T5. `lib/storage.ts` `useTodos` hook + tests**
  - Acceptance: `useTodos()` returns `{ todos, addTodo, toggleTodo, editTodo, removeTodo }`, persists to localStorage; SSR-safe (reads in `useEffect`, `typeof window` guarded); corrupt/missing data → `[]`.
  - Verify: hook tests vs jsdom localStorage — round-trip persists, corrupt JSON degrades to empty; no hydration warning in dev.
  - Files: `lib/storage.ts`, `tests/storage.test.ts`

## Slice 4 — UI primitives (parallel with Slice 2)

- [x] **T6. Token-driven UI primitives**
  - Acceptance: `Button` (primary green pill / secondary / tertiary + delete/negative variant), `Card`, `TextInput`, `Checkbox` — all token classes, 24px radius, AA contrast, keyboard-focusable.
  - Verify: render tests assert variants/roles; manual visual check in dev.
  - Files: `components/ui/Button.tsx`, `components/ui/Card.tsx`, `components/ui/TextInput.tsx`, `components/ui/Checkbox.tsx`

## Slice 5 — Feature + page (join point)

- [x] **T7. AddTodo**
  - Acceptance: input + "Plant task" CTA; Enter or click creates via `useTodos`; input clears + refocuses; empty/whitespace rejected.
  - Verify: component test — Enter creates + clears; whitespace no-ops.
  - Files: `components/todo/AddTodo.tsx`, `tests/AddTodo.test.tsx`

- [x] **T8. TodoItem (toggle / inline edit / delete)**
  - Acceptance: checkbox toggles done (strikethrough + muted); title inline-editable (Enter/blur save, Esc cancel, empty reverts); two-step delete confirm.
  - Verify: component tests for toggle, edit save/cancel, delete confirm.
  - Files: `components/todo/TodoItem.tsx`, `tests/TodoItem.test.tsx`

- [x] **T9. TodoList + EmptyState + TodoCount**
  - Acceptance: renders todos newest-first; empty list shows branded "plant your first task" empty state; header shows live active count.
  - Verify: component tests — empty→EmptyState, non-empty→items, count reflects active only.
  - Files: `components/todo/TodoList.tsx`, `components/todo/EmptyState.tsx`, `components/todo/TodoCount.tsx`

- [x] **T10. Assemble page + 🌱 wordmark**
  - Acceptance: `app/page.tsx` composes AddTodo + TodoCount + TodoList on sage canvas; `layout.tsx` sets metadata + 🌱 Sprout wordmark (Manrope 900); all acceptance criteria pass manually.
  - Verify: manual walkthrough of every SPEC acceptance-criteria checkbox; persists across reload.
  - Files: `app/page.tsx`, `app/layout.tsx`

## Slice 6 — E2E + polish

- [x] **T11. E2E happy-path**
  - Acceptance: Playwright spec — load → plant two → complete one → edit one → delete one → reload → state persists.
  - Verify: `npm run e2e` green.
  - Files: `e2e/todos.spec.ts`

- [x] **T12. Responsive + a11y + DoD**
  - Acceptance: layout holds 320px→desktop; keyboard-operable end to end; AA contrast; `build`/`typecheck`/`lint`/`test`/`e2e` all clean; SPEC Success Criteria checklist fully satisfied.
  - Verify: manual responsive + keyboard pass; full command suite green.
  - Files: `app/globals.css`, component polish as needed

---

# v1.1 — The Garden

## Slice 1 — Today's plant (complete ✅)

- [x] **G1. Harvest domain + log**
  - `Todo.completedAt`; `toggleTodo(todos, id, now)` stamps/clears it. New `lib/harvest.ts`: `HarvestLog`, `localDate`, `recordHarvest`, `logToggle` (midnight-correct), `stageFor`, `BLOOM_THRESHOLD`.
  - Verify: `tests/harvest.test.ts` (incl. complete-day-A / un-complete-day-B) + updated `tests/todos.test.ts`.
  - Files: `lib/todos.ts`, `lib/harvest.ts`, `tests/harvest.test.ts`, `tests/todos.test.ts`

- [x] **G2. Persist the log + expose `todayCount`**
  - `lib/storage.ts` gains a `harvestLog` store (own validation → `{}` on corruption); `toggleTodo` writes both stores; `useTodos` returns `log` + `todayCount` (clock read confined to a getSnapshot to satisfy `react-hooks/purity`).
  - Verify: unit suite green; live check.
  - Files: `lib/storage.ts`

- [x] **G3. Garden card**
  - `components/todo/Garden.tsx` — 🌰→🌱→🌿→🪴→🌳, progress bar, caption; rendered above the Seed input.
  - Verify: `tests/Garden.test.tsx`; e2e asserts growth + persistence; live-verified (grow, regress on un-complete, delete keeps harvest, persists reload).
  - Files: `components/todo/Garden.tsx`, `app/page.tsx`, `tests/Garden.test.tsx`, `e2e/todos.spec.ts`

- [x] **G4. Layout order**
  - Page order set to: wordmark → Garden → count → task list → Seed input (input at the **bottom**). Empty-state copy updated to "Seed your first task **below**…".
  - Files: `app/page.tsx`, `components/todo/EmptyState.tsx`

## ⏸ Paused here

Stopping point after Garden Slice 1. Everything green (`build`/`typecheck`/`lint`/`test`/`e2e`); nothing committed. Resume with Slice 2.

## Slices 2–3 (planned)

- [ ] **Slice 2 — Garden history:** calendar/grid of past days (reads `harvestLog`).
- [ ] **Slice 3 — Trends:** current & best streak, 7-day sparkline, all-time total.

## Backlog / follow-ups

- [ ] **Seed input `autoFocus` vs. bottom placement.** The Seed input keeps `autoFocus` while sitting at the bottom of the page. Fine for short lists (no scroll on load), but with a long list the browser scrolls to the focused input on load, pushing the Garden card + wordmark out of view. Decide the fix when it bites: drop `autoFocus`, or focus without scrolling (e.g. `focus({ preventScroll: true })` after mount / only auto-focus when the list is short).
  - Files: `components/todo/AddTodo.tsx`

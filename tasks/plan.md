# Plan: Sprout v1

Implementation plan for [SPEC.md](../SPEC.md). Reviewable approach + ordering; the task checklist lives in [todo.md](todo.md).

## Approach

Build bottom-up along the data-abstraction seam so UI never couples to storage:

```
pure domain (lib/todos.ts)  →  storage hook (lib/storage.ts)  →  ui primitives (components/ui)  →  feature (components/todo)  →  page (app/page.tsx)
        ▲ unit-tested            ▲ tested vs jsdom localStorage      ▲ token-driven                  ▲ component-tested            ▲ e2e
```

Each layer is verifiable before the next depends on it. Tokens land early (Slice 1) so every component is token-driven from its first line — no hardcoded-hex retrofit later.

## Components & dependencies

| Component                                                                | Depends on      | Notes                                                                |
| ------------------------------------------------------------------------ | --------------- | -------------------------------------------------------------------- |
| Scaffold (Next+TS+Tailwind v4, tooling, test setup)                      | —               | `create-next-app`, then wire Vitest/RTL/Playwright, ESLint, Prettier |
| Design tokens (`app/globals.css` `@theme`) + fonts                       | Scaffold        | Maps DESIGN.md; Inter + Manrope via `next/font`                 |
| `lib/todos.ts` (pure domain)                                             | Scaffold        | Framework-free; add/toggle/edit/remove; 100% unit-tested             |
| `lib/storage.ts` (`useTodos` hook)                                       | `lib/todos.ts`  | localStorage round-trip; corrupt/missing → empty; SSR-safe           |
| `components/ui/*` (Button, Card, TextInput, Checkbox)                    | Tokens          | Token-driven primitives                                              |
| `components/todo/*` (AddTodo, TodoItem, TodoList, EmptyState, TodoCount) | ui + `useTodos` | Interactivity → `"use client"`                                       |
| `app/page.tsx` + `layout.tsx`                                            | everything      | Assembles the single page + 🌱 wordmark                              |
| E2E happy-path                                                           | assembled app   | plant → complete → edit → delete → reload persists                   |

## Implementation order (vertical slices)

1. **Slice 1 — Foundation:** scaffold, tooling, test harness, design tokens, fonts. _Verify:_ dev server renders a token-styled placeholder; `typecheck`/`lint`/`test` run clean (even with 0 tests).
2. **Slice 2 — Domain:** `lib/todos.ts` + full unit tests. _Verify:_ `npm test` green, `lib/todos.ts` 100%.
3. **Slice 3 — Persistence:** `lib/storage.ts` `useTodos` hook + tests vs jsdom localStorage. _Verify:_ round-trip + corrupt-data tests green.
4. **Slice 4 — UI primitives:** Button/Card/TextInput/Checkbox from tokens. _Verify:_ render tests; visual check in dev.
5. **Slice 5 — Feature + page:** AddTodo → TodoList/TodoItem → EmptyState/TodoCount → assemble `page.tsx`/`layout.tsx`. _Verify:_ component tests for each interaction; manual walkthrough of all acceptance criteria.
6. **Slice 6 — E2E + polish:** Playwright happy-path; responsive (320px→desktop) + a11y (keyboard, AA contrast) pass. _Verify:_ `npm run e2e` green; full DoD checklist.

Slices 2 and 3 can proceed in parallel with 4 (domain/storage vs. presentational primitives are independent); 5 is the join point. Everything else is sequential.

## Risks & mitigations

- **Tailwind v4 `@theme` is CSS-first (no `tailwind.config.js` for tokens).** Mitigation: define all tokens in `globals.css` `@theme`; confirm the `create-next-app` default is v4 and adjust if it scaffolds v3.
- **localStorage on the server / hydration mismatch.** Mitigation: `useTodos` reads localStorage only in `useEffect` (post-mount); initial render uses empty state, then hydrates. Guard all access with `typeof window` checks.
- **Corrupt/oversized localStorage payload.** Mitigation: wrap parse in try/catch → fall back to `[]`; validate shape before trusting stored data.
- **Emoji rendering inconsistency (🌱).** Accept OS-native rendering; it's decorative, not load-bearing. Wordmark text carries the brand if emoji is absent.
- **Scope creep** (due dates, tags tempting during build). Mitigation: boundaries in SPEC — anything beyond v1 acceptance criteria requires an explicit ask.

## Verification checkpoints

- After each slice: the slice's stated _Verify_ step passes before starting the next.
- Before any commit: `npm run typecheck && npm run lint && npm test` clean.
- Before "done": `npm run build` clean + e2e green + manual pass over all SPEC acceptance criteria and the Success Criteria checklist.

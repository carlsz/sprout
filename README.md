# 🌱 Sprout

Sprout is a fast, single-user TODO app that feels less like a productivity tool and more like a calm, friendly place to keep track of what you're growing toward. Seed a task, watch it grow, and harvest it when it's done — as you complete tasks each day, a little virtual plant in your garden grows along with you.

Built with Next.js (App Router) and Tailwind CSS v4, wearing a distinctive lime-green-on-sage design system. No accounts, no backend — your todos live in your browser.

## Features

- **Seed, complete, edit, and delete todos** — inline editing, a two-step delete confirm, and a live count of what's still growing.
- **Your garden** — complete ("harvest") tasks and today's plant grows through stages: 🌰 → 🌱 → 🌿 → 🪴 → 🌳. Resets fresh each day.
- **Persistent** — everything is saved to `localStorage` and survives reloads and restarts. No sign-in, no server.
- **Branded & polished** — a Wise-inspired design language (heavy display type, lime-green accent, sage canvas, 24px rounded cards) applied via Tailwind v4 design tokens.
- **Accessible & responsive** — keyboard-operable, WCAG AA contrast, and laid out cleanly from 320px to desktop.

## Tech stack

| Area        | Choice                                           |
| ----------- | ------------------------------------------------ |
| Framework   | [Next.js 16](https://nextjs.org) (App Router)    |
| UI          | React 19, TypeScript (strict)                    |
| Styling     | Tailwind CSS v4 (CSS-first `@theme` tokens)      |
| Fonts       | Inter + Manrope, via `next/font`                 |
| Persistence | `localStorage` via `useSyncExternalStore`        |
| Testing     | Vitest + React Testing Library, Playwright (e2e) |
| Tooling     | ESLint, Prettier                                 |

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org) **20.9 or newer** (developed on Node 24) and npm.

```bash
# 1. Clone
git clone https://github.com/carlsz/sprout.git
cd sprout

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app runs entirely client-side, so there's nothing else to configure (no environment variables, no database).

## Scripts

| Command              | What it does                        |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start the dev server on port 3000   |
| `npm run build`      | Production build                    |
| `npm start`          | Serve the production build          |
| `npm test`           | Run unit + component tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode             |
| `npm run e2e`        | Run the Playwright end-to-end test  |
| `npm run lint`       | Lint with ESLint                    |
| `npm run typecheck`  | Type-check with `tsc --noEmit`      |
| `npm run format`     | Format with Prettier                |

> First e2e run only: `npx playwright install chromium` to fetch the browser.

## Project structure

```
sprout/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout: fonts, metadata, canvas
│   ├── page.tsx            # The single Sprout page (client component)
│   └── globals.css         # Tailwind v4 entry + @theme design tokens
├── components/
│   ├── todo/               # Feature: AddTodo, TodoItem, TodoList,
│   │                       #   TodoCount, EmptyState, Garden
│   └── ui/                 # Token-driven primitives: Button, Card,
│                           #   TextInput, Checkbox
├── lib/
│   ├── todos.ts            # Pure todo domain logic (add/toggle/edit/remove)
│   ├── harvest.ts          # Pure harvest-log + plant-stage logic
│   ├── storage.ts          # localStorage store + useTodos hook (data seam)
│   └── cn.ts               # className join helper
├── tests/                  # Vitest + RTL unit & component tests
├── e2e/                    # Playwright end-to-end spec
├── tasks/                  # plan.md + todo.md (spec-driven workflow)
├── DESIGN.md               # Design language reference (tokens, components)
├── SPEC.md                 # Project specification & roadmap
└── package.json
```

## How it works

- **Pure domain, testable in isolation.** All todo and harvest logic lives in `lib/todos.ts` and `lib/harvest.ts` as pure functions (no React, no storage), with time passed in rather than read from the clock — so behavior like the daily harvest count is fully unit-tested, including day boundaries.
- **One data seam.** UI components talk only to the `useTodos()` hook in `lib/storage.ts`. `localStorage` is the single source of truth, read through React's `useSyncExternalStore` (SSR-safe, cross-tab). Swapping in a backend later means rewriting one file.
- **Design tokens, not hardcoded values.** Colors, radii, and fonts are defined once in `app/globals.css` via Tailwind's `@theme`; components reference token utilities (`bg-canvas-soft`, `text-ink`, `rounded-xl`). See [`DESIGN.md`](DESIGN.md) for the full system.

## Testing

Unit and component tests run under Vitest + React Testing Library; a single Playwright spec exercises the full happy path (seed → complete → edit → delete → reload persists, plus the plant growing).

```bash
npm test        # unit + component
npm run e2e     # end-to-end (Playwright)
```

## Design

Sprout's visual language is documented in [`DESIGN.md`](DESIGN.md) — the color palette, type scale, spacing, radii, and component specs. It's an interpretation of [Wise](https://wise.com)'s design system, rebranded for Sprout; inspired by, not affiliated with.

## Roadmap

The garden is built in slices (see [`SPEC.md`](SPEC.md) and [`tasks/todo.md`](tasks/todo.md)):

- ✅ **Slice 1 — Today's plant** (shipped)
- ⬜ **Slice 2 — Garden history** — review past days
- ⬜ **Slice 3 — Trends** — streaks, a 7-day sparkline, all-time total

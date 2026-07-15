<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Next.js 16 cheatsheet

This repo runs **Next.js 16 + React 19** (App Router). Much of this diverges from older training data. Version-locked docs ship on disk — read them before writing framework code:

- Bundled (authoritative for the installed version): `node_modules/next/dist/docs/` — start at `01-app/02-guides/upgrading/version-16.md`
- Online: https://nextjs.org/docs/app/guides/upgrading/version-16

Highest-risk changes to get right:

- **Async request APIs (removed sync access).** `cookies()`, `headers()`, `draftMode()`, and `params`/`searchParams` are Promises — always `await` them. `export default async function Page({ params }) { const { slug } = await params }`. Generate typed helpers with `npx next typegen` (`PageProps`, `LayoutProps`, `RouteContext`).
- **Caching is opt-in (Cache Components).** No automatic `fetch` caching. Enable `cacheComponents: true`, then use the `'use cache'` directive with `cacheLife(...)`/`cacheTag(...)`. Uncached runtime data (cookies/headers/searchParams) must be inside `<Suspense>` or you get an `"Uncached data was accessed outside of <Suspense>"` build error. `Date.now()`/`Math.random()`/`crypto.randomUUID()` need `await connection()` first, or `'use cache'` to freeze the value.
- **`revalidateTag` needs a profile:** `revalidateTag('posts', 'max')`. Use `updateTag(tag)` for read-your-writes (mutations where the user must see the change immediately) and `refresh()` to refresh the client router from a Server Action.
- **`middleware` → `proxy`.** File `proxy.ts`, export `proxy`, Node.js runtime only (no edge). Keep `middleware.ts` only if you specifically need the edge runtime.
- **Parallel routes require `default.tsx`** in every slot or the build fails (`return null` or `notFound()`).
- **`next/image` defaults tightened:** `qualities` → `[75]`, `minimumCacheTTL` → 4h, `imageSizes` dropped `16`, `images.domains` deprecated (use `remotePatterns`), local images with query strings need `images.localPatterns.search`.
- **Removed:** `serverRuntimeConfig`/`publicRuntimeConfig` (use env vars + `connection()` for runtime reads), `next lint` (use `eslint` directly), AMP, `next/legacy/image`, `experimental.dynamicIO`/`experimental.useCache` (use `cacheComponents`).

Toolchain: **Turbopack is the default** for `dev` and `build` — a `webpack` config now fails the build (opt out with `--webpack`). The `npx @next/codemod@canary upgrade latest` codemod handles most mechanical migrations.

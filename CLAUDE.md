# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `.npmrc`, `pnpm-lock.yaml`).

- `pnpm dev` — start Vite dev server (SvelteKit)
- `pnpm build` / `pnpm preview` — production build / local preview
- `pnpm check` — `svelte-kit sync` then `svelte-check` against `tsconfig.json` (run this for type errors; there is no `tsc` script)
- `pnpm lint` — Prettier check + ESLint
- `pnpm format` — Prettier write
- `pnpm test:unit` — Vitest (watch); append `-- --run` for one-shot, or `-- <pattern>` to scope by file
- `pnpm test:e2e` — Playwright (`e2e/`)
- `pnpm test` — unit (one-shot) then e2e
- `pnpm storybook` — Storybook dev server on port 6006
- `pnpm db:start` / `db:push` / `db:migrate` / `db:studio` — Postgres via `docker compose` + Drizzle Kit

## Architecture

SvelteKit 2 + Svelte 5 (runes — e.g. `let { children } = $props()`), Tailwind v4 (via `@tailwindcss/vite`), deployed to Vercel (`@sveltejs/adapter-vercel`, but `svelte.config.js` currently uses `adapter-auto`).

### Two apps in one SvelteKit project

1. **Marketing site** at `/` — a single fully prerendered page (`src/routes/+page.server.ts` sets `export const prerender = true`) that pulls a Sanity `page` document with `handle.current == 'home'`, dereferencing nested `sections[]` and their `items[]`. **Do not introduce request-time data into the home `load`** without removing the prerender flag.
2. **Embedded Sanity Studio** at `/sanity/*` — `src/routes/sanity/[...catchAll]/+page.svelte` mounts `<SanityStudio>` with the config from `src/lib/client/sanity.ts`. Schemas live in `src/schemas/` and are aggregated through `src/schemas/index.ts`. Adding a new content type means: create the schema file, register it in `schemas/index.ts`, and (if it should be queryable) reference it from the GROQ query in `+page.server.ts` and the `Project` type in `src/lib/types/index.ts`.

`svelte.config.js` lists `prerender.entries: ['/', '/sanity']` — the second entry exists so Studio's shell is reachable from the prerender crawler; Studio itself is a client-side SPA.

### Sanity client

`src/lib/client/sanity.ts` exports both the Studio `defineConfig` and a runtime `fetchSanityData<T>(query, params)` helper. All Sanity reads should go through `fetchSanityData` (uses `PUBLIC_SANITY_*` env vars; CDN toggled by `PUBLIC_SANITY_CDN === 'true'`).

### Contact form endpoint (`src/routes/api/send-email/+server.ts`)

POSTs JSON `{ name, email, message, company?, formStartedAt? }`. It is the only runtime route and contains layered bot/abuse protection that must be preserved if you touch it:

- Field validation: required `name`/`email`/`message`, length caps, regex on email, CRLF header-injection check.
- Honeypot: non-empty `company` field → silent success.
- Time-trap: submissions before `CONTACT_FORM_MIN_SUBMIT_MS` (default 3000ms) since `formStartedAt` → silent success.
- In-memory IP rate limit (`CONTACT_FORM_RATE_LIMIT_WINDOW_MS` / `CONTACT_FORM_RATE_LIMIT_MAX_REQUESTS`, defaults 60s / 5). The `requestLog` Map is per-process — fine for a single Vercel function instance, but be aware it is not durable across cold starts or multiple instances.
- Sends a confirmation email to the submitter and a notification (with `replyTo: email`) to `SMTP_RECIPIENT_EMAIL` via Nodemailer SMTP.

### Database

Drizzle + `postgres` are wired up in `src/lib/server/db/index.ts` (requires `DATABASE_URL`), and `db:*` scripts run against the local Docker Postgres. Currently no route consumes the DB — the schema in `src/lib/server/db/schema.ts` is the source of truth when you do.

## Environment

Copy `.env.example` to `.env`. Notable vars: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SANITY_CDN`, `SANITY_TOKEN`, `SMTP_*`, `CONTACT_FORM_*`, `DATABASE_URL`. Server-only secrets are read via `$env/dynamic/private`; public Sanity vars via `$env/static/public`.

## Conventions

- Prettier config: tabs, single quotes, no semicolons, `printWidth: 100`, with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`. Match this when editing.
- Imports use SvelteKit aliases: `$lib`, `$lib/components`, `$lib/client/...`, `$lib/server/...`, `$env/...`.
- Components are colocated under `src/lib/components/` and consumed directly from route files; there is no barrel export.

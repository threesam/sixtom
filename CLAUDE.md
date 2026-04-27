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

## Architecture

SvelteKit 2 + Svelte 5 (runes), Tailwind 4 (`@tailwindcss/vite`), deployed to Vercel. The repo houses two independent surfaces in one app:

### 1. The marketing/offer site (`/`)

Single fully-prerendered page (`src/routes/+page.svelte`, `src/routes/+page.server.ts` sets `prerender = true`). All copy lives in `src/lib/content/` as typed TypeScript so components AND schema.org JSON-LD render from the same source. Page sections are composed from `src/lib/components/` (Hero, Corollaries, SprintSection, ProofSlot, LeadCapture, Footer); the credentials chip and thesis band are inline in `+page.svelte`.

Site-wide constants (operator name, current/former employers, booking URL, garden URL, production domain, hero copy, offer name, price) live in `src/lib/content/site.ts`. Update there before launch — `siteUrl`, `bookingUrl`, `gardenUrl` are placeholders.

Schema markup (Person, ProfessionalService, FAQPage) is generated in `src/lib/seo/jsonld.ts` from the same content data and emitted into `<head>` via `src/routes/+layout.svelte`.

Static SEO files: `static/llms.txt`, `static/sitemap.xml`, `static/robots.txt`, `static/og.png`, `static/favicon.svg`. The `<title>`, `<meta description>`, OG/Twitter cards live in `src/app.html`.

### 2. The embedded Sanity Studio (`/sanity/*`)

`src/routes/sanity/[...catchAll]/+page.svelte` mounts `<SanityStudio>` with the config from `src/lib/client/sanity.ts`. Schemas live in `src/schemas/` and are aggregated through `src/schemas/index.ts`. The home page does NOT consume Sanity content in v1 — Studio is preserved for future use (e.g., future content-driven pages or case study management).

`svelte.config.js` lists `prerender.entries: ['/', '/sanity']` — the second exists so Studio's shell is reachable from the prerender crawler; Studio itself is a client-side SPA.

### Contact form endpoint (`src/routes/api/send-email/+server.ts`)

POSTs JSON `{ name, email, message, company?, formStartedAt? }`. It is the only runtime route. The `LeadCapture` component on the home page submits to it with `name = 'Notify list signup'` + a fixed `message`, reusing the existing rate limit and bot protection. The endpoint contains layered bot/abuse protection that must be preserved if you touch it:

- Field validation: required `name`/`email`/`message`, length caps, regex on email, CRLF header-injection check.
- Honeypot: non-empty `company` field → silent success.
- Time-trap: submissions before `CONTACT_FORM_MIN_SUBMIT_MS` (default 3000ms) since `formStartedAt` → silent success.
- In-memory IP rate limit (`CONTACT_FORM_RATE_LIMIT_WINDOW_MS` / `CONTACT_FORM_RATE_LIMIT_MAX_REQUESTS`, defaults 60s / 5). The `requestLog` Map is per-process — fine for a single Vercel function instance, but be aware it is not durable across cold starts or multiple instances.
- Sends a confirmation email to the submitter and a notification (with `replyTo: email`) to `SMTP_RECIPIENT_EMAIL` via Nodemailer SMTP.

## Environment

Copy `.env.example` to `.env`. Notable vars: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SANITY_CDN`, `SANITY_TOKEN`, `SMTP_*`, `CONTACT_FORM_*`. Server-only secrets are read via `$env/dynamic/private`; public Sanity vars via `$env/static/public`.

## Conventions

- Prettier config: tabs, single quotes, no semicolons, `printWidth: 100`, with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`. Match this when editing.
- Imports use SvelteKit aliases: `$lib`, `$lib/components`, `$lib/client/...`, `$lib/server/...`, `$env/...`.
- Components are colocated under `src/lib/components/` and consumed directly from route files; there is no barrel export.

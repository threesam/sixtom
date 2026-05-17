# AGENTS.md

Conventions for any agent (Claude Code, Cursor, Codex, Aider, etc.) working on this repository. Read this first.

## What this project is

**sixtom** — a single-page offer site for two productized services delivered async:

- **The Audit** — $750, ~3–4 hrs of off-hours work, 1-pager + 15-min Loom deliverable.
- **The Async Sprint** — $7,500, two weeks of agent-orchestrated async work, daily drops in the client's channel, working version live on day 10.

The operator runs AI agents in parallel; the site needs to reflect that operating model honestly.

## Commands

Package manager is **pnpm** (see `.npmrc`, `pnpm-lock.yaml`).

- `pnpm dev` — Vite dev server.
- `pnpm build` / `pnpm preview` — production build / local preview.
- `pnpm check` — `svelte-kit sync` then `svelte-check` (this is the type-check; there is no `tsc` script).
- `pnpm lint` — Prettier check + ESLint. Must pass before commit.
- `pnpm format` — Prettier write.
- `pnpm test:unit` — Vitest (watch); append `-- --run` for one-shot; `-- <pattern>` to scope by file.
- `pnpm test` — Vitest one-shot (alias for `vitest --run`).
- `pnpm cal:sync` — provision the Cal.com event from `src/lib/content/site.ts` (`scripts/sync-cal.ts`). Requires `CAL_API_KEY` + `CAL_USERNAME` in `.env`.

**Invariant:** every commit leaves `pnpm format && pnpm lint && pnpm check && pnpm test:unit -- --run && pnpm build` all green.

## Architecture

SvelteKit 2 + Svelte 5 (runes) + Tailwind 4, deployed to Vercel.

### 1. Marketing/offer site (`/`)

Single fully-prerendered page (`src/routes/+page.svelte`, `src/routes/+page.server.ts` exports `prerender = true`). All copy lives in `src/lib/content/` as typed TypeScript so components AND schema.org JSON-LD render from the same source.

Page sections compose from `src/lib/components/`:

- `Hero.svelte` — H1, subhead, concrete price line, primary CTA, trust marks.
- `OfferSection.svelte` — Audit + Sprint cards side-by-side, stats triplet, testimonial.
- `LeadCapture.svelte` — notify-me form + brand marquee anchored at the bottom.

The thesis band is inline in `+page.svelte` (small enough to not warrant its own component).

Site-wide constants — operator + audit + sprint + process + stats + testimonial + URLs — live in `src/lib/content/site.ts`. The `Site` type in `src/lib/content/types.ts` is the schema. **Update site.ts and the components follow automatically; the schema markup follows automatically too.**

Schema.org JSON-LD (Person, ProfessionalService with both Audit + Sprint offers) is generated in `src/lib/seo/jsonld.ts` and injected into `<head>` via `src/routes/+layout.svelte`.

Static SEO/AEO files: `static/llms.txt`, `static/sitemap.xml`, `static/robots.txt`, `static/og.png`, `static/favicon.svg`. Browser `<title>`, `<meta description>`, canonical, OG/Twitter cards live in `src/app.html`.

### 2. Embedded Sanity Studio (`/sanity/*`)

Preserved for future content-driven pages. The home page does NOT consume Sanity in v1. Don't touch `src/lib/client/sanity.ts`, `src/lib/components/SanityStudio.svelte`, `src/routes/sanity/`, or `src/schemas/` unless extending Studio specifically.

`svelte.config.js` lists `prerender.entries: ['/', '/sanity']` — the second entry exists so Studio's shell is reachable from the prerender crawler; Studio itself is a client-side SPA.

### 3. Contact form endpoint (`src/routes/api/send-email/+server.ts`)

The only runtime route. POSTs JSON `{ name, email, message, company?, formStartedAt? }`. `LeadCapture` submits to it with `name = 'Notify list signup'` + a fixed `message`, reusing the rate limit + bot protection. **Preserve all four protection layers if you touch this file:**

- Field validation: required `name`/`email`/`message`, length caps, regex on email, CRLF header-injection check.
- Honeypot: non-empty `company` field → silent success.
- Time-trap: submissions before `CONTACT_FORM_MIN_SUBMIT_MS` (default 3000ms) → silent success.
- In-memory IP rate limit (`CONTACT_FORM_RATE_LIMIT_WINDOW_MS` / `CONTACT_FORM_RATE_LIMIT_MAX_REQUESTS`, defaults 60s / 5). Per-process, not durable across cold starts.

The endpoint sends a confirmation to the submitter and a notification to `SMTP_RECIPIENT_EMAIL` via Nodemailer SMTP.

### 4. Cal.com sync script (`scripts/sync-cal.ts`)

Reads `site.calEvent` from the content layer, upserts the intro event in Cal.com via their v2 API. Operator runs `pnpm cal:sync` after editing `calEvent`. Not part of `pnpm build`.

## Voice & copy guardrails

**Apply to every change that touches buyer-facing copy.** The operator's published voice (see his "Vibe coding insight" post — wry, observational, terse, _italics for genuine emphasis_, em-dashes only when earned) is the target.

1. **The agent-orchestration narrative IS the value prop** — Sam runs a fleet of agents in parallel; agents type, he judges. Don't write "AI-leveraged" or "AI-accelerated" as generic flavor; do write specifically about what the fleet does.
2. **No "most teams" / "most people"** framing. Frame around what _the operator has been doing_.
3. **Lowercase eyebrows, sentence-case headings, sentence-case body.**
4. **Periods over commas when reasonable.** Short. Short. Then long if needed. Then a punchline.
5. **No AI tropes:** em-dash sandwich (`X — Y, Z — A`), abstract noun pile-ups, balanced tricolons for symmetry, "It's not X, it's Y", "Here's the thing."
6. **Concrete over generic.** Specific numbers and named things beat rhetoric every time.
7. **`docs/site-copy.md` mirrors the live copy.** Update it in the same commit as any copy change.

## Code organization

- **One responsibility per file.** Components render; content lives in `src/lib/content/`; SEO logic in `src/lib/seo/`; scripts in `scripts/`.
- **No barrel re-exports for components.** Routes import components directly from `$lib/components/...`.
- **Content layer is the source of truth.** Don't hardcode buyer-facing strings in components if they belong in `site.ts`.
- **Schema follows content.** Adding a new offer field → add to `Site`/`Offer` type → render in component → expose via JSON-LD if SEO-relevant.

## Bloat policy

This repo has been intentionally trimmed. Don't add:

- Storybook (removed in v1.3 — wasn't being used).
- Drizzle/Postgres on the home route (DB scaffolding is for `scripts/sync-cal.ts` and future use only).
- Third-party UI libraries (Tailwind is enough).
- Newsletter/CRM/CMS for the home page (Sanity Studio is preserved at `/sanity` for future use; do not wire it into `/`).

Before adding any dep, ask: does this earn its install-cost AND its mental-cost?

`package.json#pnpm.overrides` exists to silence CVE advisories in transitive
deps that the top-level packages haven't bumped yet (cookie, postcss, js-yaml).
Don't remove an entry without re-running `pnpm audit` to confirm the underlying
chain has been fixed upstream.

## Conventions

- Prettier: tabs, single quotes, no semicolons, `printWidth: 100`, with `prettier-plugin-svelte` + `prettier-plugin-tailwindcss`. **Don't fight the formatter.**
- ESLint: configured in `eslint.config.js` (flat config). Pre-existing rule overrides (e.g., `svelte/no-navigation-without-resolve` off) are intentional and documented inline. Don't loosen further without justification.
- SvelteKit aliases: `$lib`, `$lib/components`, `$lib/client/...`, `$env/...`. Don't introduce other aliases.
- Svelte 5 runes only (`$state`, `$derived`, `$effect`, `$props`, `$bindable`). No `export let` or stores in new code.

## Analytics + CRO

Umami is loaded in `src/app.html` (script tag, deferred). Every CTA carries `data-umami-event="<event_name>"` for click tracking. Successful form submits call `window.umami?.track('event_name')`. **Maintain this convention** when adding new CTAs. The events table is in `docs/site-copy.md`.

## Environment

Copy `.env.example` to `.env`. Notable vars:

- `PUBLIC_SANITY_*` + `SANITY_TOKEN` — for the embedded Studio at `/sanity`.
- `SMTP_*` + `CONTACT_FORM_*` — for the notify-form endpoint.
- `CAL_API_KEY` + `CAL_USERNAME` — for `pnpm cal:sync`.

Server-only via `$env/dynamic/private`; public Sanity vars via `$env/static/public`.

## Pre-launch operator checklist

Items that must be set by Sam, not by an agent:

- [ ] `siteUrl` / `bookingUrl` / `gardenUrl` in `src/lib/content/site.ts` reflect real URLs.
- [ ] `CAL_API_KEY` + `CAL_USERNAME` set in environment.
- [ ] `pnpm cal:sync` run to provision the intro event.
- [ ] `static/og.png` replaced with a real 1200×630 social card.
- [ ] DNS for `sixtom.com` actually points at Vercel.

## When in doubt

- Read this file again.
- Read `docs/site-copy.md` (the canonical buyer-facing copy).
- Don't add scope without explicit ask. Bias to delete.

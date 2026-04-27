# sixtom MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Sanity-driven home page with a single-page, Q&A-structured operator-led offer site for the Sixtom Sprint, with full schema markup, llms.txt, and a working lead-capture form.

**Architecture:** SvelteKit 2 (Svelte 5 runes) + Tailwind 4. Home page fully prerendered. All copy lives in typed TypeScript content files; components render the copy AND the JSON-LD schema is generated from the same source for DRY. Email capture reuses the existing `/api/send-email` endpoint. Book-the-call is a hard link to a Cal.com URL provided by the operator. Sanity Studio at `/sanity` is left intact (separate concern).

**Tech Stack:** SvelteKit 2.47, Svelte 5.41 (runes), Tailwind 4.1 (`@tailwindcss/vite`), TypeScript 5.9, Vitest 4.0, Playwright. Deployed to Vercel via `@sveltejs/adapter-vercel` (currently `adapter-auto`).

---

## Reference

- **Spec:** `docs/superpowers/specs/2026-04-27-sixtom-mvp-design.md` (read this first for positioning, voice, and the single-page section order).
- **Voice anchor:** `../garden/content/self.md` — the operator's lived voice. Lowercase, conversational, lyrical when earned, never corporate, never sounds like a chatbot wrote it.
- **Branch:** `sixtom-mvp` (already created from `main`). Plan executes on this branch and merges back via PR after review.
- **Existing repo doc:** `CLAUDE.md` at repo root describes the pre-rewrite architecture.

---

## Voice & copy guardrails (apply to every task that writes copy)

1. **No AI mentions.** Never write "AI-leveraged," "AI-accelerated," "AI-powered," "AI-driven." How the work gets done is invisible to the buyer.
2. **No tech-stack mentions.** Don't name SvelteKit, Sanity, Tailwind, Vercel on the page. Internal noise.
3. **Lowercase headings.** Sentence-case body. The H1 itself is sentence-case.
4. **Q&A formulated.** Every section header that introduces content is phrased as a question the buyer would silently ask.
5. **Hormozi-clarity, Voss-empathy.** Lead with the dream outcome, then proof, then handle the silent objection. Mirror the buyer's language; don't talk over them.
6. **Plain language.** No "moat" / "pen test" / "optionality" / "stack" in buyer-facing copy (those are operator-POV in the spec, not on the page). The corollary buyer-translations in the spec are the canonical phrasings.
7. **Pricing is on the page.** $7,500 appears as the answer to "How much?" inside the Sprint Q&A. Never gated.

---

## File structure

### New files

```
src/lib/content/
├── corollaries.ts      # 5 corollary Q&A pairs (typed)
├── sprint.ts           # Sprint section Q&A pairs (typed)
├── site.ts             # Site-wide constants (name, tagline, URLs, person facts)
├── types.ts            # Shared types: QA, Person, Service
└── index.ts            # Barrel re-exports

src/lib/seo/
├── jsonld.ts           # JSON-LD generators: person(), service(), faqPage()
└── jsonld.test.ts      # Vitest tests for the generators

src/lib/components/
├── Hero.svelte         # Rewrite (existing one is unsuitable)
├── Corollaries.svelte  # 5-Q&A grid
├── SprintSection.svelte# Sprint Q&A list with pricing inline
├── ProofSlot.svelte    # Case-study placeholder + future cards
├── LeadCapture.svelte  # Email form posting to /api/send-email
└── Footer.svelte       # Rewrite (existing one is unsuitable)

static/
├── llms.txt            # llmstxt.org-formatted snapshot
├── sitemap.xml         # Single URL
└── robots.txt          # Allow all + sitemap reference

scripts/
└── sync-cal.ts         # Provisions Cal.com intro event from site.calEvent
```

### Modified files

```
src/routes/+page.svelte         # Full rewrite — composes the new components
src/routes/+page.server.ts      # Drop Sanity load; keep prerender = true
src/routes/+layout.svelte       # Add JSON-LD scripts; switch bg-gray-100 → bg-white
src/app.html                    # Add OG/Twitter meta + favicon link
package.json                    # Add tsx + dotenv devDeps; add cal:sync script
.env.example                    # Add CAL_API_KEY and CAL_USERNAME
CLAUDE.md                       # Updated to reflect v1 site (final task)
```

### Deleted files

```
src/lib/components/Header.svelte           # Unused even before rewrite
src/lib/components/Credibility.svelte      # Replaced by inline credentials chip
src/lib/components/ProblemSection.svelte   # Not in v1 design
src/lib/components/Services.svelte         # Replaced by SprintSection
src/lib/components/ServiceBlock.svelte     # Replaced by SprintSection
src/lib/components/Contact.svelte          # Replaced by LeadCapture
src/lib/components/SocialLinks.svelte      # Not in v1 design
src/lib/components/PortableText.svelte     # No Sanity content on home in v1
```

### Files left untouched

- `src/lib/client/sanity.ts` — used by `/sanity` Studio routing.
- `src/lib/components/SanityStudio.svelte` — used by `/sanity` Studio routing.
- `src/routes/sanity/[...catchAll]/+page.svelte` — Studio shell, untouched.
- `src/routes/api/send-email/+server.ts` — reused by LeadCapture; bot protection logic stays as-is.
- `src/lib/server/db/*` — Drizzle scaffolding; not part of v1.
- `src/schemas/*` — Sanity schemas; not used on home in v1.
- `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc` — config stays.

### Defer to operator (must be supplied before launch — placeholders in code)

| Item | Where it lives | Default placeholder |
|---|---|---|
| Cal.com URL | `src/lib/content/site.ts` → `bookingUrl` | `'https://cal.com/sam-dangelo/sprint-intro'` |
| Garden URL | `src/lib/content/site.ts` → `gardenUrl` | `'https://garden.example.com'` |
| Production domain | `static/sitemap.xml`, `static/robots.txt`, `src/lib/content/site.ts` → `siteUrl` | `'https://sixtom.com'` |
| OG image (1200×630 PNG) | `static/og.png` | placeholder solid-color image generated in Task 15 |
| Favicon | `static/favicon.svg` | small placeholder mark |
| Cal.com API key | `.env` → `CAL_API_KEY` | `''` (get from app.cal.com → Settings → Developer → API keys) |
| Cal.com username | `.env` → `CAL_USERNAME` | `''` (your Cal.com handle, e.g. `sam-dangelo`) |

These placeholders ship working — operator updates the strings in `site.ts` and replaces the static assets pre-launch. The sitemap/robots/og references all derive from `siteUrl` in `site.ts`.

---

## Visual direction (locked)

Decisions made up front so component tasks don't have to re-litigate:

- **Background:** white (`bg-white`). Override the existing `bg-gray-100` in `+layout.svelte`.
- **Text:** primary `text-neutral-900`, muted `text-neutral-600`.
- **CTA buttons:** stark black on white. `bg-neutral-900 text-white px-6 py-3 rounded-md hover:bg-neutral-700 transition-colors`.
- **Borders & dividers:** hairline neutral. `border-neutral-200`.
- **Type scale:**
  - H1 (hero): `text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]`
  - Subhead: `text-xl md:text-2xl text-neutral-600 leading-relaxed`
  - Section headings (questions in Q&A): `text-2xl md:text-3xl font-semibold`
  - Thesis band: `text-3xl md:text-4xl font-semibold tracking-tight italic` (italic for the moment-ness)
  - Body: `text-lg leading-relaxed`
- **Spacing:** generous. `py-32` for hero; `py-24` for body sections; `space-y-12` between Q&A items.
- **Container widths:**
  - Hero, Sprint section: `max-w-3xl mx-auto px-6`
  - Corollaries grid: `max-w-5xl mx-auto px-6`
  - Footer: `max-w-5xl mx-auto px-6`
- **Q&A grid layout:** 1 column on mobile, 2 on `md:` (768px+) breakpoint. Use `grid-cols-1 md:grid-cols-2 gap-12`.
- **No motion / animations** beyond browser-native (hover state on CTAs).
- **Mobile-first responsive.** Test at 360×640 and 1440×900.
- **Fonts:** `font-sans` (Tailwind default system stack). No custom fonts in v1.

---

## Tasks

### Task 1: Verify baseline + prepare workspace

**Files:** none (verification only)

- [ ] **Step 1: Confirm working tree is clean and on the right branch**

  Run:
  ```bash
  git status
  git branch --show-current
  ```
  Expected: `working tree clean` and `sixtom-mvp`.

- [ ] **Step 2: Install dependencies if needed**

  Run:
  ```bash
  pnpm install
  ```
  Expected: completes without errors.

- [ ] **Step 3: Verify dev server boots on the existing site**

  Run:
  ```bash
  pnpm dev
  ```
  Open `http://localhost:5173`. The current Sanity-driven page should render. Stop the server (Ctrl-C) once verified — this is just a sanity check that the baseline works before we replace it.

---

### Task 2: Content data layer (typed Q&A + site constants)

**Files:**
- Create: `src/lib/content/types.ts`
- Create: `src/lib/content/site.ts`
- Create: `src/lib/content/corollaries.ts`
- Create: `src/lib/content/sprint.ts`
- Create: `src/lib/content/index.ts`
- Create: `src/lib/content/content.test.ts`

The content layer is the single source of truth. Components render from it; schema generation reads from it. DRY.

- [ ] **Step 1: Write the failing test for content shape**

  Create `src/lib/content/content.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest'
  import { corollaries, sprintQA, site, calEvent } from './index'

  describe('content', () => {
  	it('exports exactly 5 corollaries', () => {
  		expect(corollaries).toHaveLength(5)
  	})

  	it('every corollary has a non-empty question and answer', () => {
  		for (const c of corollaries) {
  			expect(c.question).toBeTruthy()
  			expect(c.answer).toBeTruthy()
  		}
  	})

  	it('exports at least 8 sprint Q&A entries', () => {
  		expect(sprintQA.length).toBeGreaterThanOrEqual(8)
  	})

  	it('every sprint Q&A has a non-empty question and answer', () => {
  		for (const q of sprintQA) {
  			expect(q.question).toBeTruthy()
  			expect(q.answer).toBeTruthy()
  		}
  	})

  	it('site exports the operator and offer constants', () => {
  		expect(site.operator.name).toBe("Sam D'Angelo")
  		expect(site.offer.priceUSD).toBe(7500)
  		expect(site.bookingUrl).toMatch(/^https?:\/\//)
  	})

  	it('calEvent has the fields the sync script needs', () => {
  		expect(calEvent.title).toBeTruthy()
  		expect(calEvent.slug).toBeTruthy()
  		expect(calEvent.durationMinutes).toBeGreaterThan(0)
  		expect(calEvent.description).toBeTruthy()
  		expect(calEvent.intakeQuestions.length).toBeGreaterThan(0)
  	})
  })
  ```

- [ ] **Step 2: Run the test — expect it to fail (no source files yet)**

  Run:
  ```bash
  pnpm test:unit -- --run src/lib/content/content.test.ts
  ```
  Expected: FAIL with module-not-found errors for `./index`.

- [ ] **Step 3: Create types**

  Create `src/lib/content/types.ts`:
  ```ts
  export type QA = {
  	question: string
  	answer: string
  }

  export type StringList = readonly string[]

  export type Operator = {
  	name: string
  	jobTitle: string
  	currentEmployer: string
  	formerEmployer: string
  	credentialsChip: string
  }

  export type Offer = {
  	name: string
  	longName: string
  	priceUSD: number
  	cadence: string
  	promise: string
  }

  export type Site = {
  	siteUrl: string
  	bookingUrl: string
  	gardenUrl: string
  	tagline: string
  	thesis: string
  	hero: {
  		h1: string
  		subhead: string
  		ctaPrimary: string
  		ctaSecondary: string
  	}
  	operator: Operator
  	offer: Offer
  }

  export type IntakeQuestion = {
  	label: string
  	type: 'text' | 'longText' | 'select'
  	required: boolean
  	options?: readonly string[]
  }

  export type CalEvent = {
  	title: string
  	slug: string
  	durationMinutes: number
  	description: string
  	intakeQuestions: readonly IntakeQuestion[]
  }
  ```

- [ ] **Step 4: Create site constants**

  Create `src/lib/content/site.ts`:
  ```ts
  import type { Site, CalEvent } from './types'

  export const site: Site = {
  	// Replace pre-launch with the production domain.
  	siteUrl: 'https://sixtom.com',
  	// Replace pre-launch with the operator's actual Cal.com URL.
  	bookingUrl: 'https://cal.com/sam-dangelo/sprint-intro',
  	// Replace pre-launch with the actual garden URL.
  	gardenUrl: 'https://garden.example.com',
  	tagline: 'we just want to build cool shit and help people chase their dreams',
  	thesis:
  		'Action leads to insight is a more durable pattern than waiting for insight to take action.',
  	hero: {
  		h1: 'I help people get ideas out of their head and into the world.',
  		subhead:
  			'1-week site sprint. I look at what you have, ship a working version in days, and show you the before-and-after. For operators whose website has gotten in the way of growth.',
  		ctaPrimary: 'Book a 30-min intro call',
  		ctaSecondary: 'Notify me'
  	},
  	operator: {
  		name: "Sam D'Angelo",
  		jobTitle: 'Lead Engineer',
  		currentEmployer: 'Made In Cookware',
  		formerEmployer: 'Rhone',
  		credentialsChip:
  			"Lead engineer at Made In Cookware. Formerly at Rhone. Now applying that to small businesses where the leverage is highest."
  	},
  	offer: {
  		name: 'Sixtom Sprint',
  		longName: '1-week site sprint',
  		priceUSD: 7500,
  		cadence: 'One client per month, by appointment.',
  		promise:
  			'A working site by next Friday. Read access in. Working version live mid-sprint. Before/after measured. $7,500 fixed.'
  	}
  }

  export const calEvent: CalEvent = {
  	title: '30-min intro call — Sixtom Sprint',
  	slug: 'sprint-intro',
  	durationMinutes: 30,
  	description:
  		"A 30-min call to talk about your site, your data, and whether the Sprint is the right fit. If we are, we'll schedule the actual sprint after this call.",
  	intakeQuestions: [
  		{ label: 'What is the URL of your current site?', type: 'text', required: true },
  		{ label: 'What is working, and what is not?', type: 'longText', required: true },
  		{
  			label: 'Are you ready to start a sprint in the next 30 days?',
  			type: 'select',
  			options: ['Yes', 'Maybe', 'No, just exploring'],
  			required: true
  		}
  	]
  }
  ```

  Note: keep `site.bookingUrl`'s slug portion (`/sprint-intro` after the username) in sync with `calEvent.slug`. They're separate strings on purpose — `site.bookingUrl` is what the *page* renders, `calEvent.slug` is what the *sync script* provisions in Cal.com. The pre-launch checklist reminds the operator to verify both.

- [ ] **Step 5: Create the 5 corollaries**

  Create `src/lib/content/corollaries.ts`:
  ```ts
  import type { QA } from './types'

  export const corollaries: readonly QA[] = [
  	{
  		question: 'Why move fast?',
  		answer:
  			'I iterate fast in private. You see polished results fast in public. You ship when ready.'
  	},
  	{
  		question: 'Why do you need access to my tools?',
  		answer:
  			"I dig through your site, your data, your tools — to find what's already working before we change anything."
  	},
  	{
  		question: 'How do I know it actually worked?',
  		answer:
  			"Most businesses have all the data they need. They just don't know what to look at. I do."
  	},
  	{
  		question: 'Why a working version, not a strategy doc?',
  		answer:
  			"Most consultants hand you a plan, then disappear. I hand you a working site you can use the day we're done."
  	},
  	{
  		question: 'How do you decide what to change?',
  		answer:
  			"Your numbers already say what's working and what isn't. Most consultants never look."
  	}
  ]
  ```

- [ ] **Step 6: Create the Sprint Q&A**

  Create `src/lib/content/sprint.ts`:
  ```ts
  import type { QA } from './types'

  export const sprintQA: readonly QA[] = [
  	{
  		question: 'What is the Sixtom Sprint?',
  		answer:
  			'One week. New site. Built around what your existing data tells us is working, instrumented so you can see the before-and-after.'
  	},
  	{
  		question: "What's included?",
  		answer: [
  			'A 1-hour discovery call (recorded, transcribed, synthesized for the build).',
  			'Access onboarding — login to your analytics, your CMS, your hosting, anything else relevant.',
  			'5 days of build.',
  			'A live working version mid-week — you review, react, redirect.',
  			'One round of revisions.',
  			'Deployment to your hosting.',
  			'30-day check-in to capture the after-state.'
  		].join('\n')
  	},
  	{
  		question: "What's not included?",
  		answer: [
  			"A new logo, name, or brand identity (I'm not the fit if that's what you need).",
  			"Long-form copywriting from scratch (I'll work with what you have or what you draft).",
  			'Ad campaign management.',
  			'Long-term SEO content strategy.',
  			'E-commerce setup beyond what you already have.',
  			"Custom integrations beyond what's standard.",
  			'Maintenance after delivery.'
  		].join('\n')
  	},
  	{
  		question: 'What do you need from me?',
  		answer: [
  			'Login access to your tools (15 minutes of clicking "add user").',
  			'1-hour discovery call + a 30-minute mid-sprint review.',
  			'Feedback within 2 business days.',
  			'Whatever brand assets you have.',
  			'Approval to deploy.'
  		].join('\n')
  	},
  	{
  		question: 'How long does it take?',
  		answer:
  			"One week from discovery call to deployment. Then 30 days for the after-state to settle so we can see what changed."
  	},
  	{
  		question: 'How much?',
  		answer: '$7,500 fixed. One client per month. By appointment.'
  	},
  	{
  		question: 'What if it goes off the rails?',
  		answer:
  			"If the working version isn't on track by day 3, we pause. You keep what we've built and pay only for time spent."
  	},
  	{
  		question: 'What if I’m not technical?',
  		answer:
  			"Most clients aren't. I just need login access to your analytics, your CMS, your hosting. Usually 15 minutes of clicking “add user.” You don't have to understand any of it — that's my job."
  	},
  	{
  		question: 'What if my live site breaks?',
  		answer:
  			"It can't. The new site is built somewhere else. Your live site doesn't change at all until you approve and we publish together."
  	},
  	{
  		question: 'Who is this for?',
  		answer:
  			'Founders, operators, and small business owners whose website (and the data and tools around it) has gotten in the way of growth.'
  	},
  	{
  		question: 'Who is this not for?',
  		answer:
  			"If you want a brand-new logo, name, or visual identity, I'm not the fit. If you want someone to manage your ads or write your blog forever — also not me. I rebuild your site, fast, with the data your team forgot to look at, and hand it back."
  	}
  ]
  ```

- [ ] **Step 7: Create the barrel re-export**

  Create `src/lib/content/index.ts`:
  ```ts
  export { site, calEvent } from './site'
  export { corollaries } from './corollaries'
  export { sprintQA } from './sprint'
  export type { QA, Operator, Offer, Site, CalEvent, IntakeQuestion } from './types'
  ```

- [ ] **Step 8: Run tests — expect them to pass**

  Run:
  ```bash
  pnpm test:unit -- --run src/lib/content/content.test.ts
  ```
  Expected: PASS, all 6 tests green.

- [ ] **Step 9: Commit**

  ```bash
  git add src/lib/content/
  git commit -m "Add content data layer (corollaries, sprint Q&A, site constants)"
  ```

---

### Task 3: JSON-LD generation (schema.org)

**Files:**
- Create: `src/lib/seo/jsonld.ts`
- Create: `src/lib/seo/jsonld.test.ts`

JSON-LD is generated from the same content that the page renders, so the schema and the visible Q&A always match. Validates against schema.org's FAQPage, Person, and ProfessionalService types.

- [ ] **Step 1: Write the failing test**

  Create `src/lib/seo/jsonld.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest'
  import { personJsonLd, serviceJsonLd, faqPageJsonLd } from './jsonld'
  import { site, corollaries, sprintQA } from '$lib/content'

  describe('JSON-LD generators', () => {
  	it('personJsonLd has correct schema.org shape', () => {
  		const ld = personJsonLd()
  		expect(ld['@context']).toBe('https://schema.org')
  		expect(ld['@type']).toBe('Person')
  		expect(ld.name).toBe(site.operator.name)
  		expect(ld.jobTitle).toBe(site.operator.jobTitle)
  		expect(ld.worksFor).toEqual({
  			'@type': 'Organization',
  			name: site.operator.currentEmployer
  		})
  		expect(ld.alumniOf).toEqual({
  			'@type': 'Organization',
  			name: site.operator.formerEmployer
  		})
  	})

  	it('serviceJsonLd has correct schema.org shape', () => {
  		const ld = serviceJsonLd()
  		expect(ld['@context']).toBe('https://schema.org')
  		expect(ld['@type']).toBe('ProfessionalService')
  		expect(ld.name).toBe(site.offer.name)
  		expect(ld.priceRange).toBe(`$${site.offer.priceUSD}`)
  		expect(ld.offers.price).toBe(String(site.offer.priceUSD))
  		expect(ld.offers.priceCurrency).toBe('USD')
  	})

  	it('faqPageJsonLd combines corollaries + sprint Q&A', () => {
  		const ld = faqPageJsonLd()
  		expect(ld['@context']).toBe('https://schema.org')
  		expect(ld['@type']).toBe('FAQPage')
  		expect(ld.mainEntity).toHaveLength(corollaries.length + sprintQA.length)
  		const first = ld.mainEntity[0]
  		expect(first['@type']).toBe('Question')
  		expect(first.name).toBe(corollaries[0].question)
  		expect(first.acceptedAnswer.text).toBe(corollaries[0].answer)
  	})
  })
  ```

- [ ] **Step 2: Run the test — expect it to fail**

  Run:
  ```bash
  pnpm test:unit -- --run src/lib/seo/jsonld.test.ts
  ```
  Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement the generators**

  Create `src/lib/seo/jsonld.ts`:
  ```ts
  import { site, corollaries, sprintQA } from '$lib/content'

  type Org = { '@type': 'Organization'; name: string }

  export type PersonLd = {
  	'@context': 'https://schema.org'
  	'@type': 'Person'
  	name: string
  	jobTitle: string
  	worksFor: Org
  	alumniOf: Org
  	url: string
  }

  export type ServiceLd = {
  	'@context': 'https://schema.org'
  	'@type': 'ProfessionalService'
  	name: string
  	description: string
  	priceRange: string
  	provider: Omit<PersonLd, '@context' | 'url'>
  	offers: {
  		'@type': 'Offer'
  		price: string
  		priceCurrency: 'USD'
  	}
  }

  export type FaqLd = {
  	'@context': 'https://schema.org'
  	'@type': 'FAQPage'
  	mainEntity: Array<{
  		'@type': 'Question'
  		name: string
  		acceptedAnswer: {
  			'@type': 'Answer'
  			text: string
  		}
  	}>
  }

  export function personJsonLd(): PersonLd {
  	return {
  		'@context': 'https://schema.org',
  		'@type': 'Person',
  		name: site.operator.name,
  		jobTitle: site.operator.jobTitle,
  		worksFor: { '@type': 'Organization', name: site.operator.currentEmployer },
  		alumniOf: { '@type': 'Organization', name: site.operator.formerEmployer },
  		url: site.siteUrl
  	}
  }

  export function serviceJsonLd(): ServiceLd {
  	return {
  		'@context': 'https://schema.org',
  		'@type': 'ProfessionalService',
  		name: site.offer.name,
  		description: site.offer.promise,
  		priceRange: `$${site.offer.priceUSD}`,
  		provider: {
  			'@type': 'Person',
  			name: site.operator.name,
  			jobTitle: site.operator.jobTitle,
  			worksFor: { '@type': 'Organization', name: site.operator.currentEmployer },
  			alumniOf: { '@type': 'Organization', name: site.operator.formerEmployer }
  		},
  		offers: {
  			'@type': 'Offer',
  			price: String(site.offer.priceUSD),
  			priceCurrency: 'USD'
  		}
  	}
  }

  export function faqPageJsonLd(): FaqLd {
  	const all = [...corollaries, ...sprintQA]
  	return {
  		'@context': 'https://schema.org',
  		'@type': 'FAQPage',
  		mainEntity: all.map((qa) => ({
  			'@type': 'Question',
  			name: qa.question,
  			acceptedAnswer: { '@type': 'Answer', text: qa.answer }
  		}))
  	}
  }
  ```

- [ ] **Step 4: Run the test — expect it to pass**

  Run:
  ```bash
  pnpm test:unit -- --run src/lib/seo/jsonld.test.ts
  ```
  Expected: PASS, all 3 tests green.

- [ ] **Step 5: Commit**

  ```bash
  git add src/lib/seo/
  git commit -m "Add JSON-LD generators for Person, ProfessionalService, FAQPage"
  ```

---

### Task 4: Hero component

**Files:**
- Delete: `src/lib/components/Hero.svelte` (existing)
- Create: `src/lib/components/Hero.svelte`

H1 + subhead + primary CTA (book the call). Reads from `site.hero` and `site.bookingUrl`.

- [ ] **Step 1: Delete the existing Hero component**

  Run:
  ```bash
  rm src/lib/components/Hero.svelte
  ```

- [ ] **Step 2: Create the new Hero**

  Create `src/lib/components/Hero.svelte`:
  ```svelte
  <script lang="ts">
  	import { site } from '$lib/content'
  </script>

  <section class="py-24 md:py-32">
  	<div class="max-w-3xl mx-auto px-6">
  		<h1 class="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-neutral-900">
  			{site.hero.h1}
  		</h1>
  		<p class="mt-8 text-xl md:text-2xl text-neutral-600 leading-relaxed">
  			{site.hero.subhead}
  		</p>
  		<div class="mt-10">
  			<a
  				href={site.bookingUrl}
  				class="inline-block bg-neutral-900 text-white px-6 py-3 rounded-md hover:bg-neutral-700 transition-colors text-lg"
  				rel="noopener noreferrer"
  				target="_blank"
  			>
  				{site.hero.ctaPrimary} →
  			</a>
  		</div>
  	</div>
  </section>
  ```

- [ ] **Step 3: Verify imports resolve via type-check**

  Run:
  ```bash
  pnpm check
  ```
  Expected: 0 errors related to Hero.svelte. (May still report errors from the not-yet-rewritten `+page.svelte` — that's fine; we'll fix it in Task 12.)

- [ ] **Step 4: Commit**

  ```bash
  git add src/lib/components/Hero.svelte
  git commit -m "Rewrite Hero component to render H1, subhead, and book-the-call CTA"
  ```

---

### Task 5: Corollaries component

**Files:**
- Create: `src/lib/components/Corollaries.svelte`

Renders the 5 buyer-facing Q&A pairs in a 2-column grid. The `<dl>`/`<dt>`/`<dd>` semantics aid both screen readers and AEO crawlers.

- [ ] **Step 1: Create the component**

  Create `src/lib/components/Corollaries.svelte`:
  ```svelte
  <script lang="ts">
  	import { corollaries } from '$lib/content'
  </script>

  <section class="py-24 border-t border-neutral-200">
  	<div class="max-w-5xl mx-auto px-6">
  		<dl class="grid grid-cols-1 md:grid-cols-2 gap-12">
  			{#each corollaries as { question, answer }}
  				<div>
  					<dt class="text-2xl md:text-3xl font-semibold text-neutral-900">
  						{question}
  					</dt>
  					<dd class="mt-4 text-lg leading-relaxed text-neutral-700">
  						{answer}
  					</dd>
  				</div>
  			{/each}
  		</dl>
  	</div>
  </section>
  ```

- [ ] **Step 2: Type-check**

  Run:
  ```bash
  pnpm check
  ```
  Expected: 0 errors related to Corollaries.svelte.

- [ ] **Step 3: Commit**

  ```bash
  git add src/lib/components/Corollaries.svelte
  git commit -m "Add Corollaries component (5 buyer-facing Q&A in 2-col grid)"
  ```

---

### Task 6: SprintSection component

**Files:**
- Create: `src/lib/components/SprintSection.svelte`

Renders the offer detail as a Q&A list (single column, generous spacing). Multi-line answers (split by `\n` from the data layer) render as bullet lists.

- [ ] **Step 1: Create the component**

  Create `src/lib/components/SprintSection.svelte`:
  ```svelte
  <script lang="ts">
  	import { sprintQA, site } from '$lib/content'

  	function isList(answer: string): boolean {
  		return answer.includes('\n')
  	}

  	function lines(answer: string): string[] {
  		return answer.split('\n').filter((l) => l.trim().length > 0)
  	}
  </script>

  <section id="sprint" class="py-24 border-t border-neutral-200 bg-neutral-50">
  	<div class="max-w-3xl mx-auto px-6">
  		<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
  			The {site.offer.name}
  		</h2>
  		<p class="mt-4 text-lg text-neutral-600">{site.offer.promise}</p>

  		<dl class="mt-16 space-y-12">
  			{#each sprintQA as { question, answer }}
  				<div>
  					<dt class="text-2xl font-semibold text-neutral-900">{question}</dt>
  					<dd class="mt-3 text-lg leading-relaxed text-neutral-700">
  						{#if isList(answer)}
  							<ul class="list-disc list-outside pl-6 space-y-2">
  								{#each lines(answer) as line}
  									<li>{line}</li>
  								{/each}
  							</ul>
  						{:else}
  							{answer}
  						{/if}
  					</dd>
  				</div>
  			{/each}
  		</dl>
  	</div>
  </section>
  ```

- [ ] **Step 2: Type-check**

  Run:
  ```bash
  pnpm check
  ```
  Expected: 0 errors related to SprintSection.svelte.

- [ ] **Step 3: Commit**

  ```bash
  git add src/lib/components/SprintSection.svelte
  git commit -m "Add SprintSection component (offer Q&A list with multi-line bullet support)"
  ```

---

### Task 7: ProofSlot component

**Files:**
- Create: `src/lib/components/ProofSlot.svelte`

Honest in-progress placeholder for v1. Designed so cases can drop in as cards once they mature (next iteration).

- [ ] **Step 1: Create the component**

  Create `src/lib/components/ProofSlot.svelte`:
  ```svelte
  <section class="py-24 border-t border-neutral-200">
  	<div class="max-w-3xl mx-auto px-6">
  		<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
  			Currently shipping with…
  		</h2>
  		<p class="mt-6 text-lg leading-relaxed text-neutral-700">
  			A psychologist refreshing her practice site, and a friend's local business —
  			both with login access to their analytics so the before-and-after is real.
  			Case studies will land here once the after-state settles.
  		</p>
  		<p class="mt-4 text-base text-neutral-500">
  			I take one client per month. If you'd rather not wait for proof to talk,
  			the call link's at the top of the page.
  		</p>
  	</div>
  </section>
  ```

- [ ] **Step 2: Type-check**

  Run:
  ```bash
  pnpm check
  ```
  Expected: 0 errors related to ProofSlot.svelte.

- [ ] **Step 3: Commit**

  ```bash
  git add src/lib/components/ProofSlot.svelte
  git commit -m "Add ProofSlot component (in-progress case-study placeholder)"
  ```

---

### Task 8: LeadCapture component

**Files:**
- Create: `src/lib/components/LeadCapture.svelte`

Single-email-field form. POSTs to existing `/api/send-email` endpoint with required-field shape filled in:
- `name`: `'Notify list signup'`
- `email`: user input
- `message`: `'Wants notification when next sprint slot opens.'`
- `formStartedAt`: `Date.now()` set on mount (satisfies the time-trap bot protection)

The existing endpoint validates these and rate-limits per IP, so reuse is safe without changes.

- [ ] **Step 1: Create the component**

  Create `src/lib/components/LeadCapture.svelte`:
  ```svelte
  <script lang="ts">
  	import { site } from '$lib/content'

  	let email = $state('')
  	let company = $state('') // honeypot — never display, never submit non-empty
  	let formStartedAt = $state(0)
  	let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle')
  	let message = $state('')

  	$effect(() => {
  		formStartedAt = Date.now()
  	})

  	async function onSubmit(event: SubmitEvent) {
  		event.preventDefault()
  		if (status === 'submitting') return
  		status = 'submitting'
  		message = ''

  		try {
  			const res = await fetch('/api/send-email', {
  				method: 'POST',
  				headers: { 'Content-Type': 'application/json' },
  				body: JSON.stringify({
  					name: 'Notify list signup',
  					email: email.trim(),
  					message: 'Wants notification when next sprint slot opens.',
  					company,
  					formStartedAt
  				})
  			})
  			const data = (await res.json()) as { status?: string }
  			if (res.ok) {
  				status = 'success'
  				message = data.status ?? "You're on the list."
  				email = ''
  			} else {
  				status = 'error'
  				message = data.status ?? 'Something went wrong. Try again in a moment.'
  			}
  		} catch {
  			status = 'error'
  			message = 'Something went wrong. Try again in a moment.'
  		}
  	}
  </script>

  <section class="py-24 border-t border-neutral-200 bg-neutral-50">
  	<div class="max-w-2xl mx-auto px-6">
  		<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
  			Want a heads-up when the next slot opens?
  		</h2>
  		<p class="mt-4 text-lg text-neutral-600">
  			One client a month. If you're not ready to book today, drop your email and
  			I'll let you know when I'm taking the next one.
  		</p>

  		<form onsubmit={onSubmit} class="mt-8 flex flex-col sm:flex-row gap-3">
  			<label class="sr-only" for="email">Email address</label>
  			<input
  				id="email"
  				type="email"
  				required
  				autocomplete="email"
  				placeholder="you@yourdomain.com"
  				bind:value={email}
  				disabled={status === 'submitting'}
  				class="flex-1 px-4 py-3 border border-neutral-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60"
  			/>
  			<!-- honeypot, hidden from humans + assistive tech -->
  			<input
  				type="text"
  				name="company"
  				tabindex="-1"
  				autocomplete="off"
  				bind:value={company}
  				class="absolute left-[-9999px] top-auto w-px h-px overflow-hidden"
  				aria-hidden="true"
  			/>
  			<button
  				type="submit"
  				disabled={status === 'submitting'}
  				class="bg-neutral-900 text-white px-6 py-3 rounded-md hover:bg-neutral-700 transition-colors text-lg disabled:opacity-60"
  			>
  				{status === 'submitting' ? 'Sending…' : site.hero.ctaSecondary}
  			</button>
  		</form>

  		{#if status === 'success'}
  			<p class="mt-4 text-base text-emerald-700">{message}</p>
  		{:else if status === 'error'}
  			<p class="mt-4 text-base text-red-700">{message}</p>
  		{/if}
  	</div>
  </section>
  ```

  Note: the honeypot input is positioned off-screen rather than `display:none` because some bots skip `display:none` fields. The `autocomplete="off"` and `tabindex="-1"` further discourage keyboard traversal and password managers.

- [ ] **Step 2: Type-check**

  Run:
  ```bash
  pnpm check
  ```
  Expected: 0 errors related to LeadCapture.svelte.

- [ ] **Step 3: Commit**

  ```bash
  git add src/lib/components/LeadCapture.svelte
  git commit -m "Add LeadCapture component (email form posting to /api/send-email with honeypot)"
  ```

---

### Task 9: Footer component

**Files:**
- Delete: `src/lib/components/Footer.svelte` (existing)
- Create: `src/lib/components/Footer.svelte`

The footer is creative space (per spec). Carries the unofficial tagline + garden link + a small attribution.

- [ ] **Step 1: Delete the existing Footer**

  Run:
  ```bash
  rm src/lib/components/Footer.svelte
  ```

- [ ] **Step 2: Create the new Footer**

  Create `src/lib/components/Footer.svelte`:
  ```svelte
  <script lang="ts">
  	import { site } from '$lib/content'
  </script>

  <footer class="py-16 border-t border-neutral-200 bg-neutral-900 text-neutral-100">
  	<div class="max-w-5xl mx-auto px-6">
  		<p class="text-2xl md:text-3xl font-semibold tracking-tight">
  			sixtom — {site.tagline}
  		</p>
  		<div class="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-neutral-400">
  			<p>
  				Designed and built by {site.operator.name}.
  			</p>
  			<a
  				href={site.gardenUrl}
  				class="underline underline-offset-4 hover:text-white"
  				rel="noopener noreferrer"
  				target="_blank"
  			>
  				more at the garden →
  			</a>
  		</div>
  	</div>
  </footer>
  ```

- [ ] **Step 3: Type-check**

  Run:
  ```bash
  pnpm check
  ```
  Expected: 0 errors related to Footer.svelte.

- [ ] **Step 4: Commit**

  ```bash
  git add src/lib/components/Footer.svelte
  git commit -m "Rewrite Footer with tagline, garden link, and attribution"
  ```

---

### Task 10: Rewrite the home route

**Files:**
- Modify: `src/routes/+page.svelte`
- Modify: `src/routes/+page.server.ts`

The home page composes the new components. The page server load drops the Sanity fetch and just sets `prerender = true`.

- [ ] **Step 1: Replace `+page.server.ts` with prerender-only**

  Overwrite `src/routes/+page.server.ts`:
  ```ts
  export const prerender = true
  ```

  (Drops the Sanity GROQ query and the `load` function entirely. The home page no longer needs server-side data — copy lives in `$lib/content`.)

- [ ] **Step 2: Replace `+page.svelte` with the composed sections**

  Overwrite `src/routes/+page.svelte`:
  ```svelte
  <script lang="ts">
  	import Hero from '$lib/components/Hero.svelte'
  	import Corollaries from '$lib/components/Corollaries.svelte'
  	import SprintSection from '$lib/components/SprintSection.svelte'
  	import ProofSlot from '$lib/components/ProofSlot.svelte'
  	import LeadCapture from '$lib/components/LeadCapture.svelte'
  	import Footer from '$lib/components/Footer.svelte'
  	import { site } from '$lib/content'
  </script>

  <Hero />

  <section class="py-6 border-t border-neutral-200">
  	<div class="max-w-3xl mx-auto px-6">
  		<p class="text-base text-neutral-600">{site.operator.credentialsChip}</p>
  	</div>
  </section>

  <section class="py-24 border-t border-neutral-200">
  	<div class="max-w-3xl mx-auto px-6">
  		<p class="text-3xl md:text-4xl font-semibold tracking-tight italic text-neutral-900 leading-snug">
  			{site.thesis}
  		</p>
  	</div>
  </section>

  <Corollaries />
  <SprintSection />
  <ProofSlot />
  <LeadCapture />
  <Footer />
  ```

- [ ] **Step 3: Type-check the route**

  Run:
  ```bash
  pnpm check
  ```
  Expected: 0 errors. (Any earlier errors from legacy components should now be irrelevant since the rewritten page no longer imports them; legacy components will be deleted in Task 14.)

- [ ] **Step 4: Boot the dev server and visually verify**

  Run:
  ```bash
  pnpm dev
  ```
  Open `http://localhost:5173`. Confirm:
  - Hero H1 + subhead + "Book a 30-min intro call →" button render
  - Credentials chip visible just below
  - Thesis band ("Action leads to insight…") in italic
  - 5 corollaries in a 2-col grid (1 col on mobile)
  - Sprint section with all Q&A
  - Proof slot with placeholder copy
  - Email form
  - Dark footer with tagline + garden link
  
  Stop the server.

- [ ] **Step 5: Commit**

  ```bash
  git add src/routes/+page.svelte src/routes/+page.server.ts
  git commit -m "Rewrite home page to compose v1 sections; drop Sanity load"
  ```

---

### Task 11: Layout — switch background, embed JSON-LD scripts

**Files:**
- Modify: `src/routes/+layout.svelte`

Switch background to white. Inject the three JSON-LD scripts in the layout so they render on every page (FAQPage and ProfessionalService schemas only describe the home page accurately, but emitting them site-wide is harmless because the home page is the only public route besides Sanity Studio at `/sanity`, which is a client-side SPA shell).

- [ ] **Step 1: Replace `+layout.svelte`**

  Overwrite `src/routes/+layout.svelte`:
  ```svelte
  <script lang="ts">
  	import '../app.css'
  	import { personJsonLd, serviceJsonLd, faqPageJsonLd } from '$lib/seo/jsonld'

  	let { children } = $props()

  	const personLd = JSON.stringify(personJsonLd())
  	const serviceLd = JSON.stringify(serviceJsonLd())
  	const faqLd = JSON.stringify(faqPageJsonLd())
  </script>

  <svelte:head>
  	{@html `<script type="application/ld+json">${personLd}</script>`}
  	{@html `<script type="application/ld+json">${serviceLd}</script>`}
  	{@html `<script type="application/ld+json">${faqLd}</script>`}
  </svelte:head>

  <main class="bg-white font-sans text-neutral-900 min-h-screen">
  	{@render children()}
  </main>
  ```

  Note on `{@html}`: the JSON we embed is generated entirely from typed in-repo content (no user input). Since the data is `JSON.stringify`'d, it's safe by construction — no `</script>` injection vector exists in our content. Using `{@html}` is required because Svelte escapes `<script>` text in normal interpolation.

- [ ] **Step 2: Verify the JSON-LD renders correctly**

  Run:
  ```bash
  pnpm dev
  ```
  Open `http://localhost:5173`, view-source, and confirm three `<script type="application/ld+json">` tags appear in `<head>`, each with valid JSON. Stop the server.

- [ ] **Step 3: Commit**

  ```bash
  git add src/routes/+layout.svelte
  git commit -m "Switch layout background to white; embed Person/Service/FAQ JSON-LD"
  ```

---

### Task 12: Update `app.html` with title, meta, OG/Twitter cards

**Files:**
- Modify: `src/app.html`

The current `app.html` has the SvelteKit defaults. We replace `<title>` and add meta tags. The title and description come from constants we'll add to `app.html` directly (small enough that pulling them from a Svelte component is unnecessary — `app.html` is a static template).

- [ ] **Step 1: Read the current `app.html`**

  ```bash
  cat src/app.html
  ```
  Expected: a SvelteKit default with `%sveltekit.head%` and `%sveltekit.body%`.

- [ ] **Step 2: Replace `app.html`**

  Overwrite `src/app.html`:
  ```html
  <!doctype html>
  <html lang="en">
  	<head>
  		<meta charset="utf-8" />
  		<meta name="viewport" content="width=device-width, initial-scale=1" />
  		<meta name="theme-color" content="#0a0a0a" />

  		<title>sixtom — 1-week site sprint by Sam D'Angelo</title>
  		<meta
  			name="description"
  			content="1-week site sprint with before/after instrumented. $7,500 fixed. One client per month."
  		/>

  		<meta property="og:title" content="sixtom — 1-week site sprint by Sam D'Angelo" />
  		<meta
  			property="og:description"
  			content="1-week site sprint with before/after instrumented. $7,500 fixed. One client per month."
  		/>
  		<meta property="og:type" content="website" />
  		<meta property="og:url" content="https://sixtom.com/" />
  		<meta property="og:image" content="https://sixtom.com/og.png" />

  		<meta name="twitter:card" content="summary_large_image" />
  		<meta name="twitter:title" content="sixtom — 1-week site sprint by Sam D'Angelo" />
  		<meta
  			name="twitter:description"
  			content="1-week site sprint with before/after instrumented. $7,500 fixed. One client per month."
  		/>
  		<meta name="twitter:image" content="https://sixtom.com/og.png" />

  		<link rel="icon" href="%sveltekit.assets%/favicon.svg" type="image/svg+xml" />

  		%sveltekit.head%
  	</head>
  	<body data-sveltekit-preload-data="hover">
  		<div style="display: contents">%sveltekit.body%</div>
  	</body>
  </html>
  ```

  Note: the OG/Twitter URLs hard-code `https://sixtom.com` to match `static/sitemap.xml` and `static/robots.txt`. When the operator replaces the production domain, these strings update in three places (`app.html`, `static/sitemap.xml`, `static/robots.txt`) — flagged in the launch checklist.

- [ ] **Step 3: Commit**

  ```bash
  git add src/app.html
  git commit -m "Add title, description, OG, Twitter meta to app.html"
  ```

---

### Task 13: Static SEO/AEO files (`llms.txt`, `sitemap.xml`, `robots.txt`, placeholders for og.png + favicon.svg)

**Files:**
- Create: `static/llms.txt`
- Create: `static/sitemap.xml`
- Create: `static/robots.txt`
- Create: `static/favicon.svg`
- Create: `static/og.png` (placeholder)

- [ ] **Step 1: Create `llms.txt`**

  Create `static/llms.txt`:
  ```
  # sixtom

  > 1-week site sprint by Sam D'Angelo, lead engineer at Made In Cookware. $7,500 fixed. One client per month.

  ## What it is

  - Productized 1-week sprint to rebuild your site.
  - Begins with login access to your analytics, CMS, and hosting so the work is grounded in your actual data.
  - A live working version delivered mid-sprint.
  - One round of revisions, then deployment to your hosting.
  - 30-day check-in to capture before/after metrics.

  ## Who it's for

  - Founders, operators, and small business owners whose website (and the data and tools around it) has gotten in the way of growth.

  ## Pricing

  - $7,500 USD, fixed.
  - One client per month, by appointment.
  - If the working version isn't on track by day 3, we pause; the client keeps what's been built and pays only for time spent.

  ## How to engage

  - Book a 30-min intro call: https://sixtom.com (link from the homepage)
  - Notify list (signup form on the homepage) for next available sprint slot.
  ```

- [ ] **Step 2: Create `sitemap.xml`**

  Create `static/sitemap.xml`:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  	<url>
  		<loc>https://sixtom.com/</loc>
  		<lastmod>2026-04-27</lastmod>
  		<changefreq>monthly</changefreq>
  		<priority>1.0</priority>
  	</url>
  </urlset>
  ```

- [ ] **Step 3: Create `robots.txt`**

  Create `static/robots.txt`:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://sixtom.com/sitemap.xml
  ```

- [ ] **Step 4: Create a placeholder `favicon.svg`**

  Create `static/favicon.svg`:
  ```xml
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  	<rect width="64" height="64" rx="14" fill="#0a0a0a" />
  	<text x="32" y="42" text-anchor="middle" font-family="system-ui, sans-serif" font-size="34" font-weight="800" fill="#ffffff">s</text>
  </svg>
  ```

- [ ] **Step 5: Create a placeholder `og.png`**

  Generate a 1200×630 solid-black PNG with white "sixtom" text. Run from the repo root:
  ```bash
  cat > /tmp/og-gen.html <<'EOF'
  <!doctype html>
  <html><head><style>
  body { margin:0; width:1200px; height:630px; background:#0a0a0a; color:#fff;
    font-family: system-ui, sans-serif; display:flex; align-items:center; justify-content:center; }
  h1 { font-size:120px; font-weight:800; letter-spacing:-3px; margin:0; }
  </style></head><body><h1>sixtom</h1></body></html>
  EOF
  ```

  If the operator already has a designed OG image, drop it in at `static/og.png` instead. For now, create a placeholder PNG using ImageMagick or similar:
  ```bash
  # Using ImageMagick (if installed):
  magick -size 1200x630 xc:'#0a0a0a' \
  	-pointsize 120 -fill white -gravity center -font 'Helvetica-Bold' \
  	-annotate 0 'sixtom' static/og.png
  
  # Fallback: create a minimal valid PNG via Node so the file exists.
  # If neither is available, manually create static/og.png as a 1200x630 PNG before launch.
  ```

  If neither `magick` nor a manual PNG is available locally, leave `static/og.png` as a 1×1 transparent PNG (created via `printf` in the next step) so the meta tag still resolves — it'll be replaced pre-launch.

  Generate a 1×1 transparent PNG fallback (run only if no real image was created above):
  ```bash
  printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xfa\xcf\x00\x00\x00\x02\x00\x01\xe5\x27\xde\xfc\x00\x00\x00\x00IEND\xaeB`\x82' > static/og.png
  ```

- [ ] **Step 6: Verify static assets are served**

  Run:
  ```bash
  pnpm dev
  ```
  Visit each in a browser:
  - `http://localhost:5173/llms.txt`
  - `http://localhost:5173/sitemap.xml`
  - `http://localhost:5173/robots.txt`
  - `http://localhost:5173/favicon.svg`
  - `http://localhost:5173/og.png`

  Expected: each loads without 404. Stop the server.

- [ ] **Step 7: Commit**

  ```bash
  git add static/
  git commit -m "Add llms.txt, sitemap.xml, robots.txt, favicon.svg, placeholder og.png"
  ```

---

### Task 14: Delete legacy components

**Files:**
- Delete: 7 unused components in `src/lib/components/`

These were used by the old Sanity-driven home page. The new page doesn't import them, and leaving them creates confusion for future readers.

- [ ] **Step 1: Verify the rewritten page doesn't import any legacy component**

  Run:
  ```bash
  grep -rE "(Header|Credibility|ProblemSection|Services|ServiceBlock|Contact|SocialLinks|PortableText)\\.svelte" src/
  ```
  Expected: no matches in `src/routes/`. (Sanity-related files in `src/lib/client/` and the Sanity Studio route at `src/routes/sanity/` may still match, but those aren't the legacy components — verify each grep result is OK to leave alone.)

- [ ] **Step 2: Delete the legacy components**

  Run:
  ```bash
  rm src/lib/components/Header.svelte \
  	src/lib/components/Credibility.svelte \
  	src/lib/components/ProblemSection.svelte \
  	src/lib/components/Services.svelte \
  	src/lib/components/ServiceBlock.svelte \
  	src/lib/components/Contact.svelte \
  	src/lib/components/SocialLinks.svelte \
  	src/lib/components/PortableText.svelte
  ```

- [ ] **Step 3: Type-check + lint**

  Run:
  ```bash
  pnpm check
  pnpm lint
  ```
  Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

  ```bash
  git add -A src/lib/components/
  git commit -m "Remove legacy components (Header, Credibility, ProblemSection, Services, ServiceBlock, Contact, SocialLinks, PortableText)"
  ```

---

### Task 15: Drop unused server-side and Sanity glue from the home route

**Files:**
- Inspect: `src/lib/types/index.ts` (the `Project` type was used by the old `+page.server.ts`)
- Modify if unused: `src/lib/types/index.ts`

The `Project` type is now unused. Either delete it or leave it in case the operator wants to revive Sanity content on a future route.

- [ ] **Step 1: Search for any remaining usage of the `Project` type**

  Run:
  ```bash
  grep -rE "from '\$lib/types'" src/
  grep -rE "Project" src/lib/ src/routes/
  ```
  Expected: only the definition itself in `src/lib/types/index.ts`. No imports.

- [ ] **Step 2: Decision point**

  If no other usage, leave the file as-is (it's a placeholder for future types) but no commit needed. If the file would be empty after cleanup, leave the existing `Project` type as a placeholder — harmless, and avoids deleting a `$lib/types` symbol that future work may want.

  No commit if no change made.

---

### Task 16: Build, lint, typecheck, end-to-end

**Files:** none (verification)

- [ ] **Step 1: Run formatter check**

  Run:
  ```bash
  pnpm format
  ```
  Expected: completes; any reformatted files are committed in step 6 below.

- [ ] **Step 2: Run lint**

  Run:
  ```bash
  pnpm lint
  ```
  Expected: 0 errors, 0 warnings. If errors, fix and re-run.

- [ ] **Step 3: Run type-check**

  Run:
  ```bash
  pnpm check
  ```
  Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Run unit tests**

  Run:
  ```bash
  pnpm test:unit -- --run
  ```
  Expected: all tests in `src/lib/content/content.test.ts` and `src/lib/seo/jsonld.test.ts` pass.

- [ ] **Step 5: Run production build**

  Run:
  ```bash
  pnpm build
  ```
  Expected: completes successfully; the home page is included in the prerendered output (check `.svelte-kit/output/prerendered/pages/index.html` exists).

- [ ] **Step 6: Verify the prerendered HTML contains the schema markup**

  Run:
  ```bash
  grep -c 'application/ld+json' .svelte-kit/output/prerendered/pages/index.html
  ```
  Expected: `3` (Person, ProfessionalService, FAQPage).

- [ ] **Step 7: Verify the prerendered HTML contains the Q&A copy**

  Run:
  ```bash
  grep -c 'Why move fast?' .svelte-kit/output/prerendered/pages/index.html
  grep -c 'How much?' .svelte-kit/output/prerendered/pages/index.html
  grep -c '7,500' .svelte-kit/output/prerendered/pages/index.html
  ```
  Expected: each grep returns `1` or higher (the question and the price string appear in the prerendered output).

- [ ] **Step 8: Commit any formatting changes**

  Run:
  ```bash
  git status
  git add -A
  git diff --cached --stat
  ```
  If there are changes to commit:
  ```bash
  git commit -m "Apply formatter to v1 site files"
  ```
  If clean, skip.

---

### Task 17: Browser smoke test

**Files:** none (manual verification)

- [ ] **Step 1: Boot the dev server**

  Run:
  ```bash
  pnpm dev
  ```

- [ ] **Step 2: Desktop walk-through** (`http://localhost:5173`)

  Click through every CTA. Confirm:
  - Hero "Book a 30-min intro call →" opens `https://cal.com/sam-dangelo/sprint-intro` in a new tab. (Will 404 until the operator updates the Cal.com URL — note as expected.)
  - Footer "more at the garden →" opens `https://garden.example.com` in a new tab. (Same — placeholder.)
  - Email form submits with a valid email → shows the success message. Submit fails with bad/missing email → form's native validation triggers.

- [ ] **Step 3: Submit the email form with a test email**

  Enter `you+test@example.com` in the email field, click submit. Expected: success message appears underneath the form (assumes SMTP env vars are configured locally; if not, expected outcome is the error message — that's still a valid behavior verification).

- [ ] **Step 4: Mobile width**

  Resize the browser to 360px wide (or use device toolbar). Confirm:
  - Hero copy stacks readably
  - Corollaries grid drops to 1 column
  - Sprint Q&A is single-column always
  - Email form input and button stack vertically (`flex-col`)
  - Footer is readable (no horizontal scroll)

- [ ] **Step 5: Verify view-source shows three JSON-LD scripts**

  Right-click → View Page Source. Search for `application/ld+json`. Expected: 3 occurrences.

- [ ] **Step 6: Stop the dev server**

  Ctrl-C the running `pnpm dev`.

  No commit for this task.

---

### Task 18: Update `CLAUDE.md` to reflect v1 site

**Files:**
- Modify: `CLAUDE.md`

The existing `CLAUDE.md` describes the Sanity-driven dual-app architecture. After this v1 build, the home page is no longer Sanity-driven. Update the relevant sections.

- [ ] **Step 1: Read the current `CLAUDE.md`**

  ```bash
  cat CLAUDE.md
  ```

- [ ] **Step 2: Replace the "Architecture" section**

  In `CLAUDE.md`, find the section heading `## Architecture` and replace through the end of the "### Sanity client" subsection with:

  ```markdown
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
  ```

- [ ] **Step 3: Update the "Contact form endpoint" section**

  Find the `### Contact form endpoint` heading and update its first sentence to reference the LeadCapture component:

  Replace:
  > POSTs JSON `{ name, email, message, company?, formStartedAt? }`. It is the only runtime route and contains layered bot/abuse protection that must be preserved if you touch it:

  With:
  > POSTs JSON `{ name, email, message, company?, formStartedAt? }`. It is the only runtime route. The `LeadCapture` component on the home page submits to it with `name = 'Notify list signup'` + a fixed `message`, reusing the existing rate limit and bot protection. The endpoint contains layered bot/abuse protection that must be preserved if you touch it:

- [ ] **Step 4: Type-check that everything still compiles**

  Run:
  ```bash
  pnpm check
  ```
  Expected: 0 errors. (CLAUDE.md is a doc file, but running `check` confirms nothing else regressed.)

- [ ] **Step 5: Commit**

  ```bash
  git add CLAUDE.md
  git commit -m "Update CLAUDE.md to reflect v1 site architecture"
  ```

---

### Task 19: Cal.com sync script

**Files:**
- Create: `scripts/sync-cal.ts`
- Modify: `package.json` (add `tsx` + `dotenv` devDeps + `cal:sync` script)
- Modify: `.env.example` (add `CAL_API_KEY`, `CAL_USERNAME`)

The script reads `calEvent` from `$lib/content` and POSTs (or PATCHes) the Cal.com v2 API to provision the intro-call event type. Run on demand: `pnpm cal:sync`. The site itself does not run this — it's an operator command, not part of `pnpm build`.

- [ ] **Step 1: Add `tsx` and `dotenv` to devDependencies**

  Run:
  ```bash
  pnpm add -D tsx dotenv
  ```
  Expected: both packages added to `devDependencies` in `package.json`; `pnpm-lock.yaml` updated.

- [ ] **Step 2: Add the `cal:sync` script to `package.json`**

  Open `package.json`. In the `"scripts"` block, add (placement: next to the existing `"db:*"` lines for visual grouping):
  ```json
  "cal:sync": "tsx scripts/sync-cal.ts"
  ```

- [ ] **Step 3: Add Cal.com env vars to `.env.example`**

  Append to `.env.example`:
  ```
  CAL_API_KEY=""
  CAL_USERNAME=""
  ```

- [ ] **Step 4: Create the sync script**

  Create `scripts/sync-cal.ts`:
  ```ts
  import 'dotenv/config'
  import { calEvent } from '../src/lib/content/site'

  const API_KEY = process.env.CAL_API_KEY
  const USERNAME = process.env.CAL_USERNAME

  if (!API_KEY) {
  	console.error('Missing CAL_API_KEY in .env')
  	process.exit(1)
  }
  if (!USERNAME) {
  	console.error('Missing CAL_USERNAME in .env')
  	process.exit(1)
  }

  const BASE = 'https://api.cal.com/v2'
  const HEADERS = {
  	Authorization: `Bearer ${API_KEY}`,
  	'cal-api-version': '2024-06-14',
  	'Content-Type': 'application/json'
  } as const

  function fieldType(t: 'text' | 'longText' | 'select'): string {
  	return t === 'longText' ? 'textarea' : t === 'select' ? 'select' : 'text'
  }

  function toBookingField(q: (typeof calEvent.intakeQuestions)[number]) {
  	const slug = q.label
  		.toLowerCase()
  		.replace(/[^a-z0-9]+/g, '-')
  		.replace(/^-+|-+$/g, '')
  		.slice(0, 40)
  	const base = { type: fieldType(q.type), slug, label: q.label, required: q.required }
  	if (q.type === 'select' && q.options?.length) {
  		return { ...base, options: q.options.map((o) => ({ label: o, value: o })) }
  	}
  	return base
  }

  type EventTypeRow = { id: number; slug: string }

  async function listEventTypes(): Promise<EventTypeRow[]> {
  	const res = await fetch(`${BASE}/event-types?username=${USERNAME}`, { headers: HEADERS })
  	if (!res.ok) {
  		throw new Error(`List event-types failed: ${res.status} ${await res.text()}`)
  	}
  	const json = (await res.json()) as { data?: EventTypeRow[] }
  	return json.data ?? []
  }

  const existing = await listEventTypes()
  const match = existing.find((e) => e.slug === calEvent.slug)
  const payload = {
  	title: calEvent.title,
  	slug: calEvent.slug,
  	lengthInMinutes: calEvent.durationMinutes,
  	description: calEvent.description,
  	bookingFields: calEvent.intakeQuestions.map(toBookingField)
  }
  const url = match ? `${BASE}/event-types/${match.id}` : `${BASE}/event-types`
  const method = match ? 'PATCH' : 'POST'
  const res = await fetch(url, { method, headers: HEADERS, body: JSON.stringify(payload) })
  if (!res.ok) {
  	throw new Error(`${method} event-type failed: ${res.status} ${await res.text()}`)
  }
  console.log(`${match ? 'Updated' : 'Created'} event type "${calEvent.title}".`)
  console.log(`Booking URL: https://cal.com/${USERNAME}/${calEvent.slug}`)
  ```

  Note: this uses top-level `await` (Node 20+ + ESM). The script runs once when invoked; no event-loop hooks needed.

- [ ] **Step 5: Type-check the script**

  Run:
  ```bash
  pnpm exec tsc --noEmit --module esnext --target esnext --moduleResolution bundler --allowImportingTsExtensions false scripts/sync-cal.ts
  ```
  Expected: 0 errors.

  (Optional smoke run: `CAL_API_KEY=test CAL_USERNAME=test pnpm cal:sync` will reach Cal.com and 401 — that's fine, it confirms the script wires up correctly without provisioning anything.)

- [ ] **Step 6: Commit**

  ```bash
  git add scripts/sync-cal.ts package.json pnpm-lock.yaml .env.example
  git commit -m "Add Cal.com sync script (provisions intro event from site.calEvent)"
  ```

---

### Task 20: Push branch and open PR

**Files:** none (git operations)

- [ ] **Step 1: Verify the branch is clean and up-to-date with main**

  Run:
  ```bash
  git status
  git log --oneline main..HEAD
  ```
  Expected: working tree clean; commit list shows the v1 work plus the initial CLAUDE.md commit.

- [ ] **Step 2: Push the branch with upstream tracking**

  Run:
  ```bash
  git push -u origin sixtom-mvp
  ```

- [ ] **Step 3: Open the PR**

  Run:
  ```bash
  gh pr create --title "sixtom v1 — single-page offer site for the Sprint" --body "$(cat <<'EOF'
  ## Summary

  - Replaces the Sanity-driven home page with a single-page Q&A-structured offer site for the Sixtom Sprint ($7,500 fixed, 1 client/mo, by appointment).
  - Voice and copy filtered through `../garden/content/self.md`; no AI or tech-stack mentions on the buyer-facing page.
  - Schema.org JSON-LD (Person, ProfessionalService, FAQPage) + `llms.txt`, `sitemap.xml`, `robots.txt`, OG/Twitter meta — all generated from the same typed content layer.
  - Email capture wired to existing `/api/send-email` (reuses bot protection, rate limit). Book-the-call links to a Cal.com URL placeholder.
  - 7 legacy components removed; CLAUDE.md updated to reflect the v1 architecture.

  ## Spec & plan

  - Design spec: `docs/superpowers/specs/2026-04-27-sixtom-mvp-design.md`
  - Implementation plan: `docs/superpowers/plans/2026-04-27-sixtom-mvp.md`

  ## Pre-launch checklist (operator action required)

  - [ ] Set `CAL_API_KEY` and `CAL_USERNAME` in your local `.env` (and on Vercel for production).
  - [ ] Run `pnpm cal:sync` to provision the intro event in Cal.com.
  - [ ] Verify the resulting Cal.com URL matches `bookingUrl` in `src/lib/content/site.ts`; update either side if not.
  - [ ] Replace `gardenUrl` in `src/lib/content/site.ts` with the actual garden site URL.
  - [ ] Replace `siteUrl` in `src/lib/content/site.ts` with the production domain.
  - [ ] Update the production domain in `static/sitemap.xml`, `static/robots.txt`, and the OG/Twitter URLs in `src/app.html`.
  - [ ] Replace `static/og.png` with a designed 1200×630 social card.
  - [ ] Replace `static/favicon.svg` if a brand mark exists.

  ## Test plan

  - [ ] `pnpm check` passes
  - [ ] `pnpm lint` passes
  - [ ] `pnpm test:unit -- --run` passes (content shape + JSON-LD generators)
  - [ ] `pnpm build` completes; `.svelte-kit/output/prerendered/pages/index.html` contains 3 `application/ld+json` scripts
  - [ ] Manually walk every CTA in the dev server (book-the-call link, garden link, email form happy/sad paths)
  - [ ] Mobile (360px) and desktop (1440px) layouts both readable
  - [ ] Validate the rendered JSON-LD with [Google's Rich Results Test](https://search.google.com/test/rich-results) once a preview deploy is up

  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  EOF
  )"
  ```

- [ ] **Step 4: Capture the PR URL**

  The `gh pr create` output will print the PR URL. Save that for the user.

  No commit for this task.

---

## Self-review checklist (run before declaring done)

Run this once at the very end:

- [ ] **Spec coverage check.** Re-read `docs/superpowers/specs/2026-04-27-sixtom-mvp-design.md` Definition of Done section. Every checkbox in that section maps to at least one task above. Open the PR description's "Pre-launch checklist" — those are the items that require operator input post-merge.
- [ ] **No AI / tech-stack mentions in buyer-facing copy.** Run:
  ```bash
  grep -niE '(\bAI\b|AI-|svelte|tailwind|vercel|sanity|drizzle|typescript)' src/lib/content/ src/lib/components/ src/routes/+page.svelte src/app.html static/llms.txt
  ```
  Expected: no matches in user-visible strings (matches in component imports/comments are fine; matches inside copy strings are not). If the grep finds any, fix and re-run before committing.
- [ ] **All Q&A pairs have non-empty content.** Already covered by the `content.test.ts` tests, which run as part of `pnpm test:unit`.
- [ ] **JSON-LD validates.** Manually paste the rendered `<head>` JSON into [validator.schema.org](https://validator.schema.org/) once a preview deploy is up. (Cannot do this from local without a public URL; flag in PR test plan.)

---

## Out of scope (do NOT implement)

These appear in the spec's "Out of scope for v1" section. Resist scope creep.

- DFY/DWY/DIY ladder UI on the site
- Multi-page navigation (about, services, blog)
- Vertical-specific landing pages
- Programmatic SEO templates
- Blog/content engine on sixtom (lives on garden)
- Newsletter / opt-in beyond the single email field
- Lead-magnet asset (planned for v1.5; the v1 email field is intent-only)
- Any visual motion/animation beyond browser-native

---

## Risks for the implementer

- **`/api/send-email` requires SMTP env vars locally.** Without `SMTP_*` envs in `.env`, the LeadCapture form will return a 500 in local dev. That's fine for visual verification; production deployment must have the envs set on Vercel. Don't change the endpoint to make local dev "easier" — that's a different fix.
- **Honeypot field positioning.** The hidden `company` field uses `position: absolute; left: -9999px` rather than `display: none` because some bots skip `display: none` fields. If the lint config flags this, suppress with a focused `eslint-disable-next-line` rather than weakening the protection.
- **Prerender + JSON-LD.** Because the home page is prerendered, the JSON-LD scripts are baked into static HTML at build time, not generated per-request. That's correct and desired (all content is static), but means changes to content data require a rebuild — not a runtime concern for this site.
- **Sanity Studio at `/sanity` is unaffected.** Don't touch `src/lib/client/sanity.ts`, `src/lib/components/SanityStudio.svelte`, `src/routes/sanity/`, or `src/schemas/` — they aren't part of v1's scope but they aren't broken either.

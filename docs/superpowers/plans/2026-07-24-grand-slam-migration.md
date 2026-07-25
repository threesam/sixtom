# Grand Slam Offer Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3-rung ladder (audit/sprint/retainer) with ONE grand-slam offer across every surface of sixtom.com — lander, /notify waitlist, /faq, /terms, JSON-LD, cal.com intake — as one coherent train, so prod never shows a mixed offer.

**Architecture:** Integration branch `feature/grand-slam` cut from `main` (via /choochoo). Each task lands on that branch as its own reviewed chunk (`/rev` to 2-consecutive-zero per chunk). Content is data-first: all offer copy lives in `src/lib/content/offer.ts` (new) + `site.ts`, rendered by a rewritten home route. The branch merges to `main` once, atomically. Copy source of truth: vault notes `sixtom Grand Slam Offer — $100M Offers design` + `sixtom grand slam — page copy (voice pass)` (v0, Sam polishes words any time — polish = string edits in content files only).

**Tech Stack:** SvelteKit 2 + Svelte 5 runes, Tailwind 4, vitest, Playwright, pnpm. No new dependencies.

## Global Constraints

- **Voice:** strict lowercase copy (lowercase `i`; caps only for brand names/acronyms: AI, SEO, Lighthouse, Loom, SIXTOM). Terminal periods. Sub-page titles `<subject> | SIXTOM`; home title is the brand-first exception.
- **Results over mechanism:** the word "agent" must never appear in customer-facing offer copy (pinned by test in Task 1). AI appears only as the _client's_ context.
- **Frozen event names** (external consumers / dashboards): `book_step_next`, `book_submit`, `book_qualified_booking_click` (infra brief.py), `cta_notify_submit`, `notify_signup_success`, `footer_*`, `cta_garden_link`, `cta_tax_calc`, `cta_calc_book`, `cta_case_study_book`. Never rename; new events may be added.
- **Home stays `csr = false`** (`src/routes/+page.ts`). The home waitlist form must work with zero JS (plain POST, no `use:enhance` on home).
- **Listmonk hygiene:** never let a test email reach the `sixtom` list. Task 3 adds the guard. E2E uses `CONTACT_FORM_TEST_EMAIL` (env var NAME only — value comes from `e2e/constants.ts`).
- **Honest-at-zero:** no "X of 3 left" counters anywhere. Scarcity is stated as capacity ("1 client a month") only.
- **Deps pinned exact** — no caret/tilde. This plan adds no deps; if one sneaks in, pin it.
- **Per chunk gates:** `pnpm format && pnpm lint && pnpm check && pnpm test && pnpm build` all green, then `/rev` (security → simplify+review loop, 2 consecutive zero rounds, cap 3) before the next task starts.
- Commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- **Never merge `feature/grand-slam` → `main` without Sam's explicit go.** `pnpm cal:sync` (Task 7) pushes to cal.com — also gated on Sam's go.

## Pre-flight

- [ ] **Step 0.1:** From clean `main`: run `/choochoo grand-slam` (creates `feature/grand-slam` + tracking issue). All work happens on chunk branches cut from `feature/grand-slam`, PR'd back into it.
- [ ] **Step 0.2:** First commit on the branch: this plan file. `git add docs/superpowers/plans/2026-07-24-grand-slam-migration.md && git commit -m "docs: grand-slam migration plan"`

---

### Task 1: Content layer — the offer as data

**Files:**

- Modify: `src/lib/content/types.ts`
- Create: `src/lib/content/offer.ts`
- Modify: `src/lib/content/site.ts`
- Modify: `src/lib/content/index.ts`
- Modify: `src/lib/content/content.test.ts`

**Interfaces:**

- Consumes: existing `Stat`, `ProcessStep`, `Offer` types; `site.sprint` pricing fields.
- Produces: `grandSlam: GrandSlamOffer` (named export from `$lib/content`), `LEDGER_TOTAL_USD: number`, types `LedgerLine`, `LedgerGroup`, `CostCard`, `GrandSlamOffer`. `Site` loses `audit`, `retainer`, `hero`. Later tasks import `{ site, grandSlam, LEDGER_TOTAL_USD }` from `$lib/content`.

- [ ] **Step 1: Write the failing tests** — replace `src/lib/content/content.test.ts` with:

```ts
import { describe, it, expect } from 'vitest'
import { site, calEvent, grandSlam, LEDGER_TOTAL_USD } from './index'

describe('content', () => {
	it('site exports the operator + sprint (audit and retainer are gone)', () => {
		expect(site.operator.name).toBe("Salvatore D'Angelo")
		expect(site.sprint.priceUSD).toBe(10000)
		expect(site.sprint.introPriceUSD).toBe(7500)
		expect(site.bookingUrl).toMatch(/^https?:\/\//)
		expect('audit' in site).toBe(false)
		expect('retainer' in site).toBe(false)
	})

	it('ledger line values sum to the advertised total', () => {
		const sum = grandSlam.ledger.groups
			.flatMap((g) => g.lines)
			.reduce((acc, l) => acc + (l.valueUSD ?? 0), 0)
		expect(sum).toBe(28500)
		expect(LEDGER_TOTAL_USD).toBe(sum)
	})

	it('pay line is derived from sprint pricing (single source of truth)', () => {
		expect(grandSlam.ledger.payLine).toContain('$10,000')
		expect(grandSlam.ledger.payLine).toContain('$7,500')
		expect(grandSlam.ledger.payLine).toContain('4 weekly payments of $2,500')
	})

	it('guarantee is the day-10 promise', () => {
		expect(grandSlam.guarantee.headline).toContain('day 10')
		expect(grandSlam.guarantee.headline).toContain('free')
	})

	it('results over mechanism: no "agent" anywhere in customer-facing offer copy', () => {
		expect(JSON.stringify(grandSlam).toLowerCase()).not.toContain('agent')
	})

	it('honest at zero: no slot counters in the copy', () => {
		expect(JSON.stringify(grandSlam)).not.toMatch(/\bof 3 left\b|\bslots? left\b/i)
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

- [ ] **Step 2: Run to verify failure** — `pnpm test` → FAIL (`grandSlam` not exported; `audit in site` still true).

- [ ] **Step 3: Add types** — in `src/lib/content/types.ts`, delete `audit: Offer` and `retainer: Offer` and the whole `hero` field from `Site`, then append:

```ts
export interface LedgerLine {
	line: string
	sub: string
	valueUSD: number | null // null → valueLabel renders instead of a price
	valueLabel?: 'core' | 'included'
}

export interface LedgerGroup {
	title: string
	note?: string // honest hedge rendered under the group
	lines: readonly LedgerLine[]
}

export interface CostCard {
	title: string
	sub: string
}

export interface GrandSlamOffer {
	chip: string
	headline: string
	lead: string
	offerLine: string
	stats: readonly Stat[]
	wall: {
		eyebrow: string
		thesis: string
		para: string
		turn: string
		costCards: readonly CostCard[]
		taxLine: string
	}
	ledger: {
		eyebrow: string
		heading: string
		para: string
		groups: readonly LedgerGroup[]
		payLine: string
		anchorLine: string
	}
	guarantee: { eyebrow: string; headline: string; body: string }
	proof: {
		eyebrow: string
		heading: string
		para: string
		tiles: readonly Stat[]
		para2: string
		bridge: string
	}
	isThisYou: {
		eyebrow: string
		yesLead: string
		yes: readonly string[]
		noLead: string
		no: readonly string[]
	}
	close: {
		scarcity: string
		heading: string
		emailPlaceholder: string
		buildLabel: string
		buildPlaceholder: string
		button: string
		reward: string
	}
}
```

- [ ] **Step 4: Create `src/lib/content/offer.ts`** (v0 copy verbatim from the vault voice-pass; Sam polishes strings here later):

```ts
import type { GrandSlamOffer } from './types'
import { site } from './site'

// The one offer. Copy source of truth: vault "sixtom grand slam — page copy
// (voice pass)". Rules baked in and pinned by content.test.ts: no "agent" in
// customer copy (results over mechanism), no slot counters (honest at zero).
export const grandSlam: GrandSlamOffer = {
	chip: '1 client a month · waitlist open',
	headline: "the demo works. production doesn't.",
	lead: "AI gets you to a demo because it can hold the whole thing in its head. once your codebase outgrows that window, it starts making things worse instead of better. that's the wall every vibe-coded project hits. it's also the thing i fix.",
	offerLine:
		'the production sprint. two weeks. live in production on day 10 — and you own every line of it.',
	stats: [
		{ value: '2 weeks', label: 'per sprint' },
		{ value: 'all async', label: 'no standups' },
		{ value: 'day 10 or free', label: 'the guarantee' }
	],
	wall: {
		eyebrow: 'the wall',
		thesis: 'vibe coding is how you slowly become the intern of your own codebase.',
		para: "you shipped a demo and it felt like magic. then the edits started breaking things you didn't touch. every new feature costs more than the last. you're not building anymore — you're negotiating with a machine that no longer understands what it built.",
		turn: "the demo is real. the foundation isn't. and every month it stays that way has a price:",
		costCards: [
			{ title: 'the users', sub: 'who hit a bug and never come back' },
			{ title: 'the launch', sub: 'that slips another month, then another' },
			{ title: 'the weekends', sub: 'spent firefighting instead of living' }
		],
		taxLine: 'every month it stays broken has a number.'
	},
	ledger: {
		eyebrow: 'what you get',
		heading: 'a real foundation, in two weeks.',
		para: "i rebuild it the way i'd build it for myself — the architecture, the security, the tests, the judgment calls you can't vibe your way through. everything in the sprint, and what it'd cost you piecemeal:",
		groups: [
			{
				title: 'the foundation',
				lines: [
					{
						line: 'architecture teardown + premortem',
						sub: 'exactly what will break, and why',
						valueUSD: 3000
					},
					{
						line: 'the rebuild',
						sub: 'your product, standing on foundations that hold',
						valueUSD: null,
						valueLabel: 'core'
					},
					{
						line: 'security review on every commit',
						sub: "nothing ships that i haven't read",
						valueUSD: 2000
					},
					{
						line: 'automated test suite',
						sub: 'so it stays fixed after i leave',
						valueUSD: 2500
					},
					{
						line: 'performance to 100s',
						sub: "and i'll tell you when a third-party script makes that impossible",
						valueUSD: 1500
					},
					{
						line: 'accessibility pass',
						sub: 'works for everyone who shows up',
						valueUSD: 1500
					}
				]
			},
			{
				title: 'the growth foundation',
				note: 'straight with you: search and answer-engines pay off over months, not days. the sprint makes you findable, measurable, and ready to test from day one — the compounding comes from what you publish after. the growth map shows you where to push.',
				lines: [
					{
						line: 'analytics + observability',
						sub: "you see what's working from day one",
						valueUSD: 1500
					},
					{
						line: 'CRO-ready pages + A/B scaffold',
						sub: 'every idea after launch is a test, not a rewrite',
						valueUSD: 2500
					},
					{
						line: 'technical SEO foundation',
						sub: 'schema, sitemaps, core web vitals',
						valueUSD: 2000
					},
					{
						line: 'AEO/GEO foundation',
						sub: 'structured for the answer-engines, so AI recommends you too',
						valueUSD: 2000
					},
					{
						line: 'infra cost audit',
						sub: 'kill the subscriptions your stack is quietly renting',
						valueUSD: 1000
					}
				]
			},
			{
				title: 'the brand',
				lines: [
					{
						line: 'conversion copy pass',
						sub: 'every word on the page earning its keep',
						valueUSD: 1500
					},
					{
						line: 'brand kit + 1-of-1 art',
						sub: 'colors, type, and an original piece nobody else has',
						valueUSD: 3000
					}
				]
			},
			{
				title: 'the close',
				lines: [
					{
						line: 'live in production by day 10',
						sub: 'you own 100% of it',
						valueUSD: null,
						valueLabel: 'included'
					},
					{ line: 'day-30 check-in', sub: "what stuck, what didn't", valueUSD: 500 }
				]
			},
			{
				title: 'the bonuses',
				note: 'bonuses land by day 30.',
				lines: [
					{
						line: 'the AI leverage session',
						sub: 'what to lean on, what to skip, how not to wreck what we just built',
						valueUSD: 1000
					},
					{
						line: 'the 90-day growth map',
						sub: 'the highest-impact moves, in order',
						valueUSD: 1500
					},
					{
						line: 'the runbook + Loom library',
						sub: "so you're never dependent on me again",
						valueUSD: 1500
					}
				]
			}
		],
		payLine: `$${site.sprint.priceUSD.toLocaleString('en-US')} fixed. $${(site.sprint.introPriceUSD ?? 0).toLocaleString('en-US')} for the ${site.sprint.introNote ?? 'first clients'}. or ${site.sprint.paymentPlan ?? ''}.`,
		anchorLine:
			'a dev shop quotes $50k and three months. a senior engineer runs $200k a year. this is two weeks, ten grand, and you own all of it.'
	},
	guarantee: {
		eyebrow: 'the guarantee',
		headline: 'live in production by day 10, or the remaining payments are free.',
		body: "and there's a floor under it: day 5, we both look at it. if we can both see it won't ship in scope, we stop there — you keep everything we built and pay only for the time used. the risk is mine to carry, not yours."
	},
	proof: {
		eyebrow: 'proof · something from nothing',
		heading: 'a solo practice with no way to reach its own clients.',
		para: 'a men’s-mental-health therapist had a slow, drifting site and one channel: rented directory listings, with insurance deciding who found him. i rebuilt the whole thing custom and gave him a growth engine he owns. the craft shows in the numbers:',
		tiles: [
			{ value: '100s', label: 'desktop Lighthouse' },
			{ value: '8.3s→2.9s', label: 'mobile load' },
			{ value: '7.5×', label: 'lighter page' },
			{ value: '+185%', label: 'pageviews, last 30d' }
		],
		para2:
			"traffic reversed from a slow decline to steady growth — and it's HIS execution showing up in the data: he's running the strategy, and the results climb as he does. something from nothing.",
		bridge:
			"this one wasn't vibe-coded — just slow and invisible. same hands, same discipline, numbers you can check. the first rescue writeup is on the bench right now."
	},
	isThisYou: {
		eyebrow: 'is this you?',
		yesLead: 'this is for you if:',
		yes: [
			'you vibe-coded something to a working demo',
			'it has real users, or paying ones',
			"it's breaking, or it just won't reach production",
			"you'd rather own the fix than rent a dev shop"
		],
		noLead: 'not yet if:',
		no: [
			"it's still just an idea — nothing built",
			'you want someone to manage a team of engineers',
			'you need it done and gone, no involvement'
		]
	},
	close: {
		scarcity: 'one seat a month · by appointment',
		heading: 'join the waitlist.',
		emailPlaceholder: 'email you actually check',
		buildLabel: 'what did you build?',
		buildPlaceholder: 'a demo of… it works, but…',
		button: 'get on the list →',
		reward:
			"the seat's booked out? good sign. while you wait, you get a free teardown of your app — what's solid, the three things that'll break, and what i'd do first. no pitch attached."
	}
}

export const LEDGER_TOTAL_USD = grandSlam.ledger.groups
	.flatMap((g) => g.lines)
	.reduce((acc, l) => acc + (l.valueUSD ?? 0), 0)
```

- [ ] **Step 5: Update `src/lib/content/site.ts`** — delete the `audit: {...}` and `retainer: {...}` objects, the `hero: {...}` block (with its comment), AND the `stats: [...]` array (dead data — nothing rendered it on the old home; the new hero renders `grandSlam.stats`). Remove `stats` from the `Site` interface too (keep the `Stat` type — `GrandSlamOffer` uses it). Update `process` (the timeline — drop the audit parenthetical, add the guarantee tooth):

```ts
	process: [
		{ label: 'wk 1 · day 0', body: 'a 30-minute call. we figure out the thing.' },
		{
			label: 'days 1–7',
			body: 'heads down. daily Loom + code drop in your channel, so you watch it happen.'
		},
		{
			label: 'day 5 · scope check',
			body: "if it can't ship in scope, we stop here. you keep what we built."
		},
		{ label: 'mid-sprint', body: 'one short sync. course-correct if needed.' },
		{ label: 'day 10', body: 'live in production. you own it. (or the rest is free.)' },
		{ label: 'day 30', body: "check-in. what stuck, what didn't." }
	],
```

(`calEvent` changes happen in Task 7, not here — keep this chunk's blast radius to content shape.) NOTE: after removing `site.audit`/`site.hero`, `jsonld.ts` and `+page.svelte` will fail `pnpm check` — that is expected mid-train; Tasks 2 and 4 fix them. To keep THIS chunk green, do Tasks 1+2+4 on one chunk branch if you want per-chunk green gates — recommended split: **chunk A = Tasks 1+2+4 together** (content + lander + jsonld are one compile unit), chunk B = Task 3, chunk C = Tasks 5+6, chunk D = Task 7, chunk E = Task 8.

- [ ] **Step 6: Update `src/lib/content/index.ts`:**

```ts
export { site, calEvent } from './site'
export { grandSlam, LEDGER_TOTAL_USD } from './offer'
export { FAQ } from './faq'
export type {
	Operator,
	Offer,
	Site,
	CalEvent,
	IntakeQuestion,
	QA,
	LedgerLine,
	LedgerGroup,
	CostCard,
	GrandSlamOffer
} from './types'
```

- [ ] **Step 7: Run tests** — `pnpm test` → content.test.ts PASSES (jsonld/page failures expected until Tasks 2+4 land in the same chunk).
- [ ] **Step 8: Commit** — `git add -A && git commit -m "feat(content): grand-slam offer as typed data, retire audit/retainer"`

---

### Task 2: The lander — Hero + home rewrite

**Files:**

- Modify: `src/lib/components/Hero.svelte`
- Modify: `src/routes/+page.svelte` (full rewrite)
- Modify: `src/app.html` (title/description/og/twitter strings)
- Modify: `src/lib/components/umami-events.test.ts`

**Interfaces:**

- Consumes: `grandSlam`, `LEDGER_TOTAL_USD`, `site` from `$lib/content`.
- Produces: home sections with ids `#waitlist` (close form anchor). New events: `cta_hero_waitlist`, `cta_hero_teardown`, `cta_waitlist_submit`. Retired events: `cta_hero_book`, `cta_final_book`, `cta_case_study`, `cta_garden_link_why` (removed from pins — none are externally consumed).

- [ ] **Step 1: Update the pin test first** — in `umami-events.test.ts` `CLIENT_EVENTS`, remove the four retired rows, add:

```ts
	{ event: 'cta_hero_waitlist', dir: 'component', path: 'Hero.svelte' },
	{ event: 'cta_hero_teardown', dir: 'component', path: 'Hero.svelte' },
	{ event: 'cta_waitlist_submit', dir: 'route', path: '+page.svelte' },
```

Run `pnpm test` → those three FAIL (not present yet).

- [ ] **Step 2: Rewrite `Hero.svelte` content block** — keep the canvas/scrim wrapper (lines 6–21) byte-identical; replace the inner content `<div>` with:

```svelte
<script lang="ts">
	import { grandSlam } from '$lib/content'
</script>
```

```svelte
<div class="relative mx-auto w-full max-w-6xl px-6 text-left md:text-center">
	<p class="eyebrow text-fg-subtle text-xs md:text-sm">{grandSlam.chip}</p>
	<h1
		class="text-fg mt-6 text-[clamp(2.25rem,9.5vw,4.75rem)] leading-[1.08] font-bold tracking-tight"
	>
		{grandSlam.headline}
	</h1>
	<p class="text-fg-muted mx-auto mt-6 max-w-3xl text-base leading-relaxed md:text-lg">
		{grandSlam.lead}
	</p>
	<p class="text-fg mx-auto mt-6 max-w-3xl text-xl leading-snug font-medium md:text-2xl">
		{grandSlam.offerLine}
	</p>
	<div class="mt-10 flex flex-col items-start gap-4 md:items-center">
		<a
			href="#waitlist"
			data-umami-event="cta_hero_waitlist"
			class="btn-accent w-full px-8 py-4 text-center text-xl font-bold md:w-auto md:px-12 md:py-5 md:text-2xl"
		>
			join the waitlist →
		</a>
		<a
			href="#waitlist"
			data-umami-event="cta_hero_teardown"
			class="text-fg-subtle hover:text-coin text-xs tracking-widest uppercase transition-colors"
		>
			or get a free teardown
		</a>
	</div>
	<dl class="mt-12 flex flex-wrap gap-x-10 gap-y-4 md:justify-center">
		{#each grandSlam.stats as stat (stat.label)}
			<div>
				<dt class="text-fg-subtle order-2 text-xs tracking-widest uppercase">{stat.label}</dt>
				<dd class="text-fg text-lg font-bold tabular-nums md:text-xl">{stat.value}</dd>
			</div>
		{/each}
	</dl>
</div>
```

(XMark/BookCta imports drop from Hero; BookCta itself stays — /faq and garden-party still use it.)

- [ ] **Step 3: Rewrite `src/routes/+page.svelte`** — full replacement. Scroll-snap head style is REMOVED (long-form page scrolls freely):

```svelte
<script lang="ts">
	import Hero from '$lib/components/Hero.svelte'
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import { site, grandSlam, LEDGER_TOTAL_USD } from '$lib/content'

	const o = grandSlam
	const eyebrowClass = 'eyebrow text-sm'
	const h2Class = 'text-fg mt-2 text-3xl leading-tight font-bold tracking-tight md:text-5xl'
	const bodyClass = 'text-fg-muted mt-6 max-w-2xl text-base leading-relaxed md:text-lg'
	const usd = (n: number) => `$${n.toLocaleString('en-US')}`
</script>

<Hero />

<!-- the wall -->
<section class="surface-uv py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class={eyebrowClass}>{o.wall.eyebrow}</p>
		<h2 class={h2Class}>{o.wall.thesis}</h2>
		<p class={bodyClass}>{o.wall.para}</p>
		<p class="text-fg mt-8 max-w-2xl text-base leading-relaxed font-semibold md:text-lg">
			{o.wall.turn}
		</p>
		<ul class="mt-8 grid gap-4 md:grid-cols-3">
			{#each o.wall.costCards as card (card.title)}
				<li class="border-border rounded-lg border p-6">
					<p class="text-fg font-semibold">{card.title}</p>
					<p class="text-fg-muted mt-2 text-sm leading-relaxed">{card.sub}</p>
				</li>
			{/each}
		</ul>
		<p class="text-fg-muted mt-8 text-base leading-relaxed md:text-lg">
			{o.wall.taxLine}
			<a href="/tax" data-umami-event="cta_tax_calc" class="link-coin">run yours →</a>
		</p>
	</div>
</section>

<!-- the ledger -->
<section class="bg-surface py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class={eyebrowClass}>{o.ledger.eyebrow}</p>
		<h2 class={h2Class}>{o.ledger.heading}</h2>
		<p class={bodyClass}>{o.ledger.para}</p>

		{#each o.ledger.groups as group (group.title)}
			<div class="mt-12">
				<p class="eyebrow text-fg-subtle text-xs">{group.title}</p>
				<ul class="border-border divide-border mt-4 divide-y border-y">
					{#each group.lines as item (item.line)}
						<li class="flex items-baseline justify-between gap-6 py-4">
							<div>
								<p class="text-fg text-base font-semibold">{item.line}</p>
								<p class="text-fg-muted mt-1 text-sm leading-relaxed">{item.sub}</p>
							</div>
							<p class="text-fg-subtle shrink-0 text-sm font-semibold tabular-nums">
								{item.valueUSD === null ? item.valueLabel : usd(item.valueUSD)}
							</p>
						</li>
					{/each}
				</ul>
				{#if group.note}
					<p class="text-fg-subtle mt-4 max-w-2xl text-sm leading-relaxed">{group.note}</p>
				{/if}
			</div>
		{/each}

		<div class="border-border mt-12 border-t pt-8">
			<div class="flex items-baseline justify-between gap-6">
				<p class="text-fg text-lg font-bold">total value</p>
				<p class="text-fg text-lg font-bold tabular-nums">{usd(LEDGER_TOTAL_USD)}+</p>
			</div>
			<div class="mt-3 flex items-baseline justify-between gap-6">
				<p class="text-fg-muted text-base">you pay</p>
				<p class="text-fg text-right text-base font-semibold">{o.ledger.payLine}</p>
			</div>
			<p class="text-fg-subtle mt-8 max-w-2xl text-sm leading-relaxed">{o.ledger.anchorLine}</p>
		</div>
	</div>
</section>

<!-- the guarantee -->
<section class="surface-uv py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class={eyebrowClass}>{o.guarantee.eyebrow}</p>
		<h2 class={h2Class}>{o.guarantee.headline}</h2>
		<p class={bodyClass}>{o.guarantee.body}</p>
	</div>
</section>

<!-- proof -->
<section class="bg-surface py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class={eyebrowClass}>{o.proof.eyebrow}</p>
		<h2 class={h2Class}>{o.proof.heading}</h2>
		<p class={bodyClass}>{o.proof.para}</p>
		<dl class="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
			{#each o.proof.tiles as tile (tile.label)}
				<div>
					<dd class="text-fg text-2xl font-bold tabular-nums md:text-3xl">{tile.value}</dd>
					<dt class="text-fg-subtle mt-1 text-xs tracking-widest uppercase">{tile.label}</dt>
				</div>
			{/each}
		</dl>
		<p class={bodyClass}>{o.proof.para2}</p>
		<p class="text-fg-subtle mt-6 max-w-2xl text-sm leading-relaxed">{o.proof.bridge}</p>
		<blockquote class="text-fg-muted mt-10 max-w-2xl text-base leading-relaxed italic md:text-lg">
			“{site.testimonial.quote}”
			<footer class="text-fg-subtle mt-2 text-sm not-italic">
				— {site.testimonial.attribution}
			</footer>
		</blockquote>
	</div>
</section>

<!-- is this you -->
<section class="surface-uv py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class={eyebrowClass}>{o.isThisYou.eyebrow}</p>
		<div class="mt-6 grid gap-10 md:grid-cols-2">
			<div>
				<p class="text-fg text-lg font-semibold">{o.isThisYou.yesLead}</p>
				<ul class="text-fg-muted mt-4 space-y-3 text-base leading-relaxed">
					{#each o.isThisYou.yes as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
			<div>
				<p class="text-fg text-lg font-semibold">{o.isThisYou.noLead}</p>
				<ul class="text-fg-muted mt-4 space-y-3 text-base leading-relaxed">
					{#each o.isThisYou.no as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- the two weeks -->
<section class="bg-surface py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class={eyebrowClass}>the two weeks</p>
		<ol class="border-border divide-border mt-8 divide-y border-y">
			{#each site.process as step (step.label)}
				<li class="grid gap-1 py-5 md:grid-cols-[12rem_1fr] md:gap-6">
					<p class="text-fg-subtle text-xs tracking-widest uppercase">{step.label}</p>
					<p class="text-fg-muted text-base leading-relaxed">{step.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- close / waitlist -->
<section id="waitlist" class="surface-uv flex min-h-svh flex-col justify-between pt-20 md:pt-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class={eyebrowClass}>{o.close.scarcity}</p>
		<h2 class={h2Class}>{o.close.heading}</h2>

		<!-- csr=false: plain cross-route POST to the /notify action. No JS anywhere
		     on this page — the visitor lands on /notify with the server-rendered
		     result. Honeypot + rate limit + validation still apply server-side. -->
		<form method="post" action="/notify?/notify" class="mt-10 max-w-xl space-y-4">
			<label class="sr-only" for="waitlist-email">email address</label>
			<input
				id="waitlist-email"
				name="email"
				type="email"
				required
				autocomplete="email"
				placeholder={o.close.emailPlaceholder}
				class="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent w-full rounded-md border px-4 py-3 text-lg focus:ring-2 focus:outline-none"
			/>
			<label class="text-fg-muted block text-sm" for="waitlist-build">
				{o.close.buildLabel}
				<textarea
					id="waitlist-build"
					name="message"
					required
					rows="3"
					maxlength="4000"
					placeholder={o.close.buildPlaceholder}
					class="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent mt-2 w-full rounded-md border px-4 py-3 text-base focus:ring-2 focus:outline-none"
				></textarea>
			</label>
			<input type="hidden" name="name" value="Waitlist signup" />
			<input
				type="text"
				name="company"
				tabindex="-1"
				autocomplete="off"
				aria-hidden="true"
				class="absolute top-auto left-[-9999px] h-px w-px overflow-hidden"
			/>
			<button
				type="submit"
				data-umami-event="cta_waitlist_submit"
				class="btn-accent w-full px-8 py-4 text-center text-xl font-bold md:w-auto md:px-12"
			>
				{o.close.button}
			</button>
		</form>

		<p class="text-fg-muted mt-8 max-w-xl text-base leading-relaxed">{o.close.reward}</p>
	</div>
	<div class="mt-16">
		<SiteFooter />
	</div>
</section>
```

- [ ] **Step 4: Update `src/app.html` strings** (4 spots; the offer line is the description everywhere):
  - `<title>SIXTOM — the demo works. production doesn't.</title>`
  - `meta name="description"` → `"the production sprint: live in production on day 10 — and you own every line of it. $10,000 flat, 1 client a month."`
  - `og:title` + `twitter:title` → same as title; `og:description` + `twitter:description` → `"live in production on day 10 — and you own every line of it. $10,000 flat, 1 client a month."`
  - `og:image:alt` + `twitter:image:alt` → `"SIXTOM — the demo works. production doesn't."` (og.png regeneration is Task 8's flag — alt must not promise what the image doesn't show yet, this string is safe either way.)

- [ ] **Step 5: Gates** — `pnpm format && pnpm lint && pnpm check && pnpm test` → umami pins PASS, content PASS (jsonld still red until Task 4 in this same chunk).
- [ ] **Step 6: Commit** — `git commit -am "feat(lander): grand-slam home — wall, ledger, guarantee, proof, waitlist"`

---

### Task 3: Waitlist wiring — /notify becomes the waitlist + listmonk test-email guard

**Files:**

- Modify: `src/routes/notify/+page.svelte`
- Modify: `src/routes/notify/+page.server.ts`
- Modify: `src/lib/types/index.ts`
- Modify: `e2e/notify-form.spec.ts`

**Interfaces:**

- Consumes: `grandSlam.close` copy; existing `processSubmission`, `subscribeToList`, `fireServerEvent`.
- Produces: `/notify?/notify` action unchanged in name/shape (home form depends on it). Event names `cta_notify_submit` + `notify_signup_success` preserved.

- [ ] **Step 1: Failing test first — the listmonk guard.** The e2e test email must never reach the list. In `e2e/notify-form.spec.ts`, replace the stale spec (it targets a home form from a pre-redesign era, POSTs to `/?/notify` which no longer exists) with:

```ts
import { test, expect } from '@playwright/test'
import { TEST_EMAIL } from './constants'

test.describe('waitlist form', () => {
	test('home form (no JS by design): native POST lands on /notify with success', async ({
		browser
	}) => {
		const context = await browser.newContext({ javaScriptEnabled: false })
		const page = await context.newPage()
		await page.goto('/', { waitUntil: 'domcontentloaded' })
		await page.fill('#waitlist-email', TEST_EMAIL)
		await page.fill('#waitlist-build', 'a demo of a thing. it works, but…')
		await Promise.all([
			page.waitForURL(/\/notify/),
			page.locator('#waitlist button[type="submit"]').click()
		])
		await expect(page.locator('[aria-live="polite"] p')).toHaveText(/you're on the list/i)
		await context.close()
	})

	test('/notify JS-enhanced path: inline result without navigation', async ({ page }) => {
		await page.goto('/notify')
		const url = page.url()
		await page.fill('input[name="email"]', TEST_EMAIL)
		await page.fill('textarea[name="message"]', 'a demo of a thing. it works, but…')
		const [response] = await Promise.all([
			page.waitForResponse(
				(r) => r.url().includes('/notify?/notify') && r.request().method() === 'POST'
			),
			page.click('button[type="submit"]')
		])
		expect(response.status()).toBe(200)
		expect(page.url()).toBe(url)
		await expect(page.locator('[aria-live="polite"] p')).toHaveText(/you're on the list/i)
	})

	test('honeypot: filled `company` returns silent success', async ({ page }) => {
		await page.goto('/notify')
		await page.fill('input[name="email"]', 'real-looking@example.com')
		await page.fill('textarea[name="message"]', 'looks legit')
		await page.locator('input[name="company"]').evaluate((el: HTMLInputElement) => {
			el.value = 'AcmeCorp'
		})
		await page.click('button[type="submit"]')
		await expect(page.locator('[aria-live="polite"] p')).toHaveText(/you're on the list/i)
	})
})
```

- [ ] **Step 2: The guard itself** — in `src/routes/notify/+page.server.ts`, the test-email bypass in `processSubmission` returns success WITHOUT `suspicious`, so today the action would subscribe the e2e address to the real `sixtom` list. Fix by skipping listmonk for the configured test email (env var NAME only):

```ts
import { env } from '$env/dynamic/private'
```

and change the subscribe condition to:

```ts
const emailField = formData.get('email')
const email = (typeof emailField === 'string' ? emailField : '').trim()
// The e2e bypass address must never pollute the real list.
const testEmail = (env['CONTACT_FORM_TEST_EMAIL'] ?? '').trim()
const isTestEmail = testEmail !== '' && email === testEmail
if (!result.suspicious && email && !isTestEmail) {
	await subscribeToList(email, SIXTOM_LIST_UUID)
}
```

- [ ] **Step 3: /notify page rewrite** — same file structure as current (`enhance`, honeypot, hidden `formStartedAt`/`enhanced`), with: `<title>waitlist | SIXTOM</title>`; **remove** `<meta name="robots" content="noindex, follow" />` (this page is now a primary CTA target); heading block from `grandSlam.close` (`heading`, scarcity as the eyebrow, `reward` para below the form); the hidden fixed `message` input becomes the required build `textarea` (same `name="message"`, label `what did you build?`, placeholder from content); hidden `name` value stays `"Waitlist signup"`. Keep `cta_notify_submit` on the submit button. Description meta: `"one client a month. join the waitlist — and get a free teardown of your app while you wait."`

- [ ] **Step 4: Types + footer label** —
  - `src/lib/types/index.ts`: the `UmamiEvent` union becomes exactly `'cta_notify_submit' | 'cta_garden_link' | 'notify_signup_success'` (drops dead `cta_hero_book`, `cta_audit_book`, `cta_sprint_book`; client `data-umami-event` attrs are untyped strings — this union types `fireServerEvent`).
  - `src/lib/components/SiteFooter.svelte`: the nav link **text** "notify" → "waitlist" (href `/notify` and the `footer_notify` event name are FROZEN — label only).

- [ ] **Step 5: Run** — `pnpm test` (unit) green; `pnpm test:e2e` green (webServer env provides the test-email bypass; guard keeps listmonk untouched).
- [ ] **Step 6: Commit** — `git commit -am "feat(waitlist): notify page becomes the waitlist, guard e2e email from listmonk"`

---

### Task 4: JSON-LD — the schema tells the same story

**Files:**

- Modify: `src/lib/seo/jsonld.ts`
- Modify: `src/lib/seo/jsonld.test.ts`

**Interfaces:**

- Consumes: `grandSlam.offerLine`, `grandSlam.close.reward` phrasing, `site.sprint`.
- Produces: `serviceJsonLd()` with exactly 2 offers: the sprint and the free teardown.

- [ ] **Step 1: Failing test** — replace the `serviceJsonLd` block in `jsonld.test.ts`:

```ts
it('serviceJsonLd sells exactly the two live offers: sprint + free teardown', () => {
	const ld = serviceJsonLd()
	expect(ld['@context']).toBe('https://schema.org')
	expect(ld['@type']).toBe('Service')
	expect(ld.provider['@id']).toBe(PERSON_ID)
	expect(ld.areaServed).toBe('Worldwide')
	expect(ld.description).toContain('day 10')
	expect(ld.offers).toHaveLength(2)
	expect(ld.offers[0]?.name).toBe(site.sprint.name)
	expect(ld.offers[0]?.price).toBe(String(site.sprint.priceUSD))
	expect(ld.offers[0]?.availability).toBe('https://schema.org/LimitedAvailability')
	expect(ld.offers[0]?.description).toContain('day 10')
	expect(ld.offers[1]?.name).toBe('free teardown')
	expect(ld.offers[1]?.price).toBe('0')
	expect(ld.offers[1]?.availability).toBe('https://schema.org/InStock')
	expect(ld.offers[1]?.url).toBe(`${site.siteUrl}/notify`)
})
```

Run: `pnpm test` → FAIL (3 offers, audit first).

- [ ] **Step 2: Implement** — in `jsonld.ts`, add `import { grandSlam } from '$lib/content'`; in `serviceJsonLd()` delete `auditDescription`/`retainerDescription` and the audit/retainer offer objects; set `description: grandSlam.offerLine`; offers become:

```ts
offers: [
	{
		'@type': 'Offer',
		name: site.sprint.name,
		description: sprintDescription,
		price: String(site.sprint.priceUSD),
		priceCurrency: 'USD',
		availability: 'https://schema.org/LimitedAvailability',
		url: bookUrl
	},
	{
		'@type': 'Offer',
		name: 'free teardown',
		description:
			"a free teardown of your app — what's solid, the three things that'll break, and what i'd do first. join the waitlist to get one.",
		price: '0',
		priceCurrency: 'USD',
		availability: 'https://schema.org/InStock',
		url: `${site.siteUrl}/notify`
	}
]
```

and extend `sprintDescription`'s first element to carry the guarantee: `'two weeks from working demo to production-grade. live in production by day 10 — or the remaining payments are free.'`

- [ ] **Step 3:** `pnpm test` → PASS. (This closes chunk A: Tasks 1+2+4 → `pnpm format && pnpm lint && pnpm check && pnpm test && pnpm build` ALL green → `/rev` chunk A.)
- [ ] **Step 4: Commit** — `git commit -am "feat(seo): serviceJsonLd sells the grand slam — sprint + free teardown"`

---

### Task 5: /faq — re-answered for the one offer

**Files:**

- Modify: `src/lib/content/faq.ts` (full replacement of the FAQ array)
- Modify: `src/routes/faq/+page.svelte` (meta description + og only)

- [ ] **Step 1: Replace `FAQ` in `faq.ts`:**

```ts
export const FAQ: readonly QA[] = [
	{
		question: 'what does sixtom do?',
		answer:
			'you (or your AI) got something to a working demo. i take it from there to production-grade — secure, tested, measured, ready for real users — in a two-week sprint. live on day 10, and you own every line of it.'
	},
	{
		question: 'how much does it cost?',
		answer:
			'$10,000 flat, or 4 weekly payments of $2,500. the first 3 clients get it at $7,500. that price buys the whole ledger on the home page — over $28,500 of itemized work.'
	},
	{
		question: "what's the guarantee?",
		answer:
			"live in production by day 10, or the remaining payments are free. there's a floor under it too: at the day-5 scope check, if we can both see it won't ship in scope, we stop — you keep everything built and pay only for the time used."
	},
	{
		question: "what's the free teardown?",
		answer:
			"join the waitlist and i'll record a short teardown of your app — what's solid, the three things that'll break, and what i'd do first. no charge, no call, no pitch."
	},
	{
		question: 'how long does it take?',
		answer: 'two weeks. live in production on day 10. one seat a month, by appointment.'
	},
	{
		question: 'do you do SEO and getting found by AI?',
		answer:
			'the sprint lays the foundation: technical SEO, schema, and answer-engine structure, plus analytics so you can see it working. straight with you — search compounds on what you publish over months, so the sprint makes you findable and measurable from day one, and the 90-day growth map shows you where to push after.'
	},
	{
		question: 'how many clients do you take?',
		answer:
			"one a month, by appointment. that's the whole model — you get my full attention, not a queue. when the seat's taken, the waitlist is open."
	},
	{
		question: 'what happens after the sprint?',
		answer:
			"you own everything either way — the code, the analytics, the runbook. there's a day-30 check-in to see what stuck. if you want me to stay on it after that, we talk then."
	},
	{
		question: "who's behind sixtom?",
		answer:
			"Salvatore (Sam) D'Angelo — lead engineer at Made In Cookware (multi-million visitors a month), formerly at Rhone. sixtom is the solo practice."
	},
	{
		question: 'is it really all async?',
		answer:
			'yes. a daily Loom + code drop in your channel, with one short mid-sprint sync to course-correct. no standups.'
	},
	{
		question: 'what is the "vibe-code tax"?',
		answer:
			"what your half-finished, AI-built prototype quietly costs you per year — lost deals, downtime, weekends. there's a no-email calculator at /tax."
	}
]
```

- [ ] **Step 2:** In `faq/+page.svelte`, update both meta descriptions to: `"what sixtom costs, how the two-week sprint and the day-10 guarantee work, and how to get the free teardown."` (visible page + FAQPage JSON-LD update automatically from the array).
- [ ] **Step 3:** `pnpm test && pnpm check` green. Commit — `git commit -am "feat(faq): re-answered for the grand slam"`

---

### Task 6: /terms — the contract matches the promise

**Files:**

- Modify: `src/routes/terms/+page.svelte`

The current refunds section says the sprint scope-stop refunds 50% — the new offer says "pay only for the time used," and the day-10 guarantee + stall clause don't exist here yet. This page is the legal backstop for the guarantee; it ships in the same train or the offer is contradicted at the contract layer.

- [ ] **Step 1:** Replace the refunds `<section>` with two sections (keep classes identical to siblings):

```svelte
<section>
	<h2 class="text-fg text-xl font-semibold tracking-tight">the guarantee</h2>
	<p class="mt-3">
		the sprint — live in production by day 10, or the remaining payments are waived. "live" means
		the deploy target we name in writing on the day-0 call. the guarantee clock pauses while
		something i need sits with you — access, approvals, content, feedback — and resumes when i have
		it.
	</p>
	<p class="mt-3">
		the day-5 scope check — if we both see it won't ship in scope, we stop there. you keep
		everything built and pay only for the time used.
	</p>
</section>

<section>
	<h2 class="text-fg text-xl font-semibold tracking-tight">the free teardown</h2>
	<p class="mt-3">
		the teardown is free, carries no obligation on either side, and i may decline to record one if
		your project isn't a fit.
	</p>
</section>
```

- [ ] **Step 2:** Update the header paragraph (drop "pricing, scope, and cadence live on the home page" phrasing only if it's now false — it isn't; keep) and the meta description: `"how engagement with sixtom works. plain-English terms for the sprint, the day-10 guarantee, and the free teardown."` Bump the "last updated" line to `july 2026`. Code-ownership and if-something-breaks sections stay verbatim.
- [ ] **Step 3:** `pnpm check && pnpm build` green. Commit — `git commit -am "feat(terms): day-10 guarantee, stall clause, teardown terms"` (chunk C = Tasks 5+6 → gates + `/rev`.)

---

### Task 7: cal.com intake + /book sweep

**Files:**

- Modify: `src/lib/content/site.ts` (`calEvent` only)
- Modify: `src/routes/book/+page.svelte` (meta description only)
- Modify: `src/routes/book/options.ts` (budget labels/values)

- [ ] **Step 1:** `calEvent` becomes:

```ts
export const calEvent: CalEvent = {
	title: 'solve for X — intro call',
	slug: 'discovery',
	durationMinutes: 30,
	description:
		"30 minutes. tell me what you've built and where it's breaking — we figure out the X between you and shipping, and whether the sprint is the move. no pitch.",
	intakeQuestions: [
		{
			label: "what's the thing you've been close on but haven't shipped?",
			type: 'longText',
			required: true
		},
		{
			label: 'send a link to the repo or a screenshot of where it is',
			type: 'text',
			required: false
		},
		{
			label: 'where are you in the process?',
			type: 'select',
			options: ['on the waitlist', 'got my free teardown — ready to talk', 'just found sixtom'],
			required: true
		}
	]
}
```

- [ ] **Step 2:** `book/+page.svelte` meta description → `"see if the sprint is a fit. 3 quick steps, then the booking link."`
- [ ] **Step 3:** `BUDGET_OPTIONS` in `book/options.ts` re-banded around the one price (values are form-data-only; the three pinned `book_*` events are untouched):

```ts
export const BUDGET_OPTIONS = [
	{ value: 'under-7500', label: 'under $7,500' },
	{ value: '7500-10k', label: '$7,500–$10,000' },
	{ value: '10k-25k', label: '$10,000–$25,000' },
	{ value: '25k+', label: '$25,000+' },
	{ value: 'not-sure', label: 'not sure yet' }
] as const
```

- [ ] **Step 4:** `pnpm test && pnpm check && pnpm build` green. Commit — `git commit -am "feat(book): intake + budget bands for the one offer"`
- [ ] **Step 5 (gated on Sam, outward-facing):** run `pnpm cal:sync` (needs `CAL_API_KEY` + `CAL_USERNAME` in `.env`) to push the new intake to cal.com. Do this only at merge time so the live booking form never leads the live site.

---

### Task 8: Exemplary pass — the site is the receipts

**Files:**

- Create: `.agent-toolkit/lighthouse.toml`
- Create: `.agent-toolkit/journeys.md`
- Modify: `AGENTS.md` (offer sections)
- Verify: `static/og.png` (flag only), `e2e/visual-theme.spec.ts`

- [ ] **Step 1: Coherence grep gate** — all must return ONLY allowed hits (offer.ts "infra cost audit" line; git history):

```bash
grep -rn "the audit\|\$1,500\|retainer\|1 client a month.*audit" src/ e2e/ --include="*.svelte" --include="*.ts"
grep -rn "agents build\|agent" src/lib/content/ src/routes/+page.svelte src/lib/components/Hero.svelte
```

Expected: first grep → no offer-surface hits; second → nothing (the content pin test enforces it too).

- [ ] **Step 2:** `.agent-toolkit/lighthouse.toml` — the "performance to 100s" ledger line, pinned as a gate on the site itself:

```toml
[budget]
performance_floor = 0.95
accessibility_floor = 1.0
best_practices_floor = 0.95
seo_floor = 1.0

[run]
url = "/"
samples = 3
```

- [ ] **Step 3:** Create `.agent-toolkit/journeys.md` with exactly:

```markdown
# journeys

App: `pnpm dev` (SvelteKit, http://localhost:5173). Set CONTACT_FORM_TEST_EMAIL=e2e@test.sixtom.local in the dev env before driving journey 1 — the waitlist form must never hit listmonk or SMTP with a real address.

## 1. land → read the offer → join the waitlist

1. Open `/`. Expect: h1 "the demo works. production doesn't.", chip "1 client a month · waitlist open", stat "day 10 or free".
2. Scroll through wall → ledger → guarantee → proof. Expect: ledger shows "total value" of "$28,500+" and a pay line containing "$10,000"; guarantee headline contains "day 10"; proof tiles include "+185%".
3. Fill `#waitlist-email` with e2e@test.sixtom.local and `#waitlist-build` with any text; submit.
4. Expect: navigation to `/notify` showing "You're on the list." No console errors, no failed network requests anywhere in the journey.

## 2. the tax loop

1. Open `/`, click the "run yours →" link in the wall section.
2. On `/tax`: expect h1 "what's it costing you?" and a non-$0 annual tax figure with default inputs.
3. Click the calculator CTA (event `cta_calc_book`). Expect `/book` step 1 ("where are you with this thing?") renders. No console errors.

## 3. faq → book

1. Open `/faq`. Expect: ≥10 questions rendered, one containing "day 10" (the guarantee answer), zero mentions of "$1,500" or "retainer".
2. Click the BookCta. Expect `/book` step 1 renders. No console errors.
```

- [ ] **Step 4:** `AGENTS.md` — update the offer/pricing paragraphs: one $10,000 sprint ($7,500 first 3, 4×$2,500), day-10-or-free guarantee with day-5 floor, free teardown via waitlist (/notify), no public audit/retainer (retainer = private post-sprint continuation, off-page by design), ledger/content lives in `src/lib/content/offer.ts`, "results over mechanism" copy rule (no "agent" in customer copy — pinned by content.test.ts).
- [ ] **Step 5:** Verify `static/og.png` still shows copy consistent with the new offer; if it carries the old tagline, flag to Sam for a regen from `scripts/og-source` (art asset — his call, not blocking).
- [ ] **Step 6: Full gates on the integration branch** — `pnpm format && pnpm lint && pnpm check && pnpm test && pnpm test:e2e && pnpm build` (if `e2e/visual-theme.spec.ts` asserts old-home selectors/copy, update those assertions to the new sections as part of this step), then `/rev` the final chunk, then `/drive` the three journeys, then `/lighthouse` against the branch build, then `/a11y` (new UI shipped).
- [ ] **Step 7: The ask** — present the branch to Sam: merge `feature/grand-slam` → `main` (squash), run `pnpm cal:sync`, verify prod end-to-end (documented silent-deploy risk: curl `/`, `/faq`, `/terms`, `/notify` for new copy), comment-close #133 (the $7,500 intro price now lives on the home page ledger). **None of these run without his explicit go.**

---

## Deviations from the voice-pass doc (deliberate, flagged)

1. **No `~~$28,500~~` strikethrough** on the pay row — premortem #4 (internet-marketer register). The adjacent total/pay rows carry the contrast. Sam can re-add with one string if he disagrees.
2. **Scroll-snap removed on home** — a 7-section long-form sales page fights `scroll-snap-type: y mandatory`; the snap deck belonged to the old full-screen home.
3. **Hero buttons both anchor to `#waitlist`** — the teardown IS the waitlist reward; one form, two doorways, zero split funnels.

## Task list note

Chunks for /rev: **A** = Tasks 1+2+4 (one compile unit) · **B** = Task 3 · **C** = Tasks 5+6 · **D** = Task 7 · **E** = Task 8. Each chunk: gates green → `/rev` to 2-consecutive-zero (cap 3) → next.

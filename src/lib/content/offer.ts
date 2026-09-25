import type { GrandSlamOffer } from './types'
import { site } from './site'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`

// The one offer: team AI enablement (repositioned 2026-09-23 from the
// vibe-code rescue sprint; see vault "growth strategy 2026-09" + "price floor").
// Rules baked in and pinned by content.test.ts: no "agent" in customer copy
// (results over mechanism; AI is only ever the client's context), no slot
// counters (honest at zero). Proof stays anonymized: the day job is never
// named as a case study until there's a written OK to cite it.
export const grandSlam: GrandSlamOffer = {
	chip: '1 team a month · waitlist open',
	headline: 'you told them to use AI. nothing changed.',
	lead: "the memo went out. a few people tried it. a few more pretended to. the work looks the same. this year i've been turning ops, finance and marketing people into people who ship real systems. that's what i do for your team.",
	offerLine:
		'the enablement engagement. two weeks, one team. by day 10 a named person on your team ships a real internal system, and the guardrails hold once they get good.',
	stats: [
		{ value: '2 weeks', label: 'one team' },
		{ value: '1 owner', label: 'ships by day 10' },
		{ value: 'day 10 or free', label: 'the guarantee' }
	],
	wall: {
		thesis: "setup was easy. what comes after isn't.",
		para: "the tools got installed. the licenses got paid for. then half of marketing's week went to arguing which of three numbers is right. the glue between your apps broke and nobody noticed for a month. the one person who got good opened a 45,000-line pull request and nobody knew how to review it. the dashboard says live. nobody believes it.",
		turn: "and it starts at the top. if leadership won't use it, the team won't either. every month it stays that way has a price:",
		costCards: [
			{ title: 'the licenses', sub: 'paid for every month, opened twice' },
			{ title: 'the glue', sub: 'automations that fail quietly until a customer finds out' },
			{ title: 'the one who got good', sub: 'shipping fast with no guardrails, until prod breaks' }
		],
		costLine: 'that part is fixable in two weeks.'
	},
	ledger: {
		eyebrow: 'what you get',
		heading: 'one person shipping. guardrails that hold.',
		para: "i sit with your team for two weeks and we build something real, on your data, in your repo. everything in the engagement, and what it'd cost you piecemeal:",
		groups: [
			{
				title: 'the diagnosis',
				lines: [
					{
						line: 'adoption teardown',
						sub: "who's using it, where it's stuck, what's quietly broken",
						valueUSD: 1500
					},
					{
						line: 'one metric, one definition',
						sub: 'the number everyone argues about gets a single source of truth',
						valueUSD: 3000
					}
				]
			},
			{
				title: 'the build',
				lines: [
					{
						line: 'the system',
						sub: 'a named person on your team ships a real internal tool, on your data',
						valueUSD: null,
						valueLabel: 'core'
					},
					{
						line: 'glue → code',
						sub: 'one fragile automation chain rebuilt as code you can read, with alerts and a last-run time',
						valueUSD: 4000
					},
					{
						line: 'honest status',
						sub: 'every "live" badge shows when it last synced',
						valueUSD: 1000
					}
				]
			},
			{
				title: 'the guardrails',
				lines: [
					{
						line: 'permissions + review gate',
						sub: 'nothing reaches production without passing review',
						valueUSD: 3000
					},
					{
						line: 'repo rules',
						sub: "one branch per tool, hooks, shared instructions. a 45,000-line PR can't happen",
						valueUSD: 2500
					},
					{
						line: 'customer data off desktops',
						sub: 'it lives somewhere with access control, not on a laptop',
						valueUSD: 2000
					}
				]
			},
			{
				title: 'the people',
				lines: [
					{
						line: 'hands-on onboarding',
						sub: 'everyone on the team set up and shipping. by the tenth person it takes one sitting',
						valueUSD: 4000
					},
					{
						line: 'the tracing-paper session',
						sub: 'git and review, explained so it sticks for people who never wanted to learn git',
						valueUSD: 1500
					},
					{
						line: 'the leadership session',
						sub: 'the people at the top use it first, so the team follows',
						valueUSD: 2000
					}
				]
			},
			{
				title: 'the close',
				note: 'bonuses land by day 30.',
				lines: [
					{
						line: 'shipped by day 10',
						sub: 'you own 100% of it',
						valueUSD: null,
						valueLabel: 'included'
					},
					{ line: 'day-30 check-in', sub: "what stuck, what didn't", valueUSD: 500 },
					{
						line: 'the runbook + Loom library',
						sub: 'so the next hire onboards without me',
						valueUSD: 1500
					},
					{
						line: 'the 90-day map',
						sub: 'the next three systems worth building, in order',
						valueUSD: 1500
					}
				]
			}
		],
		// Built from parts so the optional payment plan drops cleanly when unset.
		payParts: [
			{ text: `${usd(site.engagement.priceUSD)} fixed.` },
			...(site.engagement.paymentPlan ? [{ text: `${site.engagement.paymentPlan}.` }] : [])
		],
		anchorLine:
			'a consultancy quotes six figures and delivers a deck. a workshop is half a day and a recording nobody watches. this is two weeks, and something running when i leave.'
	},
	guarantee: {
		// \n = author-controlled line break: clause per line on desktop.
		headline: 'your person ships by day 10,\nor the rest is free.',
		body: "and there's a floor under it: day 5, we both look at it. if we can both see it won't ship in scope, we stop there. you keep everything we built and pay only for the time used. the risk is mine to carry, not yours."
	},
	proof: {
		eyebrow: 'proof · inside a consumer brand',
		heading: 'finance, ops and marketing, shipping their own tools.',
		para: "since july i've run 22 onboarding sessions across ops, finance, marketing, wholesale and creative. into a shared repo, behind a review gate. none of them were hired to write code. the numbers:",
		tiles: [
			{ value: '22', label: 'onboarding sessions' },
			{ value: '5', label: 'departments' },
			{ value: '~10', label: 'sessions to one-sitting setup' },
			{ value: '3', label: 'glue chains now code' }
		],
		para2:
			'one finance analyst shipped dashboards fast enough that their lead asked them to slow down. the automations that failed quietly are code now, with alerts. git got explained with tracing paper, and it stuck.',
		bridge:
			'before this, the craft: a solo therapy practice rebuilt in 4h43m. mobile load 8.3s → 2.9s. pageviews up 185%. same hands.'
	},
	isThisYou: {
		heading: 'is this for you?',
		yesLead: 'yes, if:',
		yes: [
			'you sent the memo. nothing changed.',
			"you have a team, and they aren't engineers",
			'someone on it is curious, or already shipping without guardrails',
			"you'd rather your people own it than rent a consultancy"
		],
		noLead: 'not yet, if:',
		no: [
			"it's just you. no team yet",
			'you want a workshop and a recording',
			'you want it done for you, with nobody on your side learning'
		]
	},
	timeline: { heading: 'the two weeks.' },
	close: {
		scarcity: 'one team a month · by appointment',
		heading: 'join the waitlist.',
		emailPlaceholder: 'email you actually check',
		buildLabel: 'what did you ask your team to do?',
		buildPlaceholder: 'use AI for… a few tried it, then…',
		button: 'get on the list →',
		// Split around site.teardown.creditNote so the claim can carry its own
		// condition inline — the unqualified version outruns what /terms actually says.
		rewardBefore: `if you'd rather not wait, start with the teardown: ${usd(site.teardown.priceUSD)},`,
		rewardAfter: `. i look at how your team works today, record a 10-minute Loom on where it's stuck, and write down what i'd fix first. you keep it whether or not we work together.`,
		creditTerms: `paid up front. credited against the engagement if you book one within 30 days. if i decline after you've paid, you get all of it back.`
	}
}

export const LEDGER_TOTAL_USD = grandSlam.ledger.groups
	.flatMap((g) => g.lines)
	.reduce((acc, l) => acc + (l.valueUSD ?? 0), 0)

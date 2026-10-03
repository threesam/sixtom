import type { GrandSlamOffer } from './types'
import { site } from './site'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`

// The one offer: team AI enablement (repositioned 2026-09-23 from the
// vibe-code rescue sprint; see vault "growth strategy 2026-09" + "price floor").
// Niched by stage 2026-10-01: the buyer whose team is already building. The
// deliverable is one process (written down, runnable, a red light), not a tool.
// Rules baked in and pinned by content.test.ts: no "agent" in customer copy
// (results over mechanism; AI is only ever the client's context), no slot
// counters (honest at zero). Proof stays anonymized: the day job is never
// named as a case study until there's a written OK to cite it.
export const grandSlam: GrandSlamOffer = {
	headline: "everyone's building. nothing's better.",
	lead: 'by day 10, the process that keeps slipping is written down, running, and yours.',
	offerLine:
		"the enablement engagement, for teams already building with AI. two weeks, one team. by day 10 one process that lived in people's heads is written down, runs without anyone chasing it, and goes red the day a step is late. a named person on your team owns it.",
	wall: {
		thesis: "building got cheap. deciding didn't.",
		para: 'anyone on your team can build a tool in an afternoon now. so they do. nobody decides which ones should exist.',
		turn: 'every month it stays like this has a price:',
		costCards: [
			{ title: 'the pile', sub: 'tools nobody asked for, kept alive by whoever made them' },
			{ title: 'the queue', sub: 'one person reviews everything, or nobody reviews anything' },
			{ title: 'the date', sub: 'the steps live in three heads and a chat thread, so it slips' }
		],
		costLine: 'that part is fixable in two weeks.'
	},
	ledger: {
		heading: 'one process running. guardrails that hold.',
		para: "two weeks with your team, on the one process that keeps running late. you pick it on the first call. everything in the engagement, and what it'd cost you piecemeal:",
		groups: [
			{
				title: 'the diagnosis',
				lines: [
					{
						line: 'the inventory',
						sub: "everything your team has built, who uses it, what's quietly broken",
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
				title: 'the process',
				lines: [
					{
						line: 'written down',
						sub: 'one process, step by step, with an owner and a yes or no on each step',
						valueUSD: null,
						valueLabel: 'core'
					},
					{
						line: 'runnable',
						sub: 'the steps your team repeats every week become something anyone can run by asking',
						valueUSD: 4000
					},
					{
						line: 'the red light',
						sub: 'when a step is late, its owner hears that day. so does everyone waiting on it',
						valueUSD: 1000
					}
				]
			},
			{
				title: 'the guardrails',
				lines: [
					{
						line: 'permissions + review gate',
						sub: 'nothing reaches production without review, and the person who knows the work reviews it',
						valueUSD: 3000
					},
					{
						line: 'repo rules',
						sub: "one branch per tool, hooks, shared instructions. a 45,000-line PR can't happen",
						valueUSD: 2500
					},
					{
						line: 'access, trimmed',
						sub: 'who needs to be in the repo and the systems, and who never did. customer data comes off laptops',
						valueUSD: 2000
					}
				]
			},
			{
				title: 'the people',
				lines: [
					{
						line: 'hands-on onboarding',
						sub: 'the people who run the process, set up. by the tenth person it takes one sitting',
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
						line: 'running by day 10',
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
						sub: 'the next three things worth doing, in order. and the ones to buy instead of build',
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
		headline: 'your person runs it by day 10,\nor the rest is free.',
		body: "and there's a floor under it: day 5, we both look at it. if we can both see it won't be running in scope, we stop there. you keep everything we built and pay only for the time used. the risk is mine to carry, not yours."
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
			'one finance analyst shipped dashboards fast enough that their lead asked them to slow down. the automations that failed quietly are code now, with alerts.',
		broke: {
			heading: 'what broke when it worked.',
			lines: [
				'i became the review queue. everything waited on me.',
				'thousands of tests, good ones. most never needed to exist.',
				'i built tools faster than i asked who would use them.',
				"the process stayed in people's heads. nobody can run that."
			],
			turn: "so the first thing we make now is a document. the build comes second, and it's smaller."
		},
		bridge:
			'before this, the craft: a solo therapy practice rebuilt in 4h43m. mobile load 8.3s → 2.9s. pageviews up 185%. same hands.'
	},
	isThisYou: {
		heading: 'is this for you?',
		yesLead: 'yes, if:',
		yes: [
			"your team is building. you can't tell what it adds up to",
			"the people building aren't engineers",
			'a date slipped and nobody saw it coming',
			"you'd rather your people own it than rent a consultancy"
		],
		noLead: 'not yet, if:',
		no: [
			'nobody on your team has shipped anything yet. start with the teardown',
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
		buildLabel: 'what is your team building, and what still runs late?',
		buildPlaceholder: 'everyone has a dashboard now, but…',
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

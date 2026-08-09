import type { GrandSlamOffer } from './types'
import { site } from './site'

// The one offer. Copy source of truth: vault "sixtom grand slam — page copy
// (voice pass)". Rules baked in and pinned by content.test.ts: no "agent" in
// customer copy (results over mechanism), no slot counters (honest at zero).
export const grandSlam: GrandSlamOffer = {
	chip: '1 client a month · waitlist open',
	headline: "everyone saw the demo. nobody's seen it since.",
	lead: "AI gets you to a demo because it can hold the whole thing in its head. once your codebase outgrows that window, it starts making things worse instead of better. that's the wall every vibe-coded project hits. it's also the thing i fix.",
	offerLine:
		'the production sprint. two weeks. live in production on day 10 — and you own every line of it.',
	stats: [
		{ value: '2 weeks', label: 'per sprint' },
		{ value: 'all async', label: 'no standups' },
		{ value: 'day 10 or free', label: 'the guarantee' }
	],
	wall: {
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
						valueUSD: 5000
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
		// Built from parts so optional pricing fields drop cleanly; a closed intro
		// renders struck through on the page and vanishes from machine surfaces.
		payParts: [
			{ text: `$${site.sprint.priceUSD.toLocaleString('en-US')} fixed.` },
			...(site.sprint.introPriceUSD
				? [
						{
							text: `$${site.sprint.introPriceUSD.toLocaleString('en-US')} for the ${site.sprint.introNote ?? 'first clients'}.`,
							struck: site.sprint.introClosed ?? false
						}
					]
				: []),
			...(site.sprint.paymentPlan ? [{ text: `or ${site.sprint.paymentPlan}.` }] : [])
		],
		anchorLine:
			'a dev shop quotes $50k and three months. a senior engineer runs $200k a year. this is two weeks, ten grand, and you own all of it.'
	},
	guarantee: {
		// \n = author-controlled line break: clause per line on desktop.
		headline: 'live in production by day 10,\nor the remaining payments are free.',
		body: "and there's a floor under it: day 5, we both look at it. if we can both see it won't ship in scope, we stop there — you keep everything we built and pay only for the time used. the risk is mine to carry, not yours."
	},
	proof: {
		eyebrow: 'proof · something from nothing',
		heading: 'a solo practice with no way to reach its own clients.',
		para: "a men's-mental-health therapist had a slow, drifting site and one channel: rented directory listings, with insurance deciding who found him. i rebuilt the whole thing custom and gave him a growth engine he owns. the craft shows in the numbers:",
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
		heading: 'is this for you?',
		yesLead: 'yes, if:',
		yes: [
			'you vibe-coded something to a working demo',
			'it has real users, or paying ones',
			"it's breaking, or it just won't reach production",
			"you'd rather own the fix than rent a dev shop"
		],
		noLead: 'not yet, if:',
		no: [
			"it's still just an idea — nothing built",
			'you want someone to manage a team of engineers',
			'you need it done and gone, no involvement'
		]
	},
	timeline: { heading: 'the two weeks.' },
	close: {
		scarcity: 'one seat a month · by appointment',
		heading: 'join the waitlist.',
		emailPlaceholder: 'email you actually check',
		buildLabel: 'what did you build?',
		buildPlaceholder: 'a demo of… it works, but…',
		button: 'get on the list →',
		reward: `the seat's booked out? good sign. if you'd rather not wait, the teardown is how you move now: $${site.teardown.priceUSD.toLocaleString('en-US')}, ${site.teardown.creditNote}. i read the whole thing and tell you exactly what breaks, in what order, and what i'd do first. you get the writeup whether or not we ever work together.`
	}
}

export const LEDGER_TOTAL_USD = grandSlam.ledger.groups
	.flatMap((g) => g.lines)
	.reduce((acc, l) => acc + (l.valueUSD ?? 0), 0)

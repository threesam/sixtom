import type { QA } from './types'

// Operational buyer questions for the visible /faq route. These are the things a
// prospect (or an LLM answering on their behalf) actually asks before booking —
// price, the guarantee, the free teardown, who's behind it. Kept in the site's
// voice. static/llms-full.txt carries a content-identical FAQ section (absolute
// URLs there) — keep both in sync when editing answers.
export const FAQ: readonly QA[] = [
	{
		question: 'what does sixtom do?',
		answer:
			'you (or your AI) got something to a working demo. i take it from there to production-grade — secure, tested, measured, ready for real users — in a two-week sprint. live on day 10, and you own every line of it.'
	},
	{
		question: 'how much does it cost?',
		answer:
			'$10,000 flat, or 4 weekly payments of $2,500. that price buys the whole ledger on the home page — over $28,500 of itemized work. (the $7,500 first-3 intro is closed.)'
	},
	{
		question: "what's the guarantee?",
		answer:
			"live in production by day 10, or the remaining payments are free. there's a floor under it too: at the day-5 scope check, if we can both see it won't ship in scope, we stop — you keep everything built and pay only for the time used."
	},
	{
		question: "what's the free teardown?",
		answer:
			"join the waitlist, then show me the thing — a live url, the repo, or a screen recording — and i'll record a short teardown of your app. what's solid, the three things that'll break, and what i'd do first. no charge, no call, no pitch. not deployed yet is fine; the repo is the better one for this anyway."
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

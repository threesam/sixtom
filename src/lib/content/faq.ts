import type { QA } from './types'

// Operational buyer questions for the visible /faq route. These are the things a
// prospect (or an LLM answering on their behalf) actually asks before booking —
// price, scope, the day-5 guarantee, who's behind it. Kept in the site's voice.
export const FAQ: readonly QA[] = [
	{
		question: 'what does sixtom do?',
		answer:
			'you (or your AI) got something to a working demo. i take it from there to production-grade — secure, stable, ready for real users — in a two-week sprint. you own it on day 10.'
	},
	{
		question: "what's the difference between the audit and the sprint?",
		answer:
			"the audit ($1,500) is a written breakdown plus a short video walkthrough of what's blocking you and whether a sprint makes sense — start here if you're not sure. the sprint ($10,000) is two weeks of me building it to production. the audit credits toward the sprint if you book within 30 days."
	},
	{
		question: 'how much does it cost?',
		answer:
			'the audit is $1,500 flat. the sprint is $10,000 flat, or 4 weekly payments of $2,500. the first 3 clients get the sprint at $7,500.'
	},
	{
		question: 'how long does it take?',
		answer:
			'the sprint is two weeks — live in production on day 10. the audit turns around within a week.'
	},
	{
		question: "what if it won't ship in two weeks?",
		answer:
			"there's a scope check on day 5. if we can both see it won't make it, we stop there. you keep everything built and pay only for the time used."
	},
	{
		question: 'how many clients do you take?',
		answer:
			"one a month, by appointment. that's the whole model — you get my full attention, not a queue."
	},
	{
		question: "who's behind sixtom?",
		answer:
			"Salvatore (Sam) D'Angelo — lead engineer at Made In Cookware (multi-million visitors a month), formerly at Rhone. sixtom is the solo practice."
	},
	{
		question: 'is it really all async?',
		answer:
			'yes. daily progress drops in your channel, with one short mid-sprint sync to course-correct. no standups.'
	},
	{
		question: 'what is the "vibe-code tax"?',
		answer:
			"what your half-finished, AI-built prototype quietly costs you per year — lost deals, downtime, weekends. there's a no-email calculator at /tax."
	}
]

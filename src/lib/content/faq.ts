import type { QA } from './types'

// Operational buyer questions for the visible /faq route. These are the things a
// prospect (or an LLM answering on their behalf) actually asks before booking —
// price, the guarantee, the teardown, who's behind it. Kept in the site's
// voice. static/llms-full.txt carries a content-identical FAQ section (absolute
// URLs there) — keep both in sync when editing answers.
export const FAQ: readonly QA[] = [
	{
		question: 'what does sixtom do?',
		answer:
			'you told your team to use AI and nothing changed. in two weeks, one named person on your team ships a real internal system, the fragile glue between your tools becomes code you can watch, and the guardrails hold once they get good. you own all of it.'
	},
	{
		question: 'how much does it cost?',
		answer:
			'$15,000 fixed. half up front, half on day 10. that buys the whole ledger on the home page, over $28,000 of itemized work. the price is the same for everyone.'
	},
	{
		question: "what's the guarantee?",
		answer:
			"your person ships the system by day 10, or the remaining payment is free. there's a floor under it too: at the day-5 scope check, if we can both see it won't ship in scope, we stop. you keep everything built and pay only for the time used."
	},
	{
		question: "what's the teardown?",
		answer:
			"$1,500, credited in full against the engagement if you book one within 30 days. i look at how your team works today: the tools, the automations, the numbers people argue about. you get a 10-minute Loom and a written list of what's stuck and what i'd fix first. you keep it whether or not we work together, and i'll tell you if you don't need me."
	},
	{
		question: 'how long does it take?',
		answer: 'two weeks. shipped by day 10. one team a month, by appointment.'
	},
	{
		question: 'does my team need to be technical?',
		answer:
			'no. the people i onboard work in ops, finance, marketing and wholesale. none of them were hired to write code. they need a setup that works, a review gate, and someone to explain git with tracing paper.'
	},
	{
		question: 'how many clients do you take?',
		answer:
			"one team a month, by appointment. that's the whole model. you get my full attention, not a queue. when the seat's taken, the waitlist is open."
	},
	{
		question: 'what happens after the two weeks?',
		answer:
			"you own everything: the system, the repo, the runbook. there's a day-30 check-in to see what stuck. if you want me back for the next system, we talk then."
	},
	{
		question: "who's behind sixtom?",
		answer:
			"Salvatore (Sam) D'Angelo, leads engineering and AI at Made In (multi-million visitors a month), formerly at Rhone. sixtom is the solo practice."
	},
	{
		question: 'is it remote?',
		answer:
			'yes. working sessions over video, a daily Loom, and everything lands in your repo. no standups.'
	}
]

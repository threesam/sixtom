import type { SiteCopy } from './types'

export const cro: SiteCopy = {
	meta: {
		title: 'SIXTOM | Your Website Should Be Making You Money.',
		description:
			"Stop losing customers to a website that isn't earning its keep. Get a high-converting website live in 7 days — built around what your buyers need to say yes.",
		keywords:
			'high-converting website, website that generates leads, fast web development, website in 7 days, e-commerce optimization, business automation, revenue-generating website'
	},
	hero: {
		headline: 'Your website should be',
		highlight: 'making you money.',
		subheadline:
			"Every day it doesn't, you're handing customers to whoever shows up first. Live in 7 days.",
		cta: "Let's Fix That"
	},
	problem: {
		headline: "You're not paying for a website. You're paying for meetings about meetings.",
		items: [
			{ bold: 'Six people on your project.', body: "None of them are building anything." },
			{ bold: 'Delay is their business model.', body: "Your urgency is their profit margin." },
			{ bold: 'Meanwhile, your competitors shipped last Tuesday.' }
		],
		resolution: "There's a better way."
	},
	services: [
		{
			index: '01',
			question: 'What if your website actually brought in customers?',
			answer: 'Built to turn visitors into leads. Live in under a week.',
			bullets: [
				'Loads in under 2 seconds — most visitors leave after 3',
				'Ranks on Google from day one',
				'Generating leads by next Friday'
			],
			dark: true
		},
		{
			index: '02',
			question: 'Ready to turn your store into a sales machine?',
			answer: 'Every barrier between your customer and checkout — removed.',
			bullets: [
				'Checkout flows people actually complete',
				"Product pages that answer objections before they're asked",
				'Open for business in days, not quarters'
			],
			dark: false
		},
		{
			index: '03',
			question: 'What would your team do with 10 extra hours a week?',
			answer: 'Automate the repetitive work so your people focus on what moves revenue.',
			bullets: [
				'10+ hours saved per week from day one',
				'Follow-ups and data flows run themselves',
				'You own it outright — no monthly platform fees'
			],
			dark: true
		},
		{
			index: '04',
			question: 'Is broken infrastructure quietly costing you growth?',
			answer: 'The foundation that makes everything else work — and keeps working.',
			bullets: [
				'All your data in one place, always accurate',
				'Dashboards that show what actually matters',
				'Built to scale without breaking'
			],
			dark: false
		}
	],
	credibility: {
		headline: 'Fast by design. Proven by results.',
		stats: [
			{ value: '< 7 days', label: 'From first call to live website' },
			{ value: 'Zero', label: 'Surprise invoices. Ever.' },
			{ value: '100%', label: 'On-time delivery rate' }
		]
	},
	contact: {
		headline: "Your competition isn't waiting.",
		subheadline: "Tell me what you need. I'll tell you how fast we can get there.",
		namePlaceholder: 'Your name',
		emailPlaceholder: 'Your email',
		messagePlaceholder: "What are you building? What's the goal?",
		button: "Let's Build It",
		successTitle: 'On it.',
		successBody: "You'll hear from me today."
	}
}

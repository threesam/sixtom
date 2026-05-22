import type { Site, CalEvent } from './types'

export const site: Site = {
	// Replace pre-launch with the production domain.
	siteUrl: 'https://sixtom.com',
	// Replace pre-launch with the operator's actual Cal.com URL.
	bookingUrl: 'https://cal.com/sam-dangelo/sprint-intro',
	gardenUrl: 'https://threesam.com',
	tagline: 'we just want to build cool shit and help people chase their dreams',
	thesis: 'vibe coding is how you slowly become the intern of your own codebase.',
	thesisBody:
		"AI gets you to a demo because the model can hold the whole thing in its head. once the codebase outgrows that window, the AI starts making it worse instead of better. that's the wall every vibe-coded project hits. it's also the thing i fix.",
	hero: {
		h1: 'AI ships demos. i ship solutions.',
		subhead:
			"you built it with AI. it works for you. now it has to work for everyone else.",
		ctaPrimary: 'book the working session',
		ctaSecondary: 'notify me'
	},
	operator: {
		name: "Sam D'Angelo",
		jobTitle: 'lead engineer',
		currentEmployer: 'Made In Cookware',
		formerEmployer: 'Rhone',
		credentialsChip: 'lead engineer at Made In Cookware. formerly at Rhone.'
	},
	audit: {
		name: 'audit',
		longName: 'the audit',
		priceUSD: 1500,
		cadence: 'turnaround within a week.'
	},
	sprint: {
		name: 'sprint',
		longName: 'async sprint',
		priceUSD: 10000,
		introPriceUSD: 7500,
		introNote: 'first 3 clients',
		cadence: '1 client a month, by appointment.',
		paymentPlan: '4 weekly payments of $2,500'
	},
	process: [
		{
			label: 'Week 1, day 0',
			body: '30-min call (or skip if you did the audit). We figure out the thing.'
		},
		{ label: 'Days 1–7', body: 'Agents build. I steer. Daily Loom + code drop in your channel.' },
		{ label: 'Mid-sprint', body: '1 short sync. Course-correct if needed.' },
		{
			label: 'Day 5 (scope check)',
			body: "If we can both see it won't ship in scope, we stop here. You keep what we built."
		},
		{ label: 'Day 10', body: 'Live in production. You own it.' },
		{ label: 'Day 30', body: "Check-in. What stuck, what didn't." }
	],
	stats: [
		{ value: '2 weeks', label: 'per sprint' },
		{ value: 'all async', label: 'no standups' },
		{ value: '$10,000', label: 'fixed' }
	],
	testimonial: {
		quote:
			"He's built three sites for me and with each one, the unique needs and goals of the site dictated his approach, no cookie cutting corners.",
		attribution: 'Eleanor Goldfield'
	}
}

export const calEvent: CalEvent = {
	title: '30-min intro call — Sixtom',
	slug: 'sprint-intro',
	durationMinutes: 30,
	description:
		"A 30-min call. Tell me about the thing you've been trying to ship and whether the audit or the sprint is the right next step.",
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
			label: 'audit ($1,500) or sprint ($10,000)?',
			type: 'select',
			options: [
				'audit ($1,500) — figure it out first',
				'sprint ($10,000) — i know what i need',
				'not sure, want to talk it through'
			],
			required: true
		}
	]
}

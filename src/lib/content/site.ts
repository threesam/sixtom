import type { Site, CalEvent } from './types'

export const site: Site = {
	// Replace pre-launch with the production domain.
	siteUrl: 'https://sixtom.com',
	// Replace pre-launch with the operator's actual Cal.com URL.
	bookingUrl: 'https://cal.com/sam-dangelo/sprint-intro',
	// Replace pre-launch with the actual garden URL.
	gardenUrl: 'https://garden.example.com',
	tagline: 'we just want to build cool shit and help people chase their dreams',
	thesis: 'Vibe coding is how you slowly become the intern of your own codebase.',
	thesisBody: 'AI gets you to a demo. I run the agents that turn it into a product.',
	hero: {
		h1: 'AI ships demos. I ship products.',
		subhead:
			"I run agents in parallel. Work ships whether I'm in a meeting or asleep. Two weeks to a working version in production. Daily drops in Slack. No standups.",
		ctaPrimary: 'Book a 30-min intro call',
		ctaSecondary: 'Notify me'
	},
	operator: {
		name: "Sam D'Angelo",
		jobTitle: 'Lead Engineer',
		currentEmployer: 'Made In Cookware',
		formerEmployer: 'Rhone',
		credentialsChip: 'Lead engineer at Made In Cookware. Formerly at Rhone.'
	},
	audit: {
		name: 'Audit',
		longName: 'the audit',
		priceUSD: 500,
		cadence: 'turnaround within a week.',
		promise:
			"Send me your repo and the thing you've been trying to ship. I send back a 1-pager and a 15-min Loom: what's blocking, what I'd do, whether a sprint makes sense."
	},
	sprint: {
		name: 'Async Sprint',
		longName: 'async sprint',
		priceUSD: 7500,
		cadence: '1 client a month, by appointment.',
		promise:
			'Two weeks. Multiple agents working in parallel on the boring bits — fixes, accessibility passes, the edge cases that break in front of customers. I steer. You get a daily drop in Slack and a working version live on day 10.'
	},
	process: [
		{
			label: 'Week 1, day 0',
			body: '30-min call (or skip if you did the audit). We figure out the thing.'
		},
		{ label: 'Days 1–7', body: 'Agents build. I steer. Daily Loom + code drop in Slack.' },
		{ label: 'Mid-sprint', body: '1 short sync. Course-correct if needed.' },
		{
			label: 'Day 5',
			body: "If we can both see it won't ship in scope, we stop. You keep what we built."
		},
		{ label: 'Day 10', body: 'Live in production. You own it.' },
		{ label: 'Day 30', body: "Check-in. What stuck, what didn't." }
	],
	stats: [
		{ value: '2 weeks', label: 'per sprint' },
		{ value: '0', label: 'standups' },
		{ value: '$7,500', label: 'fixed' }
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
			label: "What's the thing you've been close on but haven't shipped?",
			type: 'longText',
			required: true
		},
		{
			label: 'Send a link to the repo or a screenshot of where it is',
			type: 'text',
			required: false
		},
		{
			label: 'Audit ($500) or sprint ($7,500)?',
			type: 'select',
			options: [
				'Audit — figure it out first',
				'Sprint — I know what I need',
				'Not sure, want to talk it through'
			],
			required: true
		}
	]
}

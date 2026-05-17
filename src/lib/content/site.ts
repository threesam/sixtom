import type { Site, CalEvent } from './types'

export const site: Site = {
	// Replace pre-launch with the production domain.
	siteUrl: 'https://sixtom.com',
	// Replace pre-launch with the operator's actual Cal.com URL.
	bookingUrl: 'https://cal.com/sam-dangelo/sprint-intro',
	gardenUrl: 'https://threesam.com',
	tagline: 'we just want to build cool shit and help people chase their dreams',
	thesis: 'Vibe coding is how you slowly become the intern of your own codebase.',
	thesisBody:
		'AI gets you to a demo. Agents do the typing. I do the judgment. Together we ship a product.',
	hero: {
		h1: 'AI ships demos. I ship products.',
		subhead:
			'I run a fleet of agents in parallel. They type, I judge. Two weeks to a working version live in production. Daily drops. No calendar tetris.',
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
		priceUSD: 750,
		cadence: 'turnaround within a week.',
		promise:
			"Send me your repo and the thing you've been trying to ship. I send back a 1-pager and a 15-min Loom: what's blocking, what I'd do, whether a sprint makes sense. Start here."
	},
	sprint: {
		name: 'Async Sprint',
		longName: 'async sprint',
		priceUSD: 7500,
		cadence: '1 client a month, by appointment.',
		promise:
			'Two weeks. Agents do the typing — drafts, fixes, accessibility passes, the boring 10%. I do the judgment. Daily drops. Live in production on day 10.'
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
			label: 'Audit ($750) or sprint ($7,500)?',
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

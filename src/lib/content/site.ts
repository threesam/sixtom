import type { Site, CalEvent } from './types'

export const site: Site = {
	// Replace pre-launch with the production domain.
	siteUrl: 'https://sixtom.com',
	// Replace pre-launch with the operator's actual Cal.com URL.
	bookingUrl: 'https://cal.com/sam-dangelo/pair-sprint-intro',
	// Replace pre-launch with the actual garden URL.
	gardenUrl: 'https://garden.example.com',
	tagline: 'we just want to build cool shit and help people chase their dreams',
	thesis: 'Vibe coding is how you slowly become the intern of your own codebase.',
	thesisBody: "AI gets you to a demo. The shipping part takes longer. That's me.",
	hero: {
		h1: 'AI ships demos. I ship products.',
		subhead:
			"I pair with someone on your team for a week. We ship the thing they've been stuck on.",
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
	offer: {
		name: 'Pair Sprint',
		longName: 'pair sprint',
		priceUSD: 7500,
		cadence: '1 client a month, by appointment.',
		promise: 'A week. You pair me with someone on your team. They drive, I shape, we ship.'
	},
	process: [
		{ label: 'Day 0', body: '30-min intro call. We figure out the thing.' },
		{ label: 'Day 1', body: "I show up. Meet who I'm pairing with." },
		{ label: 'Days 1–5', body: 'They drive. I shape. The thing ships.' },
		{ label: 'Day 5', body: 'Live in production. You own it.' },
		{ label: 'Day 30', body: "Check-in. What stuck, what didn't." }
	],
	stats: [
		{ value: '1 week', label: 'per sprint' },
		{ value: '1 pair', label: 'you + me' },
		{ value: '0', label: 'committees' }
	],
	testimonial: {
		quote:
			"He's built three sites for me and with each one, the unique needs and goals of the site dictated his approach, no cookie cutting corners.",
		attribution: 'Eleanor Goldfield'
	}
}

export const calEvent: CalEvent = {
	title: '30-min intro call — Sixtom Pair Sprint',
	slug: 'pair-sprint-intro',
	durationMinutes: 30,
	description:
		"A 30-min call. Tell me about the thing you've been trying to ship and who on your team would pair with me. If it's a fit, we'll schedule the sprint.",
	intakeQuestions: [
		{
			label: "What's the thing you've been close on but haven't shipped?",
			type: 'longText',
			required: true
		},
		{
			label: 'Who on your team would pair with me for the week?',
			type: 'text',
			required: true
		},
		{
			label: 'Ready to start in the next 30 days?',
			type: 'select',
			options: ['Yes', 'Maybe', 'Just exploring'],
			required: true
		}
	]
}

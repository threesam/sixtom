import type { Site, CalEvent } from './types'

export const site: Site = {
	// Replace pre-launch with the production domain.
	siteUrl: 'https://sixtom.com',
	// Replace pre-launch with the operator's actual Cal.com URL.
	bookingUrl: 'https://cal.com/sam-dangelo/sprint-intro',
	// Replace pre-launch with the actual garden URL.
	gardenUrl: 'https://garden.example.com',
	tagline: 'we just want to build cool shit and help people chase their dreams',
	thesis: 'Prototypes ship in a weekend. Production is its own job.',
	hero: {
		h1: 'Vibe coding gets you to 90%. The rest is a different muscle.',
		subhead:
			"Spend a week with me and one of your domain experts. We pair on the thing they've been close on but can't quite get over. They keep the code. You keep the muscle.",
		ctaPrimary: 'Book a 30-min intro call',
		ctaSecondary: 'Notify me'
	},
	operator: {
		name: "Sam D'Angelo",
		jobTitle: 'Lead Engineer',
		currentEmployer: 'Made In Cookware',
		formerEmployer: 'Rhone',
		credentialsChip:
			'Lead engineer at Made In Cookware ($200M/yr DTC). Built our centralized ops tool — every department, two months.'
	},
	offer: {
		name: 'Pair Sprint',
		longName: '1-week pair sprint',
		priceUSD: 7500,
		cadence: 'One client per month, by appointment.',
		promise:
			"One week. You bring a domain expert. We pair on the thing they've been close on but can't quite get over. They keep the code and the muscle."
	}
}

export const calEvent: CalEvent = {
	title: '30-min intro call — Sixtom Pair Sprint',
	slug: 'pair-sprint-intro',
	durationMinutes: 30,
	description:
		"A 30-min call to talk about the thing you've been trying to ship, who on your team would pair with me, and whether the Pair Sprint is the right fit. If we are, we'll schedule the sprint after this call.",
	intakeQuestions: [
		{
			label:
				"What's the thing — the tool, system, or layer you've been close on but haven't shipped?",
			type: 'longText',
			required: true
		},
		{
			label: 'Who on your team would pair with me for the week? (name, role)',
			type: 'text',
			required: true
		},
		{
			label: 'Ready to start in the next 30 days?',
			type: 'select',
			options: ['Yes', 'Maybe', 'No, just exploring'],
			required: true
		}
	]
}

import type { Site, CalEvent } from './types'

export const site: Site = {
	// Replace pre-launch with the production domain.
	siteUrl: 'https://sixtom.com',
	// Replace pre-launch with the operator's actual Cal.com URL.
	bookingUrl: 'https://cal.com/sam-dangelo/sprint-intro',
	// Replace pre-launch with the actual garden URL.
	gardenUrl: 'https://garden.example.com',
	tagline: 'we just want to build cool shit and help people chase their dreams',
	thesis: 'Most teams get to 90%. I finish.',
	hero: {
		h1: 'AI got you to 90%. I ship the last 10%.',
		subhead:
			"I pair with one of your domain experts for a week. We ship the internal tool, system, or operating layer you've been stuck on. You keep the code and the muscle.",
		ctaPrimary: 'Book a 30-min intro call',
		ctaSecondary: 'Notify me'
	},
	operator: {
		name: "Sam D'Angelo",
		jobTitle: 'Lead Engineer',
		currentEmployer: 'Made In Cookware',
		formerEmployer: 'Rhone',
		credentialsChip:
			'Lead engineer at Made In Cookware. Built a centralized ops tool serving every department in two months.'
	},
	offer: {
		name: 'Pair Sprint',
		longName: '1-week pair sprint',
		priceUSD: 7500,
		cadence: 'One client per month, by appointment.',
		promise:
			"One week. I embed with one of your team's domain experts. We pair on the internal tool, system, or operating layer you've been stuck on. You keep the code, the patterns, and the working knowledge."
	}
}

export const calEvent: CalEvent = {
	title: '30-min intro call — Sixtom Pair Sprint',
	slug: 'pair-sprint-intro',
	durationMinutes: 30,
	description:
		"A 30-min call to talk about the system you've been trying to ship, who on your team would pair with me, and whether the Pair Sprint is the right fit. If we are, we'll schedule the sprint after this call.",
	intakeQuestions: [
		{
			label: "What's the system, tool, or operating layer you've been trying to ship?",
			type: 'longText',
			required: true
		},
		{
			label: 'Who on your team would pair with me for the week? (Name, role)',
			type: 'text',
			required: true
		},
		{
			label: 'Are you ready to start a sprint in the next 30 days?',
			type: 'select',
			options: ['Yes', 'Maybe', 'No, just exploring'],
			required: true
		}
	]
}

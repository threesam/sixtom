import type { Site, CalEvent } from './types'

export const site: Site = {
	// Replace pre-launch with the production domain.
	siteUrl: 'https://sixtom.com',
	// Replace pre-launch with the operator's actual Cal.com URL.
	bookingUrl: 'https://cal.com/sam-dangelo/sprint-intro',
	// Replace pre-launch with the actual garden URL.
	gardenUrl: 'https://garden.example.com',
	tagline: 'we just want to build cool shit and help people chase their dreams',
	thesis:
		'Action leads to insight is a more durable pattern than waiting for insight to take action.',
	hero: {
		h1: 'I help people get ideas out of their head and into the world.',
		subhead:
			'1-week site sprint. I look at what you have, ship a working version in days, and show you the before-and-after. For operators whose website has gotten in the way of growth.',
		ctaPrimary: 'Book a 30-min intro call',
		ctaSecondary: 'Notify me'
	},
	operator: {
		name: "Sam D'Angelo",
		jobTitle: 'Lead Engineer',
		currentEmployer: 'Made In Cookware',
		formerEmployer: 'Rhone',
		credentialsChip:
			"Lead engineer at Made In Cookware. Formerly at Rhone. Now applying that to small businesses where the leverage is highest."
	},
	offer: {
		name: 'Sixtom Sprint',
		longName: '1-week site sprint',
		priceUSD: 7500,
		cadence: 'One client per month, by appointment.',
		promise:
			'A working site by next Friday. Read access in. Working version live mid-sprint. Before/after measured. $7,500 fixed.'
	}
}

export const calEvent: CalEvent = {
	title: '30-min intro call — Sixtom Sprint',
	slug: 'sprint-intro',
	durationMinutes: 30,
	description:
		"A 30-min call to talk about your site, your data, and whether the Sprint is the right fit. If we are, we'll schedule the actual sprint after this call.",
	intakeQuestions: [
		{ label: 'What is the URL of your current site?', type: 'text', required: true },
		{ label: 'What is working, and what is not?', type: 'longText', required: true },
		{
			label: 'Are you ready to start a sprint in the next 30 days?',
			type: 'select',
			options: ['Yes', 'Maybe', 'No, just exploring'],
			required: true
		}
	]
}

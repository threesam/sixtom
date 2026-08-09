import type { Site, CalEvent } from './types'

export const site: Site = {
	// Replace pre-launch with the production domain.
	siteUrl: 'https://sixtom.com',
	// Kept in sync with calEvent.slug below; `pnpm cal:sync` pushes calEvent to Cal.com.
	bookingUrl: 'https://cal.com/sixtom/discovery',
	gardenUrl: 'https://threesam.com',
	tagline: 'we just want to build cool shit and help people chase their dreams',
	operator: {
		name: "Salvatore D'Angelo",
		jobTitle: 'lead engineer',
		currentEmployer: 'Made In Cookware',
		formerEmployer: 'Rhone',
		credentialsChip: 'lead engineer at Made In Cookware. formerly at Rhone.',
		linkedinUrl: 'https://www.linkedin.com/in/threesam',
		xUrl: 'https://x.com/six_to_m',
		githubUrl: 'https://github.com/threesam',
		soundcloudUrl: 'https://soundcloud.com/threesam'
		// Substack deliberately unlisted: the profile has no publication yet, and
		// a sameAs pointing at an empty shell is an anti-signal. Re-add when
		// essays actually syndicate there.
	},
	sprint: {
		name: 'sprint',
		longName: 'the production sprint',
		priceUSD: 10000,
		introPriceUSD: 7500,
		introNote: 'first 3 clients',
		introClosed: true,
		cadence: '1 client a month, by appointment.',
		paymentPlan: '4 weekly payments of $2,500'
	},
	teardown: {
		longName: 'the teardown',
		priceUSD: 5000,
		creditNote: 'credited in full against the sprint'
	},
	process: [
		{ label: 'wk 1 · day 0', body: 'a 30-minute call. we figure out the thing.' },
		{
			label: 'days 1–7',
			body: 'heads down. daily Loom + code drop in your channel, so you watch it happen.'
		},
		{
			label: 'day 5 · scope check',
			body: "if it can't ship in scope, we stop here. you keep what we built."
		},
		{ label: 'mid-sprint', body: 'one short sync. course-correct if needed.' },
		{ label: 'day 10', body: 'live in production. you own it. (or the rest is free.)' },
		{ label: 'day 30', body: "check-in. what stuck, what didn't." }
	],
	testimonial: {
		quote:
			"He's built three sites for me and with each one, the unique needs and goals of the site dictated his approach, no cookie cutting corners.",
		attribution: 'Eleanor Goldfield'
	}
}

export const calEvent: CalEvent = {
	title: 'solve for X — intro call',
	slug: 'discovery',
	durationMinutes: 30,
	description:
		"30 minutes. tell me what you've built and where it's breaking — we figure out the X between you and shipping, and whether the sprint is the move. no pitch.",
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
			label: 'where are you in the process?',
			type: 'select',
			options: ['on the waitlist', 'did the teardown — ready to talk', 'just found sixtom'],
			required: true
		}
	]
}

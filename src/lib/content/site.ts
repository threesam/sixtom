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
	// Pricing source of truth: vault "price floor — the rate card strangers and
	// friends both get" (2026-09-23). Prices hold or rise; no intro discounts.
	// The retired $10k production sprint is off-page — a quiet yes for warm
	// referrals only.
	engagement: {
		name: 'enablement',
		longName: 'the enablement engagement',
		priceUSD: 15000,
		cadence: '1 team a month, by appointment.',
		paymentPlan: 'half up front, half on day 10'
	},
	teardown: {
		longName: 'the teardown',
		priceUSD: 1500,
		creditNote: 'credited in full against the engagement'
	},
	process: [
		{ label: 'wk 1 · day 0', body: 'a 30-minute call. we pick the person and the system.' },
		{
			label: 'days 1–7',
			body: 'we build it together, in your repo, on your data. a daily Loom so leadership watches it happen.'
		},
		{
			label: 'day 5 · scope check',
			body: "if it can't ship in scope, we stop here. you keep what we built."
		},
		{
			label: 'week 2',
			body: 'the guardrails go in. the rest of the team gets set up. one session with leadership.'
		},
		{ label: 'day 10', body: 'shipped. your person owns it. (or the rest is free.)' },
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
		'30 minutes. tell me what you asked your team to do with AI and where it stalled. we figure out the X between them and shipping, and whether the engagement is the move. no pitch.',
	intakeQuestions: [
		{
			label: 'what did you ask your team to do with AI, and where did it stall?',
			type: 'longText',
			required: true
		},
		{
			label: 'where does your team work today? (tools, repo, spreadsheets)',
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

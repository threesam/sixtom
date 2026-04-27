import type { QA } from './types'

export const sprintQA: readonly QA[] = [
	{
		question: 'What is the Sixtom Sprint?',
		answer:
			'One week. New site. Built around what your existing data tells us is working, instrumented so you can see the before-and-after.'
	},
	{
		question: "What's included?",
		answer: [
			'A 1-hour discovery call (recorded, transcribed, synthesized for the build).',
			'Access onboarding — login to your analytics, your CMS, your hosting, anything else relevant.',
			'5 days of build.',
			'A live working version mid-week — you review, react, redirect.',
			'One round of revisions.',
			'Deployment to your hosting.',
			'30-day check-in to capture the after-state.'
		].join('\n')
	},
	{
		question: "What's not included?",
		answer: [
			"A new logo, name, or brand identity (I'm not the fit if that's what you need).",
			"Long-form copywriting from scratch (I'll work with what you have or what you draft).",
			'Ad campaign management.',
			'Long-term SEO content strategy.',
			'E-commerce setup beyond what you already have.',
			"Custom integrations beyond what's standard.",
			'Maintenance after delivery.'
		].join('\n')
	},
	{
		question: 'What do you need from me?',
		answer: [
			'Login access to your tools (15 minutes of clicking "add user").',
			'1-hour discovery call + a 30-minute mid-sprint review.',
			'Feedback within 2 business days.',
			'Whatever brand assets you have.',
			'Approval to deploy.'
		].join('\n')
	},
	{
		question: 'How long does it take?',
		answer:
			"One week from discovery call to deployment. Then 30 days for the after-state to settle so we can see what changed."
	},
	{
		question: 'How much?',
		answer: '$7,500 fixed. One client per month. By appointment.'
	},
	{
		question: 'What if it goes off the rails?',
		answer:
			"If the working version isn't on track by day 3, we pause. You keep what we've built and pay only for time spent."
	},
	{
		question: 'What if I’m not technical?',
		answer:
			"Most clients aren’t. I just need login access to your analytics, your CMS, your hosting. Usually 15 minutes of clicking “add user.” You don’t have to understand any of it — that’s my job."
	},
	{
		question: 'What if my live site breaks?',
		answer:
			"It can't. The new site is built somewhere else. Your live site doesn't change at all until you approve and we publish together."
	},
	{
		question: 'Who is this for?',
		answer:
			'Founders, operators, and small business owners whose website (and the data and tools around it) has gotten in the way of growth.'
	},
	{
		question: 'Who is this not for?',
		answer:
			"If you want a brand-new logo, name, or visual identity, I'm not the fit. If you want someone to manage your ads or write your blog forever — also not me. I rebuild your site, fast, with the data your team forgot to look at, and hand it back."
	}
]

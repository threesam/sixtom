import type { SiteCopy } from './types'

export const original: SiteCopy = {
	meta: {
		title: 'SIXTOM | Your Website. Tomorrow.',
		description:
			'AI-enabled web development that ships in days, not months. Websites, e-commerce, automations, and digital infrastructure — built fast.',
		keywords:
			'fast website development, AI web development, website in a day, rapid web development, e-commerce setup, workflow automation, digital infrastructure'
	},
	hero: {
		headline: 'Your website.',
		highlight: 'Tomorrow.',
		subheadline:
			'AI-enabled development means your site ships in days, not months. No committees. No scope creep. Just results.',
		cta: 'Book a Call'
	},
	problem: {
		headline: 'Why does a website still take 3 months?',
		items: [
			{
				bold: 'Bloated teams.',
				body: 'Six people in a room debating button colors. A discovery phase that outlasts most startups.'
			},
			{
				bold: 'Scope creep is a feature, not a bug',
				body: '— when agencies bill by the hour. Every revision is revenue. Every meeting is margin.'
			},
			{ bold: 'Meanwhile, your competitors shipped last Tuesday.' }
		],
		resolution: "It doesn't have to be this way."
	},
	services: [
		{
			index: '01',
			question: 'Need a website that actually converts?',
			answer:
				'High-performance landing pages and marketing sites, built on modern frameworks and deployed in days. Designed to load fast, rank well, and turn visitors into customers.',
			bullets: [
				'SvelteKit, Next.js, or static — whatever fits',
				'Mobile-first, performance-obsessed',
				'SEO baked in from day one',
				'Live in under a week'
			],
			dark: true
		},
		{
			index: '02',
			question: 'Ready to sell online?',
			answer:
				'Your store, launched. From product catalog to checkout flow, optimized for the sale — not for dragging out a project timeline.',
			bullets: [
				'Shopify or custom storefront',
				'Checkout flow optimization',
				'Payment & shipping integrations',
				'Product launch in days, not quarters'
			],
			dark: false
		},
		{
			index: '03',
			question: 'What if AI handled the boring stuff?',
			answer:
				'One engineer with the right AI stack replaces a 10-person department. We wire up automations that let your team focus on the work that actually matters.',
			bullets: [
				'Workflow automation',
				'AI integrations — chat, summarization, triage',
				'Internal tools that save hours per week',
				'No vendor lock-in, ever'
			],
			dark: true
		},
		{
			index: '04',
			question: 'Want your digital systems just... working?',
			answer:
				'APIs, dashboards, CMS, hosting — the scaffolding that makes everything else possible. We get it stood up fast so you can focus on growing.',
			bullets: [
				'CMS setup (Sanity)',
				'API design & integration',
				'Admin dashboards & internal tools',
				'Infrastructure that scales with you'
			],
			dark: false
		}
	],
	credibility: {
		headline: 'Speed is the strategy.',
		stats: [
			{ value: '< 7 days', label: 'Average delivery' },
			{ value: '0', label: 'Committees consulted' },
			{ value: '100%', label: 'Shipped, not shelved' }
		]
	},
	contact: {
		headline: 'Ready to ship?',
		subheadline: "Tell me what you're building. I'll tell you how fast we can get there.",
		namePlaceholder: 'please tell us your name',
		emailPlaceholder: 'enter your email',
		messagePlaceholder: 'how can we help?',
		button: 'Send Message',
		successTitle: 'Message received.',
		successBody: "I'll get back to you fast — that's kind of the whole point."
	}
}

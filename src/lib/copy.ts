// ─── Site-wide constants ──────────────────────────────────────────────────────

export const site = {
	name: 'SIXTOM',
	title: 'SIXTOM | Your Website. Tomorrow.',
	description:
		'AI-enabled web development that ships in days, not months. Websites, e-commerce, automations, and digital infrastructure — built fast.',
	keywords:
		'fast website development, AI web development, website in a day, rapid web development, e-commerce setup, workflow automation, digital infrastructure',
	url: 'https://sixtom.com/',
	imageUrl:
		'https://cdn.sanity.io/images/qcht0vh1/production/bdfc49865d938bfcebf61726ddf78e29846ec0fe-870x870.png',
	foundingYear: 2020,
}

// ─── Social links ─────────────────────────────────────────────────────────────

export const social = {
	x: { href: 'https://x.com/six_to_m', title: 'X' },
	linkedin: { href: 'https://linkedin.com/in/threesam', title: 'LinkedIn' },
	facebook: { href: '#', title: 'Facebook' },
}

// ─── Header / navigation ─────────────────────────────────────────────────────

export const header = {
	nav: [
		{ href: '#problem', text: 'Why Us' },
		{ href: '#service-01', text: 'Services' },
		{ href: '#credibility', text: 'Proof' },
		{ href: '#contact', text: 'Contact' },
	],
	mobileCta: { text: 'Book now', href: '#contact' },
}

// ─── Hero section ─────────────────────────────────────────────────────────────

export const hero = {
	heading: 'Your website.',
	headingHighlight: 'Tomorrow.',
	subheading:
		'AI-enabled development means your site ships in days, not months. No committees. No scope creep. Just results.',
	cta: { text: 'Book a Call', href: '#contact' },
}

// ─── Problem section ─────────────────────────────────────────────────────────

export const problem = {
	heading: 'Why does a website still take 3 months?',
	body: [
		{
			bold: 'Bloated teams.',
			rest: ' Six people in a room debating button colors. A discovery phase that outlasts most startups.',
		},
		{
			bold: 'Scope creep is a feature, not a bug',
			rest: '\u2014 when agencies bill by the hour. Every revision is revenue. Every meeting is margin.',
		},
		{
			bold: 'Meanwhile, your competitors shipped last Tuesday.',
			rest: '',
		},
	],
	pullQuote: "It doesn't have to be this way.",
}

// ─── Services ─────────────────────────────────────────────────────────────────

export type Service = {
	index: string
	question: string
	answer: string
	bullets: string[]
	dark: boolean
}

export const services: Service[] = [
	{
		index: '01',
		question: 'Need a website that actually converts?',
		answer:
			'High-performance landing pages and marketing sites, built on modern frameworks and deployed in days. Designed to load fast, rank well, and turn visitors into customers.',
		bullets: [
			'SvelteKit, Next.js, or static \u2014 whatever fits',
			'Mobile-first, performance-obsessed',
			'SEO baked in from day one',
			'Live in under a week',
		],
		dark: true,
	},
	{
		index: '02',
		question: 'Ready to sell online?',
		answer:
			'Your store, launched. From product catalog to checkout flow, optimized for the sale \u2014 not for dragging out a project timeline.',
		bullets: [
			'Shopify or custom storefront',
			'Checkout flow optimization',
			'Payment & shipping integrations',
			'Product launch in days, not quarters',
		],
		dark: false,
	},
	{
		index: '03',
		question: 'What if AI handled the boring stuff?',
		answer:
			'One engineer with the right AI stack replaces a 10-person department. We wire up automations that let your team focus on the work that actually matters.',
		bullets: [
			'Workflow automation',
			'AI integrations \u2014 chat, summarization, triage',
			'Internal tools that save hours per week',
			'No vendor lock-in, ever',
		],
		dark: true,
	},
	{
		index: '04',
		question: 'Want your digital systems just\u2026 working?',
		answer:
			'APIs, dashboards, CMS, hosting \u2014 the scaffolding that makes everything else possible. We get it stood up fast so you can focus on growing.',
		bullets: [
			'CMS setup (Sanity)',
			'API design & integration',
			'Admin dashboards & internal tools',
			'Infrastructure that scales with you',
		],
		dark: false,
	},
]

// ─── Credibility section ─────────────────────────────────────────────────────

export const credibility = {
	heading: 'Speed is the strategy.',
	stats: [
		{ value: '< 7 days', label: 'Average delivery' },
		{ value: '0', label: 'Committees consulted' },
		{ value: '100%', label: 'Shipped, not shelved' },
	],
	capabilities: [
		'SvelteKit',
		'Next.js',
		'Shopify',
		'Vercel',
		'Cloudflare',
		'Sanity',
		'OpenAI',
		'Claude',
		'Tailwind',
		'n8n',
		'Postgres',
	],
	techLabel: 'Some of the technologies we use',
}

// ─── Contact section ──────────────────────────────────────────────────────────

export const contact = {
	heading: 'Ready to ship?',
	subheading: "Tell me what you're building. I'll tell you how fast we can get there.",
	fields: {
		name: { label: 'name', placeholder: 'please tell us your name' },
		email: { label: 'email', placeholder: 'enter your email' },
		message: { label: 'message', placeholder: 'how can we help?' },
	},
	submit: 'Send Message',
	loading: 'Loading',
	success: {
		heading: 'Message received.',
		body: "I'll get back to you fast \u2014 that's kind of the whole point.",
	},
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export const footer = {
	foundingYear: 2020,
}

import { site } from '$lib/content'
import type { QA } from '$lib/content'
import type { LogEntry } from '$lib/log'

// Stable @id anchors so every node — Person, WebSite, Service, plus the per-page
// Article/FAQ blocks — resolves into one connected entity graph. Search and answer
// engines merge nodes that share an @id across <script> blocks and pages, so the
// writeup's author, the site's publisher, and the service's provider are all
// understood to be the same person, not three loose mentions.
const PERSON_ID = `${site.siteUrl}/#person`
const WEBSITE_ID = `${site.siteUrl}/#website`
const SERVICE_ID = `${site.siteUrl}/#service`
const BLOG_ID = `${site.siteUrl}/log#blog`

interface Org {
	'@type': 'Organization'
	name: string
}

// A reference to another node by its @id (resolved/merged by the engine).
interface NodeRef {
	'@id': string
}

export interface PersonLd {
	'@context': 'https://schema.org'
	'@type': 'Person'
	'@id': string
	name: string
	alternateName: readonly string[]
	jobTitle: string
	worksFor: Org
	alumniOf: Org
	url: string
	sameAs: readonly string[]
}

export interface WebSiteLd {
	'@context': 'https://schema.org'
	'@type': 'WebSite'
	'@id': string
	name: string
	alternateName: readonly string[]
	url: string
	publisher: NodeRef
}

export interface OfferLd {
	'@type': 'Offer'
	name: string
	description: string
	price: string
	priceCurrency: 'USD'
	availability: string
	url: string
}

export interface ServiceLd {
	'@context': 'https://schema.org'
	'@type': 'Service'
	'@id': string
	name: string
	alternateName: readonly string[]
	description: string
	url: string
	areaServed: string
	provider: NodeRef
	offers: readonly OfferLd[]
}

export function personJsonLd(): PersonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': PERSON_ID,
		name: site.operator.name,
		// Real aliases for the person only — the brand ("SIXTOM") lives on the
		// WebSite/Service nodes, not here, so engines don't conflate person + brand.
		alternateName: ["Sam D'Angelo", 'threesam'],
		jobTitle: site.operator.jobTitle,
		worksFor: { '@type': 'Organization', name: site.operator.currentEmployer },
		alumniOf: { '@type': 'Organization', name: site.operator.formerEmployer },
		url: site.siteUrl,
		// sameAs is the strongest entity-grounding signal for answer engines: it
		// confirms this Person is the same identity across the web. Shares
		// LinkedIn + X with threesam.com's Person node (which reciprocally lists
		// sixtom.com), so the two sites merge into one authoritative entity.
		sameAs: [
			site.gardenUrl,
			site.operator.linkedinUrl,
			site.operator.xUrl,
			site.operator.githubUrl,
			site.operator.soundcloudUrl
		]
	}
}

export function webSiteJsonLd(): WebSiteLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: 'SIXTOM',
		alternateName: ['sixtom', 'Sixtom'],
		url: site.siteUrl,
		publisher: { '@id': PERSON_ID }
	}
}

export function serviceJsonLd(): ServiceLd {
	const bookUrl = `${site.siteUrl}/book`
	const auditDescription = `a written breakdown plus a short video walkthrough of what's blocking you and whether a sprint makes sense. ${site.audit.cadence}`
	// Built from parts so the optional intro/payment fields drop cleanly when unset.
	const sprintDescription = [
		'two weeks from working-for-you to production-grade.',
		site.sprint.paymentPlan ? `${site.sprint.paymentPlan} available.` : '',
		site.sprint.introPriceUSD
			? `$${String(site.sprint.introPriceUSD)} intro for the ${site.sprint.introNote ?? 'first clients'}.`
			: '',
		site.sprint.cadence
	]
		.filter(Boolean)
		.join(' ')
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		'@id': SERVICE_ID,
		name: 'SIXTOM',
		alternateName: ['Sixtom', 'sixtom'],
		description: site.hero.subhead,
		url: site.siteUrl,
		areaServed: 'Worldwide',
		provider: { '@id': PERSON_ID },
		offers: [
			{
				'@type': 'Offer',
				name: site.audit.name,
				description: auditDescription,
				price: String(site.audit.priceUSD),
				priceCurrency: 'USD',
				availability: 'https://schema.org/InStock',
				url: bookUrl
			},
			{
				'@type': 'Offer',
				name: site.sprint.name,
				description: sprintDescription,
				price: String(site.sprint.priceUSD),
				priceCurrency: 'USD',
				availability: 'https://schema.org/LimitedAvailability',
				url: bookUrl
			}
		]
	}
}

export interface FaqPageLd {
	'@context': 'https://schema.org'
	'@type': 'FAQPage'
	'@id': string
	url: string
	mainEntity: readonly {
		'@type': 'Question'
		name: string
		acceptedAnswer: { '@type': 'Answer'; text: string }
	}[]
}

// Build a FAQPage from question/answer pairs (the /faq route). `url` is the page
// the questions are answered on; engines require the answer text be present on
// that page, which holds for /faq.
export function faqPageJsonLd(items: readonly QA[], url: string): FaqPageLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		'@id': `${url}#faq`,
		url,
		mainEntity: items.map((qa) => ({
			'@type': 'Question',
			name: qa.question,
			acceptedAnswer: { '@type': 'Answer', text: qa.answer }
		}))
	}
}

export interface BlogLd {
	'@context': 'https://schema.org'
	'@type': 'Blog'
	'@id': string
	name: string
	description: string
	url: string
	author: NodeRef
	publisher: NodeRef
}

export function blogJsonLd(description: string): BlogLd {
	const url = `${site.siteUrl}/log`
	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		'@id': BLOG_ID,
		name: 'the log',
		description,
		url,
		author: { '@id': PERSON_ID },
		publisher: { '@id': PERSON_ID }
	}
}

export interface BlogPostingLd {
	'@context': 'https://schema.org'
	'@type': 'BlogPosting'
	'@id': string
	headline: string
	description: string
	image: string
	datePublished: string
	dateModified: string
	url: string
	mainEntityOfPage: string
	author: NodeRef
	publisher: NodeRef
	isPartOf: NodeRef
}

// A log writeup as a citable article, joined to the site graph: authored and
// published by the Person, part of the /log Blog.
export function blogPostingJsonLd(entry: LogEntry): BlogPostingLd {
	const url = `${site.siteUrl}/log/${entry.slug}`
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		headline: entry.title,
		description: entry.blurb,
		image: `${site.siteUrl}${entry.heroImage}`,
		datePublished: entry.date,
		dateModified: entry.date,
		url,
		mainEntityOfPage: url,
		author: { '@id': PERSON_ID },
		publisher: { '@id': PERSON_ID },
		isPartOf: { '@id': BLOG_ID }
	}
}

const LDJSON_OPEN = '<script type="application/ld+json">'
const LDJSON_CLOSE = '</script>'

// Serialize JSON-LD nodes into <script> tags, escaping `<` so a string value can
// never break out of the script block. Shared by the layout (site-wide graph) and
// the pages that contribute their own nodes (/faq, /log, the writeup).
export function renderJsonLd(...nodes: object[]): string {
	return nodes
		.map((node) => LDJSON_OPEN + JSON.stringify(node).replace(/</g, '\\u003c') + LDJSON_CLOSE)
		.join('')
}

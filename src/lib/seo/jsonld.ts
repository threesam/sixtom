import { site, grandSlam } from '#lib/content/index.js'
import type { QA } from '#lib/content/index.js'
import type { LogEntry } from '#lib/log.js'

// Stable @id anchors so every node — Person, WebSite, Service, plus the per-page
// Article/FAQ blocks — resolves into one connected entity graph. Search and answer
// engines merge nodes that share an @id across <script> blocks and pages, so the
// writeup's author, the site's publisher, and the service's provider are all
// understood to be the same person, not three loose mentions.
const PERSON_ID = `${site.siteUrl}/#person`
const WEBSITE_ID = `${site.siteUrl}/#website`
const SERVICE_ID = `${site.siteUrl}/#service`
const ORG_ID = `${site.siteUrl}/#organization`
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
	brand: NodeRef
	offers: readonly OfferLd[]
}

export interface OrganizationLd {
	'@context': 'https://schema.org'
	'@type': 'Organization'
	'@id': string
	name: string
	alternateName: readonly string[]
	url: string
	logo: string
	image: string
	description: string
	areaServed: string
	founder: NodeRef
}

export interface BreadcrumbListLd {
	'@context': 'https://schema.org'
	'@type': 'BreadcrumbList'
	itemListElement: readonly {
		'@type': 'ListItem'
		position: number
		name: string
		item: string
	}[]
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
	// Built from parts so the optional payment plan drops cleanly when unset.
	const engagementDescription = [
		'two weeks, one team. one process written down, running and owned by a named person on your team by day 10, or the remaining payment is free.',
		site.engagement.paymentPlan ? `${site.engagement.paymentPlan}.` : '',
		site.engagement.cadence
	]
		.filter(Boolean)
		.join(' ')
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		'@id': SERVICE_ID,
		name: 'SIXTOM',
		alternateName: ['Sixtom', 'sixtom'],
		description: grandSlam.offerLine,
		url: site.siteUrl,
		areaServed: 'Worldwide',
		provider: { '@id': PERSON_ID },
		brand: { '@id': ORG_ID },
		offers: [
			{
				'@type': 'Offer',
				name: site.engagement.name,
				description: engagementDescription,
				price: String(site.engagement.priceUSD),
				priceCurrency: 'USD',
				availability: 'https://schema.org/LimitedAvailability',
				url: bookUrl
			},
			{
				'@type': 'Offer',
				name: site.teardown.longName,
				description: `a paid teardown of how your team uses AI today, ${site.teardown.creditNote} if you book one within 30 days. a 10-minute Loom and a written list of what's stuck and what i'd fix first.`,
				price: String(site.teardown.priceUSD),
				priceCurrency: 'USD',
				availability: 'https://schema.org/InStock',
				url: `${site.siteUrl}/notify`
			}
		]
	}
}

// The brand as an entity, founded by the Person. Plain Organization, not
// ProfessionalService: Google reads that as a LocalBusiness and requires a
// street address, which a remote one-person practice doesn't publish.
// ponytail: upgrade to ProfessionalService once there's an address to list.
export function organizationJsonLd(): OrganizationLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ORG_ID,
		name: 'SIXTOM',
		alternateName: ['Sixtom', 'sixtom'],
		url: site.siteUrl,
		logo: `${site.siteUrl}/apple-touch-icon.png`,
		image: `${site.siteUrl}/og.png`,
		description: grandSlam.offerLine,
		areaServed: 'Worldwide',
		founder: { '@id': PERSON_ID }
	}
}

// Home > each path segment, named by its slug ("garden-party" -> "garden party").
// The home page itself gets none: a one-item trail says nothing.
export function breadcrumbJsonLd(pathname: string): BreadcrumbListLd | null {
	const segments = pathname.split('/').filter(Boolean)
	if (segments.length === 0) return null
	const crumbs = [{ name: 'home', item: `${site.siteUrl}/` }]
	segments.forEach((segment, i) => {
		crumbs.push({
			name: segment.replace(/-/g, ' '),
			item: `${site.siteUrl}/${segments.slice(0, i + 1).join('/')}`
		})
	})
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c }))
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

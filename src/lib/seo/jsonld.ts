import { site } from '$lib/content'

interface Org {
	'@type': 'Organization'
	name: string
}

export interface PersonLd {
	'@context': 'https://schema.org'
	'@type': 'Person'
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
	name: string
	alternateName: readonly string[]
	url: string
	publisher: { '@type': 'Person'; name: string; url: string }
}

export interface ServiceLd {
	'@context': 'https://schema.org'
	'@type': 'ProfessionalService'
	name: string
	alternateName: readonly string[]
	description: string
	priceRange: string
	provider: Omit<PersonLd, '@context' | 'url' | 'sameAs'>
	offers: readonly {
		'@type': 'Offer'
		name: string
		price: string
		priceCurrency: 'USD'
	}[]
}

export function personJsonLd(): PersonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: site.operator.name,
		alternateName: ['Sixtom', 'sixtom', 'threesam'],
		jobTitle: site.operator.jobTitle,
		worksFor: { '@type': 'Organization', name: site.operator.currentEmployer },
		alumniOf: { '@type': 'Organization', name: site.operator.formerEmployer },
		url: site.siteUrl,
		sameAs: [site.gardenUrl]
	}
}

export function webSiteJsonLd(): WebSiteLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'SIXTOM',
		alternateName: ['sixtom', 'Sixtom'],
		url: site.siteUrl,
		publisher: {
			'@type': 'Person',
			name: site.operator.name,
			url: site.gardenUrl
		}
	}
}

export function serviceJsonLd(): ServiceLd {
	const provider = {
		'@type': 'Person' as const,
		name: site.operator.name,
		alternateName: ['Sixtom', 'threesam'] as const,
		jobTitle: site.operator.jobTitle,
		worksFor: { '@type': 'Organization' as const, name: site.operator.currentEmployer },
		alumniOf: { '@type': 'Organization' as const, name: site.operator.formerEmployer }
	}
	return {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		name: 'SIXTOM',
		alternateName: ['Sixtom', 'sixtom'],
		description: site.hero.subhead,
		priceRange: `$${String(site.audit.priceUSD)}–$${String(site.sprint.priceUSD)}`,
		provider,
		offers: [
			{
				'@type': 'Offer',
				name: site.audit.name,
				price: String(site.audit.priceUSD),
				priceCurrency: 'USD'
			},
			{
				'@type': 'Offer',
				name: site.sprint.name,
				price: String(site.sprint.priceUSD),
				priceCurrency: 'USD'
			}
		]
	}
}

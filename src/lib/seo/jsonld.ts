import { site } from '$lib/content'

interface Org {
	'@type': 'Organization'
	name: string
}

export interface PersonLd {
	'@context': 'https://schema.org'
	'@type': 'Person'
	name: string
	jobTitle: string
	worksFor: Org
	alumniOf: Org
	url: string
}

export interface ServiceLd {
	'@context': 'https://schema.org'
	'@type': 'ProfessionalService'
	name: string
	description: string
	priceRange: string
	provider: Omit<PersonLd, '@context' | 'url'>
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
		jobTitle: site.operator.jobTitle,
		worksFor: { '@type': 'Organization', name: site.operator.currentEmployer },
		alumniOf: { '@type': 'Organization', name: site.operator.formerEmployer },
		url: site.siteUrl
	}
}

export function serviceJsonLd(): ServiceLd {
	const provider = {
		'@type': 'Person' as const,
		name: site.operator.name,
		jobTitle: site.operator.jobTitle,
		worksFor: { '@type': 'Organization' as const, name: site.operator.currentEmployer },
		alumniOf: { '@type': 'Organization' as const, name: site.operator.formerEmployer }
	}
	return {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		name: 'Sixtom',
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

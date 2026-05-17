import { site } from '$lib/content'

type Org = { '@type': 'Organization'; name: string }

export type PersonLd = {
	'@context': 'https://schema.org'
	'@type': 'Person'
	name: string
	jobTitle: string
	worksFor: Org
	alumniOf: Org
	url: string
}

export type ServiceLd = {
	'@context': 'https://schema.org'
	'@type': 'ProfessionalService'
	name: string
	description: string
	priceRange: string
	provider: Omit<PersonLd, '@context' | 'url'>
	offers: {
		'@type': 'Offer'
		price: string
		priceCurrency: 'USD'
	}
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
	return {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		name: site.offer.name,
		description: site.offer.promise,
		priceRange: `$${site.offer.priceUSD}`,
		provider: {
			'@type': 'Person',
			name: site.operator.name,
			jobTitle: site.operator.jobTitle,
			worksFor: { '@type': 'Organization', name: site.operator.currentEmployer },
			alumniOf: { '@type': 'Organization', name: site.operator.formerEmployer }
		},
		offers: {
			'@type': 'Offer',
			price: String(site.offer.priceUSD),
			priceCurrency: 'USD'
		}
	}
}

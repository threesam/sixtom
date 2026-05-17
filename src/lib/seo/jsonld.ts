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
	offers: ReadonlyArray<{
		'@type': 'Offer'
		name: string
		price: string
		priceCurrency: 'USD'
	}>
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
		priceRange: `$${site.audit.priceUSD}–$${site.sprint.priceUSD}`,
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

import { describe, it, expect } from 'vitest'
import { personJsonLd, serviceJsonLd } from './jsonld'
import { site } from '$lib/content'

describe('JSON-LD generators', () => {
	it('personJsonLd has correct schema.org shape', () => {
		const ld = personJsonLd()
		expect(ld['@context']).toBe('https://schema.org')
		expect(ld['@type']).toBe('Person')
		expect(ld.name).toBe(site.operator.name)
		expect(ld.jobTitle).toBe(site.operator.jobTitle)
		expect(ld.worksFor).toEqual({
			'@type': 'Organization',
			name: site.operator.currentEmployer
		})
		expect(ld.alumniOf).toEqual({
			'@type': 'Organization',
			name: site.operator.formerEmployer
		})
	})

	it('serviceJsonLd has correct schema.org shape', () => {
		const ld = serviceJsonLd()
		expect(ld['@context']).toBe('https://schema.org')
		expect(ld['@type']).toBe('ProfessionalService')
		expect(ld.name).toBe(site.offer.name)
		expect(ld.priceRange).toBe(`$${site.offer.priceUSD}`)
		expect(ld.offers.price).toBe(String(site.offer.priceUSD))
		expect(ld.offers.priceCurrency).toBe('USD')
	})
})

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

	it('serviceJsonLd lists both offers (audit + sprint)', () => {
		const ld = serviceJsonLd()
		expect(ld['@context']).toBe('https://schema.org')
		expect(ld['@type']).toBe('ProfessionalService')
		expect(ld.offers).toHaveLength(2)
		expect(ld.offers[0]?.name).toBe(site.audit.name)
		expect(ld.offers[0]?.price).toBe(String(site.audit.priceUSD))
		expect(ld.offers[1]?.name).toBe(site.sprint.name)
		expect(ld.offers[1]?.price).toBe(String(site.sprint.priceUSD))
		expect(ld.priceRange).toBe(`$${String(site.audit.priceUSD)}–$${String(site.sprint.priceUSD)}`)
	})
})

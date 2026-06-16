import { describe, it, expect } from 'vitest'
import {
	personJsonLd,
	serviceJsonLd,
	webSiteJsonLd,
	faqPageJsonLd,
	blogJsonLd,
	blogPostingJsonLd,
	renderJsonLd
} from './jsonld'
import { site, FAQ } from '$lib/content'
import { LOG_ENTRIES } from '$lib/log'

describe('JSON-LD generators', () => {
	const PERSON_ID = `${site.siteUrl}/#person`

	it('personJsonLd has correct schema.org shape', () => {
		const ld = personJsonLd()
		expect(ld['@context']).toBe('https://schema.org')
		expect(ld['@type']).toBe('Person')
		expect(ld['@id']).toBe(PERSON_ID)
		expect(ld.name).toBe(site.operator.name)
		expect(ld.jobTitle).toBe(site.operator.jobTitle)
		expect(ld.alternateName).toContain('threesam')
		expect(ld.alternateName).not.toContain('Sixtom')
		expect(ld.sameAs).toContain(site.gardenUrl)
		expect(ld.sameAs).toContain(site.operator.linkedinUrl)
		expect(ld.worksFor).toEqual({
			'@type': 'Organization',
			name: site.operator.currentEmployer
		})
		expect(ld.alumniOf).toEqual({
			'@type': 'Organization',
			name: site.operator.formerEmployer
		})
	})

	it('webSiteJsonLd identifies the brand entity, attributing the person by @id', () => {
		const ld = webSiteJsonLd()
		expect(ld['@context']).toBe('https://schema.org')
		expect(ld['@type']).toBe('WebSite')
		expect(ld.name).toBe('SIXTOM')
		expect(ld.alternateName).toContain('sixtom')
		expect(ld.url).toBe(site.siteUrl)
		expect(ld.publisher['@id']).toBe(PERSON_ID)
	})

	it('serviceJsonLd lists all three offers and links the person as provider by @id', () => {
		const ld = serviceJsonLd()
		expect(ld['@context']).toBe('https://schema.org')
		expect(ld['@type']).toBe('Service')
		expect(ld.provider['@id']).toBe(PERSON_ID)
		expect(ld.areaServed).toBe('Worldwide')
		expect(ld.offers).toHaveLength(3)
		expect(ld.offers[0]?.name).toBe(site.audit.name)
		expect(ld.offers[0]?.price).toBe(String(site.audit.priceUSD))
		expect(ld.offers[0]?.availability).toBe('https://schema.org/InStock')
		expect(ld.offers[1]?.name).toBe(site.sprint.name)
		expect(ld.offers[1]?.price).toBe(String(site.sprint.priceUSD))
		expect(ld.offers[1]?.availability).toBe('https://schema.org/LimitedAvailability')
		expect(ld.offers[2]?.name).toBe(site.retainer.name)
		expect(ld.offers[2]?.price).toBe(String(site.retainer.priceUSD))
		expect(ld.offers[2]?.availability).toBe('https://schema.org/LimitedAvailability')
	})

	it('faqPageJsonLd maps Q&A pairs to a FAQPage', () => {
		const url = `${site.siteUrl}/faq`
		const ld = faqPageJsonLd(FAQ, url)
		expect(ld['@type']).toBe('FAQPage')
		expect(ld['@id']).toBe(`${url}#faq`)
		expect(ld.url).toBe(url)
		expect(ld.mainEntity).toHaveLength(FAQ.length)
		expect(ld.mainEntity[0]?.['@type']).toBe('Question')
		expect(ld.mainEntity[0]?.name).toBe(FAQ[0]?.question)
		expect(ld.mainEntity[0]?.acceptedAnswer.text).toBe(FAQ[0]?.answer)
	})

	it('blogJsonLd links author + publisher to the person/business by @id', () => {
		const ld = blogJsonLd('a description')
		expect(ld['@type']).toBe('Blog')
		expect(ld['@id']).toBe(`${site.siteUrl}/log#blog`)
		expect(ld.description).toBe('a description')
		expect(ld.author['@id']).toBe(`${site.siteUrl}/#person`)
		expect(ld.publisher['@id']).toBe(`${site.siteUrl}/#person`)
	})

	it('blogPostingJsonLd builds a graph-linked article from a log entry', () => {
		const entry = LOG_ENTRIES[0]
		if (!entry) throw new Error('expected at least one log entry')
		const url = `${site.siteUrl}/log/${entry.slug}`
		const ld = blogPostingJsonLd(entry)
		expect(ld['@type']).toBe('BlogPosting')
		expect(ld['@id']).toBe(`${url}#article`)
		expect(ld.headline).toBe(entry.title)
		expect(ld.datePublished).toBe(entry.date)
		expect(ld.image).toBe(`${site.siteUrl}${entry.heroImage}`)
		expect(ld.author['@id']).toBe(`${site.siteUrl}/#person`)
		expect(ld.publisher['@id']).toBe(`${site.siteUrl}/#person`)
		expect(ld.isPartOf['@id']).toBe(`${site.siteUrl}/log#blog`)
	})

	it('renderJsonLd wraps nodes in a script tag and escapes < to prevent breakout', () => {
		const html = renderJsonLd({ name: '</script><script>alert(1)' })
		expect(html.startsWith('<script type="application/ld+json">')).toBe(true)
		expect(html.endsWith('</script>')).toBe(true)
		// the dangerous `<` from the value must be escaped, never emitted literally
		expect(html).not.toContain('</script><script>')
		expect(html).toContain('\\u003c')
	})
})

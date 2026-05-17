import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Pins every CRO event named in docs/site-copy.md to the file that fires it.
 * If a component is renamed or an attribute drops out, this fails before
 * analytics goes silent in production.
 */
const EXPECTED: readonly { event: string; file: string; via: 'data-attr' | 'window.umami' }[] = [
	{ event: 'cta_hero_book', file: 'Hero.svelte', via: 'data-attr' },
	{ event: 'cta_audit_book', file: 'OfferSection.svelte', via: 'data-attr' },
	{ event: 'cta_sprint_book', file: 'OfferSection.svelte', via: 'data-attr' },
	{ event: 'cta_notify_submit', file: 'LeadCapture.svelte', via: 'data-attr' },
	{ event: 'notify_signup_success', file: 'LeadCapture.svelte', via: 'window.umami' },
	{ event: 'cta_garden_link', file: 'LeadCapture.svelte', via: 'data-attr' }
]

const dir = resolve(import.meta.dirname)

describe('Umami CRO event instrumentation', () => {
	for (const { event, file, via } of EXPECTED) {
		it(`fires "${event}" in ${file} (${via})`, () => {
			const contents = readFileSync(resolve(dir, file), 'utf-8')
			if (via === 'data-attr') {
				expect(contents).toContain(`data-umami-event="${event}"`)
			} else {
				expect(contents).toContain(`window.umami.track('${event}')`)
			}
		})
	}
})

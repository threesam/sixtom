import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Pins every CRO event named in docs/site-copy.md to the file that fires it.
 * If a component is renamed or an attribute drops out, this fails before
 * analytics goes silent in production.
 *
 * Five events bind to the DOM via Umami's `data-umami-event` auto-binding
 * (works without SvelteKit's client runtime). One event fires server-side
 * from the form action — that's checked separately.
 */
const COMPONENT_DIR = resolve(import.meta.dirname)
const SERVER_DIR = resolve(import.meta.dirname, '../../routes')

interface ClientEvent {
	event: string
	file: string
}

const CLIENT_EVENTS: readonly ClientEvent[] = [
	{ event: 'cta_hero_book', file: 'Hero.svelte' },
	{ event: 'cta_audit_book', file: 'OfferSection.svelte' },
	{ event: 'cta_sprint_book', file: 'OfferSection.svelte' },
	{ event: 'cta_notify_submit', file: 'LeadCapture.svelte' },
	{ event: 'cta_garden_link', file: 'LeadCapture.svelte' }
]

describe('Umami CRO event instrumentation', () => {
	for (const { event, file } of CLIENT_EVENTS) {
		it(`fires "${event}" via data-attr in ${file}`, () => {
			const contents = readFileSync(resolve(COMPONENT_DIR, file), 'utf-8')
			expect(contents).toContain(`data-umami-event="${event}"`)
		})
	}

	it('fires "notify_signup_success" server-side from the page action', () => {
		const contents = readFileSync(resolve(SERVER_DIR, '+page.server.ts'), 'utf-8')
		expect(contents).toContain("fireServerEvent('notify_signup_success'")
	})
})

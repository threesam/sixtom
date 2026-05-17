import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Pins every CRO event from docs/site-copy.md to the file that fires it,
// so a rename or refactor fails the build before analytics goes silent.
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
			// Match either a literal data-umami-event="<event>" or a dynamic
			// data-umami-event={...'<event>'...} expression so the test
			// survives ternaries / snippet refactors.
			const literalForm = `data-umami-event="${event}"`
			const dynamicForm = new RegExp(`data-umami-event=\\{[^}]*['"]${event}['"]`)
			const hit = contents.includes(literalForm) || dynamicForm.test(contents)
			expect(hit, `${file} should reference "${event}" on a data-umami-event attr`).toBe(true)
		})
	}

	it('fires "notify_signup_success" server-side from the page action', () => {
		const contents = readFileSync(resolve(SERVER_DIR, '+page.server.ts'), 'utf-8')
		expect(contents).toContain("fireServerEvent('notify_signup_success'")
	})
})

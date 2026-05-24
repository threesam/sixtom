import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Pins every CRO event to the file that fires it, so a rename or refactor
// fails the build before analytics goes silent. Paths are relative to:
//   COMPONENT_DIR — src/lib/components
//   ROUTES_DIR    — src/routes
const COMPONENT_DIR = resolve(import.meta.dirname)
const ROUTES_DIR = resolve(import.meta.dirname, '../../routes')

interface ClientEvent {
	event: string
	dir: 'component' | 'route'
	path: string
}

const CLIENT_EVENTS: readonly ClientEvent[] = [
	{ event: 'cta_hero_book', dir: 'component', path: 'Hero.svelte' },
	{ event: 'cta_garden_link', dir: 'component', path: 'SiteFooter.svelte' },
	{ event: 'cta_tax_calc', dir: 'route', path: '+page.svelte' },
	{ event: 'cta_case_study', dir: 'route', path: '+page.svelte' },
	{ event: 'cta_garden_link_why', dir: 'route', path: '+page.svelte' },
	{ event: 'cta_final_book', dir: 'route', path: '+page.svelte' },
	{ event: 'cta_notify_submit', dir: 'route', path: 'notify/+page.svelte' },
	{ event: 'cta_calc_book', dir: 'component', path: 'VibeTaxCalculator.svelte' }
]

describe('Umami CRO event instrumentation', () => {
	for (const { event, dir, path } of CLIENT_EVENTS) {
		const base = dir === 'component' ? COMPONENT_DIR : ROUTES_DIR
		const label = dir === 'component' ? `components/${path}` : `routes/${path}`
		it(`fires "${event}" via data-attr in ${label}`, () => {
			const contents = readFileSync(resolve(base, path), 'utf-8')
			// Match either a literal data-umami-event="<event>" or a dynamic
			// data-umami-event={...'<event>'...} expression so the test
			// survives ternaries / snippet refactors.
			const literalForm = `data-umami-event="${event}"`
			const dynamicForm = new RegExp(`data-umami-event=\\{[^}]*['"]${event}['"]`)
			// CTAs may delegate rendering to <BookCta event="…">, which emits the
			// data-umami-event attr; the owning file then pins the event string via
			// the prop. Accept that form too (BookCta's wiring is pinned below).
			const propForm = `event="${event}"`
			const hit =
				contents.includes(literalForm) || dynamicForm.test(contents) || contents.includes(propForm)
			expect(hit, `${label} should reference "${event}" on a data-umami-event attr`).toBe(true)
		})
	}

	it('BookCta wires data-umami-event to its event prop', () => {
		const contents = readFileSync(resolve(COMPONENT_DIR, 'BookCta.svelte'), 'utf-8')
		expect(contents).toContain('data-umami-event={event}')
	})

	it('fires "notify_signup_success" server-side from the notify action', () => {
		const contents = readFileSync(resolve(ROUTES_DIR, 'notify/+page.server.ts'), 'utf-8')
		expect(contents).toContain("fireServerEvent('notify_signup_success'")
	})
})

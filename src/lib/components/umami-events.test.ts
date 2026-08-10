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
	{ event: 'cta_hero_waitlist', dir: 'component', path: 'Hero.svelte' },
	{ event: 'cta_hero_teardown', dir: 'component', path: 'Hero.svelte' },
	{ event: 'cta_garden_link', dir: 'component', path: 'SiteFooter.svelte' },
	{ event: 'cta_tax_calc', dir: 'route', path: '+page.svelte' },
	{ event: 'cta_waitlist_submit', dir: 'route', path: '+page.svelte' },
	{ event: 'cta_faq_book', dir: 'route', path: 'faq/+page.svelte' },
	{ event: 'cta_notify_submit', dir: 'route', path: 'notify/+page.svelte' },
	{ event: 'cta_calc_book', dir: 'component', path: 'VibeTaxCalculator.svelte' },
	{ event: 'cta_case_study_book', dir: 'route', path: 'log/garden-party/+page.svelte' },
	{ event: 'case_study_garden_link', dir: 'route', path: 'log/garden-party/+page.svelte' },
	{ event: 'case_study_github_link', dir: 'route', path: 'log/garden-party/+page.svelte' },
	// These three are read directly by infra's Monday brief.py (ev.get('book_step_next'),
	// ev.get('book_submit'), ev.get('book_qualified_booking_click')) — a rename here previously
	// went silent in this repo's own tests but would break that external consumer. Pinned so a
	// rename fails here before the digest quietly zeroes out.
	{ event: 'book_step_next', dir: 'route', path: 'book/+page.svelte' },
	{ event: 'book_submit', dir: 'route', path: 'book/+page.svelte' },
	{ event: 'book_qualified_booking_click', dir: 'route', path: 'book/+page.svelte' },
	{ event: 'footer_home', dir: 'component', path: 'SiteFooter.svelte' },
	{ event: 'footer_log', dir: 'component', path: 'SiteFooter.svelte' },
	{ event: 'footer_faq', dir: 'component', path: 'SiteFooter.svelte' },
	{ event: 'footer_notify', dir: 'component', path: 'SiteFooter.svelte' },
	{ event: 'footer_privacy', dir: 'component', path: 'SiteFooter.svelte' },
	{ event: 'footer_terms', dir: 'component', path: 'SiteFooter.svelte' }
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

	it('fires "notify_signup_success" only for signups that reach the list', () => {
		const contents = readFileSync(resolve(ROUTES_DIR, 'notify/+page.server.ts'), 'utf-8')
		// Presence is not enough — it was present before and still wrong. The
		// event has to sit inside the same guard as the listmonk write, or
		// honeypot/time-trap fakes (ok + suspicious, silent 200 by design) get
		// counted as signups: 41 events against 3 subscribers over 30d.
		const guardStart = contents.indexOf('if (!result.suspicious')
		expect(guardStart, 'suspicious guard not found').toBeGreaterThan(-1)
		// Walk to the guard's OWN closing brace. Slicing to the `return`
		// instead looks equivalent and is not: it also swallows everything
		// between the closing brace and the return, which is exactly where the
		// bug used to live, so that version of this test passed on the bug.
		let depth = 0
		let guardEnd = contents.indexOf('{', guardStart)
		for (let i = guardEnd; i < contents.length; i++) {
			if (contents[i] === '{') depth++
			else if (contents[i] === '}' && --depth === 0) {
				guardEnd = i
				break
			}
		}
		const guarded = contents.slice(guardStart, guardEnd)
		expect(guarded).toContain('subscribeToList(')
		expect(guarded).toContain("fireServerEvent('notify_signup_success'")
	})
})

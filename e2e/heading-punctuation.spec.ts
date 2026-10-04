import { expect, test } from '@playwright/test'

// House style: a heading never ends on a period (or a comma, colon or semicolon).
// A question keeps its question mark. Checked as rendered, so display-time
// trimming (the hero, the proof title) counts.
const ROUTES = [
	'/',
	'/book',
	'/faq',
	'/terms',
	'/privacy',
	'/accessibility',
	'/log',
	'/notify',
	'/nope'
]
for (const route of ROUTES) {
	test(`no heading ends on a period at ${route}`, async ({ page }) => {
		await page.goto(route)
		const headings = await page.evaluate(() =>
			[...document.querySelectorAll<HTMLElement>('h1, h2, h3, h4')].map((heading) =>
				heading.innerText.replace(/\s+/g, ' ').trim()
			)
		)
		expect(headings.length).toBeGreaterThan(0)
		expect(headings.filter((text) => /[.,;:]$/.test(text))).toEqual([])
	})
}

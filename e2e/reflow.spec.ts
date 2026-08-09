import { expect, test } from '@playwright/test'

// WCAG 1.4.10 (Reflow): content must not require scrolling in two directions at
// 320px with text scaled to 200%. This regressed silently once already — the
// ledger's price column was shrink-0 next to a label that could not shrink
// below its longest word, so the page scrolled sideways by 119px.
const ROUTES = ['/', '/faq', '/terms', '/notify', '/accessibility', '/tax']

test.describe('reflow at 320px / 200% text', () => {
	test.use({ viewport: { width: 320, height: 568 } })

	for (const route of ROUTES) {
		test(`${route} does not scroll horizontally`, async ({ page }) => {
			await page.goto(route)
			await page.addStyleTag({ content: 'html { font-size: 200% }' })
			await page.evaluate(() => document.fonts.ready)

			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth
			)
			expect(
				overflow,
				`${route} overflows by ${String(overflow)}px at 200% text`
			).toBeLessThanOrEqual(0)
		})
	}
})

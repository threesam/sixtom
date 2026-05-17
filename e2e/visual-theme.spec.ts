import { test, expect } from '@playwright/test'

test.describe('Visual theme parity', () => {
	// Sample one pixel from each section's surface to prove the dark backgrounds
	// are now actually identical — no more seams between Hero / thesis / OfferSection /
	// LeadCapture / marquee bar.
	for (const scheme of ['dark', 'light'] as const) {
		test(`${scheme}: every section surface resolves to the same color`, async ({ browser }) => {
			const context = await browser.newContext({ colorScheme: scheme })
			const page = await context.newPage()
			await page.setViewportSize({ width: 1280, height: 720 })
			await page.goto('/')

			const sections = await page.locator('section').all()
			expect(sections.length).toBeGreaterThanOrEqual(4)

			const colors = await Promise.all(
				sections.map((s) =>
					s.evaluate((el) => {
						const cs = getComputedStyle(el)
						return cs.backgroundColor
					})
				)
			)

			// All sections must share one surface color.
			const distinct = new Set(colors)
			expect(distinct.size, `expected one surface, got: ${[...distinct].join(', ')}`).toBe(1)

			await context.close()
		})

		test(`${scheme}: marquee bar uses the same surface as its parent section`, async ({
			browser
		}) => {
			const context = await browser.newContext({ colorScheme: scheme })
			const page = await context.newPage()
			await page.setViewportSize({ width: 1280, height: 720 })
			await page.goto('/')

			const sectionBg = await page
				.locator('section')
				.last()
				.evaluate((el) => getComputedStyle(el).backgroundColor)
			const marqueeBg = await page
				.locator('[aria-label="Mission marquee"]')
				.evaluate((el) => getComputedStyle(el).backgroundColor)

			expect(marqueeBg).toBe(sectionBg)
			await context.close()
		})

		test(`${scheme}: full-page screenshot`, async ({ browser }) => {
			const context = await browser.newContext({ colorScheme: scheme })
			const page = await context.newPage()
			await page.setViewportSize({ width: 1280, height: 800 })
			await page.goto('/', { waitUntil: 'networkidle' })

			// Freeze animations so the screenshot is deterministic.
			await page.addStyleTag({
				content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`
			})

			await expect(page).toHaveScreenshot(`home-${scheme}.png`, {
				fullPage: true,
				maxDiffPixelRatio: 0.02
			})
			await context.close()
		})
	}
})

import { test, expect, type Browser } from '@playwright/test'

const SCHEMES = ['dark', 'light'] as const
type Scheme = (typeof SCHEMES)[number]

async function openPage(browser: Browser, scheme: Scheme, width = 1280, height = 720) {
	const context = await browser.newContext({ colorScheme: scheme })
	const page = await context.newPage()
	// Freeze animations BEFORE the page mounts so screenshots are deterministic.
	await page.addInitScript(() => {
		const style = document.createElement('style')
		style.textContent = `*, *::before, *::after {
			animation-duration: 0s !important;
			transition-duration: 0s !important;
		}`
		document.documentElement.appendChild(style)
	})
	await page.setViewportSize({ width, height })
	return { context, page }
}

test.describe('Visual theme parity', () => {
	for (const scheme of SCHEMES) {
		test(`${scheme}: every section surface resolves to the same color`, async ({ browser }) => {
			const { context, page } = await openPage(browser, scheme)
			await page.goto('/', { waitUntil: 'domcontentloaded' })

			const sections = await page.locator('section').all()
			expect(sections.length).toBeGreaterThanOrEqual(4)

			const colors = await Promise.all(
				sections.map((s) => s.evaluate((el) => getComputedStyle(el).backgroundColor))
			)
			const distinct = new Set(colors)
			expect(distinct.size, `expected one surface, got: ${[...distinct].join(', ')}`).toBe(1)

			await context.close()
		})

		test(`${scheme}: marquee bar uses the same surface as its parent section`, async ({
			browser
		}) => {
			const { context, page } = await openPage(browser, scheme)
			await page.goto('/', { waitUntil: 'domcontentloaded' })

			const marquee = page.locator('[aria-label="Mission marquee"]')
			const sectionBg = await marquee
				.locator('xpath=ancestor::section[1]')
				.evaluate((el) => getComputedStyle(el).backgroundColor)
			const marqueeBg = await marquee.evaluate((el) => getComputedStyle(el).backgroundColor)
			expect(marqueeBg).toBe(sectionBg)

			await context.close()
		})

		// Pixel-diff baselines are platform-sensitive (font hinting, AA) and are
		// committed only for darwin today. Skip on other platforms until CI runs
		// a matching baseline; the per-section color test above is the regression guard.
		test(`${scheme}: full-page screenshot`, async ({ browser }) => {
			test.skip(process.platform !== 'darwin', 'darwin-only baselines committed')
			const { context, page } = await openPage(browser, scheme, 1280, 800)
			await page.goto('/', { waitUntil: 'domcontentloaded' })
			await expect(page.locator('section').first()).toBeVisible()

			await expect(page).toHaveScreenshot(`home-${scheme}.png`, {
				fullPage: true,
				maxDiffPixelRatio: 0.005
			})
			await context.close()
		})
	}
})

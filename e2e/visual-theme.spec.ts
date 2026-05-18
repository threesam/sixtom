import { test, expect, type Browser } from '@playwright/test'

async function openPage(browser: Browser, width = 1280, height = 720) {
	const context = await browser.newContext({ colorScheme: 'dark' })
	const page = await context.newPage()
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

test.describe('Visual surface — dark/light alternation', () => {
	test('sections alternate D L D L, first dark, marquee dark', async ({ browser }) => {
		const { context, page } = await openPage(browser)
		await page.goto('/', { waitUntil: 'domcontentloaded' })

		const sections = await page.locator('section').all()
		expect(sections.length).toBe(4)

		const surfaces = await Promise.all(
			sections.map((s) => s.evaluate((el) => getComputedStyle(el).backgroundColor))
		)

		// Sections should pair up: 1 == 3 (dark) and 2 == 4 (light). Two distinct values total.
		const distinct = new Set(surfaces)
		expect(distinct.size, `expected 2 alternating surfaces, got ${[...distinct].join(' | ')}`).toBe(
			2
		)
		expect(surfaces[0]).toBe(surfaces[2])
		expect(surfaces[1]).toBe(surfaces[3])
		expect(surfaces[0]).not.toBe(surfaces[1])

		// Marquee link (inside the last UV section) is explicitly dark — visual close on dark.
		const marqueeBg = await page
			.locator('[data-umami-event="cta_garden_link"]')
			.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(marqueeBg).toBe(surfaces[0])

		await context.close()
	})

	test('full-page screenshot', async ({ browser }) => {
		test.skip(process.platform !== 'darwin', 'darwin-only baselines committed')
		const { context, page } = await openPage(browser, 1280, 800)
		await page.goto('/', { waitUntil: 'domcontentloaded' })
		await expect(page.locator('section').first()).toBeVisible()

		await expect(page).toHaveScreenshot('home.png', {
			fullPage: true,
			maxDiffPixelRatio: 0.005
		})
		await context.close()
	})
})

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
	test('grand-slam page: 8 sections alternate dark/UV, first dark', async ({ browser }) => {
		const { context, page } = await openPage(browser)
		await page.goto('/', { waitUntil: 'domcontentloaded' })

		// hero → wall → ledger → guarantee → proof → is-this-you → timeline → close
		const sections = await page.locator('section').all()
		expect(sections.length).toBe(8)

		const surfaces = await Promise.all(
			sections.map((s) => s.evaluate((el) => getComputedStyle(el).backgroundColor))
		)

		// Strict D U D U D U D U — two distinct surfaces, alternating, first dark.
		const distinct = new Set(surfaces)
		expect(distinct.size, `expected 2 alternating surfaces, got ${[...distinct].join(' | ')}`).toBe(
			2
		)
		for (let i = 2; i < surfaces.length; i++) {
			expect(surfaces[i], `section ${String(i)} should match section ${String(i - 2)}`).toBe(
				surfaces[i - 2]
			)
		}
		expect(surfaces[0]).not.toBe(surfaces[1])

		// Footer (inside the closing UV section) keeps its explicit dark surface —
		// the page opens dark and visually closes dark.
		const footerBg = await page
			.locator('footer')
			.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(footerBg).toBe(surfaces[0])

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

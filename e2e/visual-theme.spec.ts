import { test, expect, type Browser } from '@playwright/test'

async function openPage(browser: Browser, width = 1280, height = 720) {
	const context = await browser.newContext({ colorScheme: 'dark' })
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

test.describe('Visual surface parity (dark-only)', () => {
	test('every section surface resolves to the same color', async ({ browser }) => {
		const { context, page } = await openPage(browser)
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

	test('marquee bar uses the same surface as its parent section', async ({ browser }) => {
		const { context, page } = await openPage(browser)
		await page.goto('/', { waitUntil: 'domcontentloaded' })

		const marquee = page.locator('[aria-label="Mission marquee"]')
		const sectionBg = await marquee
			.locator('xpath=ancestor::section[1]')
			.evaluate((el) => getComputedStyle(el).backgroundColor)
		const marqueeBg = await marquee.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(marqueeBg).toBe(sectionBg)

		await context.close()
	})

	// Pixel baseline is platform-sensitive (font hinting, AA). Committed for darwin only;
	// the per-section color test above is the actual regression guard.
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

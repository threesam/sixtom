/// <reference types="node" />
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

test.describe('Visual surface — dark/light order', () => {
	test('grand-slam page: dark sections in pairs around each light one', async ({ browser }) => {
		const { context, page } = await openPage(browser)
		await page.goto('/', { waitUntil: 'domcontentloaded' })

		// hero → wall → ledger → guarantee → proof → is-this-you → timeline → close
		const sections = await page.locator('section').all()
		expect(sections.length).toBe(8)

		const surfaces = await Promise.all(
			sections.map((s) => s.evaluate((el) => getComputedStyle(el).backgroundColor))
		)

		// Dark in pairs around each light section: hero + wall, ledger, guarantee +
		// proof, is-this-you, timeline + close. Two surfaces, no third.
		expect(new Set(surfaces).size).toBe(2)
		expect(surfaces.map((surface) => (surface === surfaces[0] ? 'D' : 'U')).join('')).toBe(
			'DDUDDUDD'
		)

		// The page opens and closes on a bubble field.
		await expect(sections[7].locator('canvas[data-bubble]')).toHaveCount(1)
		await expect(sections[0].locator('canvas[data-bubble]')).toHaveCount(1)

		// SiteFooter sits on the same dark surface. Scoped selector: the
		// testimonial blockquote also contains a <footer> (attribution).
		const footerBg = await page
			.locator('footer', { has: page.locator('[data-umami-event="footer_home"]') })
			.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(footerBg).toBe(surfaces[0])

		await context.close()
	})

	test('full-page screenshot', async ({ browser }) => {
		test.skip(process.platform !== 'darwin', 'darwin-only baselines committed')
		const { context, page } = await openPage(browser, 1280, 800)
		await page.goto('/', { waitUntil: 'domcontentloaded' })
		await expect(page.locator('section').first()).toBeVisible()

		// The hero bubble canvas is JS-animated (rAF), so two consecutive captures
		// never match — hide the decorative layer for a deterministic screenshot.
		await page.addStyleTag({ content: '[data-bubble] { display: none !important; }' })

		await expect(page).toHaveScreenshot('home.png', {
			fullPage: true,
			maxDiffPixelRatio: 0.005
		})
		await context.close()
	})
})

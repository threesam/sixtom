import { test, expect } from '@playwright/test'

const TEST_EMAIL = 'e2e@test.sixtom.local'

test.describe('Notify form — progressive enhancement', () => {
	test('JS-enhanced path: inline "Sending…" then inline success without page reload', async ({
		page
	}) => {
		await page.goto('/')

		// Wait for the lazy enhancement script to have stamped formStartedAt.
		await expect(page.locator('[data-form-started-at]')).toHaveAttribute('value', /^\d+$/)
		await expect(page.locator('[data-form-enhanced]')).toHaveAttribute('value', '1')

		// Time-trap requires >= 3s between page load and submit.
		await page.waitForTimeout(3200)

		const url = page.url()
		await page.fill('input[type="email"]', TEST_EMAIL)

		const [response] = await Promise.all([
			page.waitForResponse((r) => r.url().includes('/?/notify') && r.request().method() === 'POST'),
			page.click('button[type="submit"]')
		])
		expect(response.status()).toBe(200)

		// No navigation should have happened — the script intercepted submit.
		expect(page.url()).toBe(url)

		await expect(page.locator('[data-enhance-result] p')).toHaveText(/you're on the list/i)
	})

	test('no-JS path: native form POST renders server-side success on reload', async ({
		browser
	}) => {
		const context = await browser.newContext({ javaScriptEnabled: false })
		const page = await context.newPage()
		await page.goto('/', { waitUntil: 'domcontentloaded' })

		await page.fill('input[type="email"]', TEST_EMAIL)
		// force:true because the marquee CSS animation can briefly trip Playwright's
		// stability check; the button itself is interactable.
		await Promise.all([
			page.waitForLoadState('load'),
			page.locator('button[type="submit"]').click({ force: true })
		])

		// With JS off the time-trap is skipped (enhanced flag isn't set) — request reaches the action.
		await expect(page.locator('[data-enhance-result] p')).toHaveText(/you're on the list/i)
		await context.close()
	})

	test('honeypot: filled `company` returns silent success', async ({ page }) => {
		await page.goto('/')
		await page.waitForTimeout(3200)

		await page.fill('input[type="email"]', TEST_EMAIL)
		await page.locator('input[name="company"]').evaluate((el: HTMLInputElement) => {
			el.value = 'AcmeCorp'
		})

		const [response] = await Promise.all([
			page.waitForResponse((r) => r.url().includes('/?/notify')),
			page.click('button[type="submit"]')
		])
		expect(response.status()).toBe(200)

		await expect(page.locator('[data-enhance-result] p')).toHaveText(/you're on the list/i)
	})

	test('malformed email: server rejects with inline error', async ({ page }) => {
		await page.goto('/')
		await page.waitForTimeout(3200)

		// Override the input type so the browser's HTML5 validation lets us submit a bad value.
		await page.locator('input[type="email"]').evaluate((el: HTMLInputElement) => {
			el.setAttribute('type', 'text')
		})
		await page.fill('input[name="email"]', 'not-an-email')

		await Promise.all([
			page.waitForResponse((r) => r.url().includes('/?/notify')),
			page.click('button[type="submit"]')
		])

		await expect(page.locator('[data-enhance-result] p')).toHaveText(/invalid/i)
	})

	test('all 5 marquee copies are rendered (no empty space on wide viewports)', async ({ page }) => {
		await page.setViewportSize({ width: 2400, height: 800 })
		await page.goto('/')
		const tracks = page.locator('.marquee-track > div')
		await expect(tracks).toHaveCount(6)
	})
})

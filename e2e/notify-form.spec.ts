import { test, expect } from '@playwright/test'
import { TEST_EMAIL } from './constants'

test.describe('Notify form — progressive enhancement', () => {
	test('JS-enhanced path: inline result without page reload', async ({ page }) => {
		await page.goto('/')

		await expect(page.locator('[data-form-started-at]')).toHaveAttribute('value', /^\d+$/)
		await expect(page.locator('[data-form-enhanced]')).toHaveAttribute('value', '1')

		const url = page.url()
		await page.fill('input[type="email"]', TEST_EMAIL)

		const [response] = await Promise.all([
			page.waitForResponse((r) => r.url().includes('/?/notify') && r.request().method() === 'POST'),
			page.click('button[type="submit"]')
		])
		expect(response.status()).toBe(200)
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

		await expect(page.locator('[data-enhance-result] p')).toHaveText(/you're on the list/i)
		await context.close()
	})

	test('honeypot: filled `company` returns silent success', async ({ page }) => {
		await page.goto('/')

		// Non-bypass email so we exercise the honeypot path itself, not the test-email shortcut.
		await page.fill('input[type="email"]', 'real-looking@example.com')
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

	test('marquee renders multiple copies for seamless tiling on wide viewports', async ({
		page
	}) => {
		await page.setViewportSize({ width: 2400, height: 800 })
		await page.goto('/')
		const copies = page.locator('[data-marquee-copy]')
		// At least 4 covers most laptop viewports; the component picks the exact count.
		await expect(copies).toHaveCount(6)
	})
})

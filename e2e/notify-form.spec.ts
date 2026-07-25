import { test, expect } from '@playwright/test'
import { TEST_EMAIL } from './constants'

test.describe('waitlist form', () => {
	test('home form (no JS by design): native POST lands on /notify with success', async ({
		browser
	}) => {
		const context = await browser.newContext({ javaScriptEnabled: false })
		const page = await context.newPage()
		await page.goto('/', { waitUntil: 'domcontentloaded' })
		await page.fill('#waitlist-email', TEST_EMAIL)
		await page.fill('#waitlist-build', 'a demo of a thing. it works, but…')
		// force: with JS disabled the animation-freezing init script can't run, so
		// the footer marquee's CSS animation trips Playwright's stability check.
		// The button itself is interactable; force skips the stability wait.
		await Promise.all([
			page.waitForURL(/\/notify/),
			page.locator('#waitlist button[type="submit"]').click({ force: true })
		])
		await expect(page.locator('[aria-live="polite"] p')).toHaveText(/you're on the list/i)
		await context.close()
	})

	test('/notify JS-enhanced path: inline result without navigation', async ({ page }) => {
		await page.goto('/notify')
		const url = page.url()
		await page.fill('input[name="email"]', TEST_EMAIL)
		await page.fill('textarea[name="message"]', 'a demo of a thing. it works, but…')
		const [response] = await Promise.all([
			page.waitForResponse(
				(r) => r.url().includes('/notify?/notify') && r.request().method() === 'POST'
			),
			page.click('button[type="submit"]')
		])
		expect(response.status()).toBe(200)
		expect(page.url()).toBe(url)
		await expect(page.locator('[aria-live="polite"] p')).toHaveText(/you're on the list/i)
	})

	test('honeypot: filled `company` returns silent success', async ({ page }) => {
		await page.goto('/notify')
		// Non-bypass email so we exercise the honeypot path, not the test-email shortcut.
		await page.fill('input[name="email"]', 'real-looking@example.com')
		await page.fill('textarea[name="message"]', 'looks legit')
		await page.locator('input[name="company"]').evaluate((el: HTMLInputElement) => {
			el.value = 'AcmeCorp'
		})
		await page.click('button[type="submit"]')
		await expect(page.locator('[aria-live="polite"] p')).toHaveText(/you're on the list/i)
	})
})

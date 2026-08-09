import { expect, test } from '@playwright/test'

// The credit claim on the home page is unqualified ("credited in full against
// the sprint") while /terms bounds it to 90 days, so the disclosure is what
// keeps the marketing line honest. The home route ships no client JS, so it
// leans entirely on the native popover — if that ever regresses to needing
// script, the condition silently disappears for the visitor.
test.describe('teardown credit terms disclosure', () => {
	test.use({ javaScriptEnabled: false })

	test('discloses the 90-day condition and links to terms, without JS', async ({ page }) => {
		await page.goto('/')
		const trigger = page.locator('button[popovertarget="credit-terms"]')
		const panel = page.locator('#credit-terms')

		await expect(panel).toBeHidden()

		await trigger.click()
		await expect(panel).toBeVisible()
		await expect(panel).toContainText('90 days')
		await expect(panel.locator('a')).toHaveAttribute('href', '/terms')

		await page.keyboard.press('Escape')
		await expect(panel).toBeHidden()
	})

	test('the trigger names itself as a terms disclosure', async ({ page }) => {
		await page.goto('/')
		// The visible phrase must stay inside the accessible name (WCAG 2.5.3),
		// with the screen-reader-only suffix explaining what activating it does.
		await expect(page.locator('button[popovertarget="credit-terms"]')).toHaveAccessibleName(
			/credited in full against the sprint.*see terms/
		)
	})
})

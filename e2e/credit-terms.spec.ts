import { expect, test, type Page } from '@playwright/test'

// The credit claim on the home page is unqualified ("credited in full against
// the sprint") while /terms bounds it to 90 days, so the disclosure is what
// keeps the marketing line honest. The home route ships no client JS, so it
// leans entirely on the native popover — if that ever regresses to needing
// script, the condition silently disappears for the visitor.
// Selected by role and accessible name, not by id — the panel id is generated
// per instance, and this is what a user actually perceives.
const trigger = (page: Page) =>
	page.getByRole('button', { name: /credited in full against the sprint/ })
const panel = (page: Page) => page.getByText(/credited against the sprint if you book one/)

test.describe('teardown credit terms disclosure', () => {
	test.use({ javaScriptEnabled: false })

	for (const route of ['/', '/notify']) {
		test(`${route} discloses the 90-day condition and links to terms, without JS`, async ({
			page
		}) => {
			await page.goto(route)
			await expect(panel(page)).toBeHidden()

			await trigger(page).click()
			await expect(panel(page)).toBeVisible()
			await expect(panel(page)).toContainText('90 days')
			await expect(page.getByRole('link', { name: /read the full terms/ })).toHaveAttribute(
				'href',
				'/terms'
			)

			await page.keyboard.press('Escape')
			await expect(panel(page)).toBeHidden()
		})
	}

	test('the trigger names itself as a terms disclosure', async ({ page }) => {
		await page.goto('/')
		// The visible phrase must stay inside the accessible name (WCAG 2.5.3),
		// with the screen-reader-only suffix explaining what activating it does.
		await expect(trigger(page)).toHaveAccessibleName(
			/credited in full against the sprint.*see terms/
		)
	})
})

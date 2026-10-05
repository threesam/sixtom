import { expect, test } from '@playwright/test'

// Every CTA is a .btn-accent, and the hover state lives on that one class: a
// pointer cursor at rest, then brighter, glowing and lifted a pixel under the
// mouse. Checked on a link CTA (the hero) and a button CTA (the waitlist form).
const CTAS = [
	{ name: 'hero link', selector: 'a.btn-accent' },
	{ name: 'waitlist button', selector: '#waitlist button.btn-accent' }
]
for (const { name, selector } of CTAS) {
	test(`${name} has a hover state`, async ({ page }) => {
		await page.goto('/')
		const cta = page.locator(selector).first()
		await cta.scrollIntoViewIfNeeded()
		await expect(cta).toHaveCSS('cursor', 'pointer')
		await expect(cta).toHaveCSS('filter', 'none')
		await cta.hover()
		await expect(cta).toHaveCSS('filter', 'brightness(1.1)')
		await expect(cta).toHaveCSS('translate', '0px -1px')
		await expect(cta).not.toHaveCSS('box-shadow', 'none')
	})
}

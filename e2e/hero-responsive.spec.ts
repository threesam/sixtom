import { expect, test } from '@playwright/test'

// The hero's two beats ARE the hook — if either wraps, it renders as four
// orphaned fragments and the structure is lost. The mobile type scale is tuned
// to the narrowest supported viewport against the current headline, so editing
// grandSlam.headline can silently break it. 320px is the narrowest phone we
// support; if this fails after a copy change, lower the mobile clamp rather
// than accepting the wrap.
test.describe('hero headline', () => {
	test.use({ viewport: { width: 320, height: 568 } })

	test('each beat stays on one line at 320px', async ({ page }) => {
		await page.goto('/')
		// The assertion is a text-metric measurement, so it is only meaningful once
		// the real face is swapped in — against the fallback it measures nothing.
		await page.evaluate(() => document.fonts.ready)
		const linesPerBeat = await page.evaluate(() =>
			[...document.querySelectorAll('h1 > span')].map((el) => {
				const range = document.createRange()
				range.selectNodeContents(el)
				return range.getClientRects().length
			})
		)

		expect(linesPerBeat).toHaveLength(2)
		expect(linesPerBeat).toEqual([1, 1])
	})
})

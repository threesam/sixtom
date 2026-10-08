import { expect, test } from '@playwright/test'

// SIX, TO and M share one baseline, and the square behind TO is centered on the
// cap band. Moving the square with a transform and moving the letters back with
// another one rounded apart in Firefox and sat TO a pixel low, so the offset
// has to come from layout: no transform on the chip or on anything inside it.
test('wordmark: TO sits on the baseline of SIX and M, with no transforms', async ({ page }) => {
	await page.goto('/')
	const mark = await page.locator('footer a.wordmark').evaluate((a) => {
		const text = (el: Element) => {
			const range = document.createRange()
			range.selectNodeContents(el)
			return range.getBoundingClientRect()
		}
		const [six, chip, m] = a.children
		const to = chip.firstElementChild
		if (!to) throw new Error('wordmark chip has no letters')
		const square = chip.getBoundingClientRect()
		const letters = text(to)
		return {
			tops: [text(six).top, letters.top, text(m).top],
			moved: [chip, to].map((el) => {
				const style = getComputedStyle(el)
				return `${style.translate} ${style.transform}`
			}),
			width: square.width,
			height: square.height,
			// Cabinet's 1em line box centers 0.04em below the middle of its caps.
			offCenter:
				(square.top + square.bottom) / 2 -
				((letters.top + letters.bottom) / 2 - 0.04 * parseFloat(getComputedStyle(a).fontSize))
		}
	})
	expect(mark.tops[1]).toBe(mark.tops[0])
	expect(mark.tops[2]).toBe(mark.tops[0])
	expect(mark.moved).toEqual(['none none', 'none none'])
	expect(mark.width).toBeCloseTo(mark.height, 1)
	expect(Math.abs(mark.offCenter)).toBeLessThan(0.5)
})

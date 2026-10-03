import { expect, test } from '@playwright/test'

// The proof stats are three cutouts of one bubble field. The layout's whole
// point is that the first stat sits on the text column's left edge at every
// width, with the outer tiles bleeding to the viewport edges; the padding that
// does it is arithmetic in a class string, so a tweak can quietly break it.
for (const width of [320, 393, 1280]) {
	test(`proof stats line up with the text column at ${String(width)}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 })
		await page.goto('/')
		await page.evaluate(() => document.fonts.ready)
		// bubbles.js sizes a canvas when it initialises it (from a ResizeObserver, so
		// not synchronously); 300 is the untouched default. Times out if the band's
		// canvas is never picked up.
		await page.waitForFunction(() =>
			[...document.querySelectorAll('canvas')].every((canvas) => canvas.width !== 300)
		)

		const band = await page.evaluate(() => {
			const textBox = (el: Element) => {
				const range = document.createRange()
				range.selectNodeContents(el)
				return range.getBoundingClientRect()
			}
			const dl = [...document.querySelectorAll('dl')].find((el) =>
				el.textContent.includes('people onboarded')
			)
			if (!dl) throw new Error('proof stats not found')
			const section = dl.closest('section')
			const heading = section?.querySelector('h2')
			if (!heading) throw new Error('proof heading not found')
			const tiles = [...dl.children].map((tile) => {
				const value = tile.querySelector('dd')
				const label = tile.querySelector('dt')
				if (!value || !label) throw new Error('stat is missing its value or label')
				const box = tile.getBoundingClientRect()
				return {
					left: box.left,
					right: box.right,
					valueLeft: textBox(value).left,
					valueTop: textBox(value).top,
					labelRight: textBox(label).right
				}
			})
			return {
				headingLeft: textBox(heading).left,
				viewport: document.documentElement.clientWidth,
				tiles
			}
		})

		expect(band.tiles).toHaveLength(3)
		const [first, middle, last] = band.tiles
		expect(first.valueLeft).toBeCloseTo(band.headingLeft, 0)
		expect(first.left).toBe(0)
		expect(last.right).toBeCloseTo(band.viewport, 0)
		for (const tile of band.tiles) {
			expect(tile.valueTop).toBeCloseTo(first.valueTop, 0)
			expect(tile.labelRight).toBeLessThanOrEqual(tile.right)
		}
		// Gaps are the page gutter; under 360px they close into one solid band.
		expect(middle.left - first.right).toBeCloseTo(width < 360 ? 0 : 24, 0)
	})
}

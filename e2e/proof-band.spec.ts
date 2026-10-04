import { expect, test } from '@playwright/test'

// The proof stats are three squares, each a window onto one bubble field, each
// stat centered in its square, each square stepped down from the last. On
// phones the row is full-bleed and the step is one page gutter. From md up the
// first square starts on the heading's left edge, the row runs past the text
// column into the right margin, and the step is a quarter of a tile. The
// squares, the gaps and the step all hang on class strings and one mask rule,
// so a tweak can quietly break them. 500px is where an uncapped label would fit
// on one line while its neighbour wraps.
// The last case is WCAG reflow (320px, text at 200%): a centered stat that
// outgrows its square spills off the screen edge instead of scrolling.
const CASES = [
	{ width: 320, zoom: false },
	{ width: 393, zoom: false },
	{ width: 500, zoom: false },
	{ width: 1280, zoom: false },
	{ width: 320, zoom: true }
]
for (const { width, zoom } of CASES) {
	const name = `${String(width)}px${zoom ? ' / 200% text' : ''}`
	test(`proof stats are centered squares at ${name}`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 })
		await page.goto('/')
		if (zoom) await page.addStyleTag({ content: 'html { font-size: 200% }' })
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
			const heading = dl.closest('section')?.querySelector('h2')
			if (!heading) throw new Error('proof heading not found')
			const tiles = [...dl.children].map((tile) => {
				const value = tile.querySelector('dd')
				const label = tile.querySelector('dt')
				if (!value || !label) throw new Error('stat is missing its value or label')
				const box = tile.getBoundingClientRect()
				const valueBox = textBox(value)
				const labelBox = textBox(label)
				return {
					left: box.left,
					right: box.right,
					top: box.top,
					width: box.width,
					height: box.height,
					center: box.left + box.width / 2,
					valueCenter: valueBox.left + valueBox.width / 2,
					valueLeft: valueBox.left,
					valueRight: valueBox.right,
					valueTop: valueBox.top,
					labelLeft: labelBox.left,
					labelRight: labelBox.right
				}
			})
			// The h2 is a block in the text column, so its box is the column.
			const column = heading.getBoundingClientRect()
			return {
				columnLeft: column.left,
				columnRight: column.right,
				viewport: document.documentElement.clientWidth,
				tiles
			}
		})

		expect(band.tiles).toHaveLength(3)
		const [first, middle, last] = band.tiles
		const desktop = width >= 768
		expect(Math.abs(first.left - (desktop ? band.columnLeft : 0))).toBeLessThan(1)
		if (desktop) {
			// Runs past the text column into the right margin, never to the viewport edge.
			expect(last.right).toBeGreaterThan(band.columnRight)
			expect(last.right).toBeLessThan(band.viewport)
		} else {
			expect(Math.abs(last.right - band.viewport)).toBeLessThan(1)
		}
		// Gaps are the page gutter, and so is the step on phones; under 360px both
		// close into one band. From md up the step is a quarter of a tile.
		const gutter = width < 360 ? 0 : 24
		const step = desktop ? first.height / 4 : gutter
		for (const [i, tile] of band.tiles.entries()) {
			expect(Math.abs(tile.width - tile.height)).toBeLessThan(1)
			expect(Math.abs(tile.valueCenter - tile.center)).toBeLessThan(1)
			// Stepped down one step at a time, the number at the same height in each square.
			expect(Math.abs(tile.top - first.top - i * step)).toBeLessThan(1)
			expect(Math.abs(tile.valueTop - tile.top - (first.valueTop - first.top))).toBeLessThan(1)
			expect(tile.valueLeft).toBeGreaterThanOrEqual(tile.left)
			expect(tile.valueRight).toBeLessThanOrEqual(tile.right)
			expect(tile.labelLeft).toBeGreaterThanOrEqual(tile.left)
			expect(tile.labelRight).toBeLessThanOrEqual(tile.right)
		}
		expect(Math.abs(middle.left - first.right - gutter)).toBeLessThan(1)
	})
}

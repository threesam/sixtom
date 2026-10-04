import { expect, test } from '@playwright/test'

// The waitlist copy sits in a card over the closing bubble field. The card is
// narrower than the screen at every width, so the field shows on all four sides
// of it, and it is padded, so no text touches its edge. Both hang on class
// strings; 320px is the narrowest screen the site supports.
for (const width of [320, 393, 768, 1280]) {
	test(`waitlist card keeps a gutter and its padding at ${String(width)}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 })
		await page.goto('/')
		const box = await page.evaluate(() => {
			const section = document.querySelector('#waitlist')
			const card = section?.querySelector('form')?.parentElement
			if (!section || !card) throw new Error('waitlist card not found')
			const outer = section.getBoundingClientRect()
			const rect = card.getBoundingClientRect()
			// The credit-terms popover is a child too, and unrendered until opened.
			const inner = [...card.children]
				.map((child) => child.getBoundingClientRect())
				.filter((r) => r.width > 0)
			return {
				viewport: document.documentElement.clientWidth,
				overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
				left: rect.left,
				right: rect.right,
				above: rect.top - outer.top,
				below: outer.bottom - rect.bottom,
				padLeft: Math.min(...inner.map((r) => r.left)) - rect.left,
				padRight: rect.right - Math.max(...inner.map((r) => r.right)),
				padTop: inner[0].top - rect.top
			}
		})
		expect(box.overflow).toBe(0)
		// Field visible on every side: a gutter left and right, room above and below.
		expect(box.left).toBeGreaterThanOrEqual(16)
		expect(box.viewport - box.right).toBeGreaterThanOrEqual(16)
		expect(Math.abs(box.left - (box.viewport - box.right))).toBeLessThan(1)
		expect(box.above).toBeGreaterThanOrEqual(64)
		expect(box.below).toBeGreaterThanOrEqual(64)
		// Padded: nothing inside reaches the card's edge.
		expect(box.padLeft).toBeGreaterThanOrEqual(24)
		expect(box.padRight).toBeGreaterThanOrEqual(24)
		expect(box.padTop).toBeGreaterThanOrEqual(24)
	})
}

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

// One convention for the fields, on both pages that carry the form: placeholders
// say what goes in each, labels are for screen readers only. So no visible label
// sits flush left above a placeholder indented by the field's padding, the two
// fields are set at one size, and the gaps between field, field and button match.
for (const route of ['/', '/notify']) {
	test(`waitlist fields share one treatment on ${route}`, async ({ page }) => {
		await page.setViewportSize({ width: 393, height: 900 })
		await page.goto(route)
		const form = await page.evaluate(() => {
			const el = document.querySelector('form[action$="?/notify"]')
			const button = el?.querySelector('button[type="submit"]')
			if (!el || !button) throw new Error('waitlist form not found')
			const fields = [...el.querySelectorAll<HTMLElement>('input[type="email"], textarea')]
			const boxes = [...fields, button].map((field) => field.getBoundingClientRect())
			return {
				fields: fields.map((field) => ({
					placeholder: field.getAttribute('placeholder') ?? '',
					named: (field as HTMLInputElement).labels?.length ?? 0,
					fontSize: getComputedStyle(field).fontSize,
					left: field.getBoundingClientRect().left,
					right: field.getBoundingClientRect().right
				})),
				// A screen-reader label is clipped to a pixel; a visible one is not.
				visibleLabels: [...el.querySelectorAll('label')].filter(
					(label) => label.getBoundingClientRect().width > 1
				).length,
				gaps: boxes.slice(1).map((box, i) => box.top - boxes[i].bottom)
			}
		})
		expect(form.fields).toHaveLength(2)
		expect(form.visibleLabels).toBe(0)
		for (const field of form.fields) {
			expect(field.placeholder).not.toBe('')
			expect(field.named).toBe(1)
			expect(field.fontSize).toBe(form.fields[0].fontSize)
			expect(field.left).toBe(form.fields[0].left)
			expect(field.right).toBe(form.fields[0].right)
		}
		expect(Math.abs(form.gaps[0] - form.gaps[1])).toBeLessThan(1)
	})
}

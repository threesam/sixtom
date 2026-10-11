import { test, expect, type Page } from '@playwright/test'

// src/lib/engagement.js in a real browser. The real tracker is kept out (it
// ignores localhost, and would take window.umami for itself) and a stand-in
// remembers what it was told. The module is the same file as the garden's,
// where the media and page-change paths are tested.
type Call = [name: string, data?: unknown]

async function named(page: Page, prefix: string): Promise<() => Promise<Call[]>> {
	await page.route('https://analytics.sixtom.com/**', (route) => route.abort())
	await page.addInitScript(() => {
		const calls: unknown[][] = []
		;(window as unknown as { __calls: unknown[][] }).__calls = calls
		window.umami = { track: (...args: unknown[]) => void calls.push(args) }
	})
	return () =>
		page.evaluate(
			(prefix) =>
				(window as unknown as { __calls: Call[] }).__calls.filter(([name]) =>
					name.startsWith(prefix)
				),
			prefix
		)
}

const toTheEnd = (page: Page) =>
	page.evaluate(() => {
		window.scrollTo(0, document.documentElement.scrollHeight)
	})

test('scroll depth: each quarter of the home page, once', async ({ page }) => {
	const scrolls = await named(page, 'scroll-')
	await page.goto('/')
	await page.waitForTimeout(300)
	expect(await scrolls(), 'fired on load').toEqual([])

	await toTheEnd(page)
	await expect.poll(scrolls).toEqual([['scroll-25'], ['scroll-50'], ['scroll-75'], ['scroll-100']])

	await page.evaluate(() => {
		window.scrollTo(0, 0)
	})
	await toTheEnd(page)
	await page.waitForTimeout(300)
	expect(await scrolls(), 'counted twice').toHaveLength(4)
})

test('time in view: marks at ten and thirty seconds', async ({ page }) => {
	const engaged = await named(page, 'engaged-')
	await page.clock.install()
	await page.goto('/')
	await page.clock.runFor(9_000)
	expect(await engaged()).toEqual([])
	await page.clock.runFor(22_000)
	expect(await engaged()).toEqual([['engaged-10s'], ['engaged-30s']])
})

test('a link off the site is counted, a link within it is not', async ({ page }) => {
	const outbound = await named(page, 'outbound-')
	await page.goto('/')
	await page.evaluate(() => {
		for (const href of ['https://example.com/there?x=1', '/faq']) {
			const a = Object.assign(document.createElement('a'), { href })
			a.addEventListener('click', (event) => {
				event.preventDefault()
			})
			document.body.append(a)
			a.click()
		}
	})
	expect(await outbound()).toEqual([
		['outbound-click', { host: 'example.com', path: '/there', from: '/' }]
	])
})

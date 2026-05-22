import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const ROUTES = [
	{ path: '/', label: 'home' },
	{ path: '/self', label: 'self' },
	{ path: '/anything-but-analog', label: 'analog' },
	{ path: '/deana', label: 'deana' },
	{ path: '/shelf', label: 'shelf' },
	{ path: '/benny', label: 'benny' }
]
const BASE = 'https://threesam.com'
const OUT = 'static/log/garden-party'

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({
	viewport: { width: 1280, height: 800 },
	deviceScaleFactor: 1
})
const page = await ctx.newPage()

for (const { path, label } of ROUTES) {
	await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30000 })
	await page.addStyleTag({
		content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`
	})
	await page.evaluate(() =>
		Promise.all(
			Array.from(document.images).map((i) =>
				i.complete
					? null
					: new Promise((r) => {
							i.onload = r
							i.onerror = r
							setTimeout(r, 3000)
						})
			)
		)
	)
	await page.waitForTimeout(1200)
	await page.screenshot({ path: `${OUT}/${label}.png`, fullPage: false })
	console.log(`✓ ${label}`)
}

await browser.close()

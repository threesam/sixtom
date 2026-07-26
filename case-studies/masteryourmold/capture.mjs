// Baseline capture for the masteryourmold.com teardown: full-page + fold screenshots
// (desktop/mobile) and a real network profile per page. Re-run after the rebuild to
// produce the "after" column with identical method.
import { chromium, devices } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'

const HERE = new URL('.', import.meta.url).pathname
const SHOTS = HERE + 'shots'
mkdirSync(SHOTS, { recursive: true })

const PAGES = [
	['home', ''],
	['our-services', 'our-services'],
	['mold-testing', 'mold-testing'],
	['mold-inspections', 'mold-inspections'],
	['mold-remediation', 'mold-remediation'],
	['water-mitigation', 'water-mitigation'],
	['hepa-deep-clean', 'hepa-deep-clean'],
	['home-health-consults', 'home-health-consults'],
	['spring-air-check', 'spring-air-check'],
	['free-mold-guide', 'free-mold-guide'],
	['who-we-are', 'who-we-are'],
	['copy-of-who-we-are', 'copy-of-who-we-are'],
	['blog', 'blog']
]

const FORMS = [
	['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }],
	['mobile', { ...devices['iPhone 14'] }]
]

const browser = await chromium.launch()
const net = {}

for (const [form, ctxOpts] of FORMS) {
	const ctx = await browser.newContext(ctxOpts)
	const page = await ctx.newPage()

	for (const [slug, path] of PAGES) {
		const reqs = []
		const onResp = async (r) => {
			const h = r.headers()
			reqs.push({
				url: r.url().slice(0, 300),
				host: new URL(r.url()).host,
				type: r.request().resourceType(),
				status: r.status(),
				bytes: Number(h['content-length'] || 0)
			})
		}
		page.on('response', onResp)

		const url = `https://www.masteryourmold.com/${path}`
		try {
			await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
		} catch {
			await page.waitForTimeout(3000) // networkidle never settles on some Wix pages
		}

		// Wix lazy-loads on scroll — walk the page so the full-page shot isn't full of blanks.
		await page.evaluate(
			() =>
				new Promise((res) => {
					let y = 0
					const step = () => {
						window.scrollBy(0, window.innerHeight)
						y += window.innerHeight
						if (y < document.body.scrollHeight + window.innerHeight) setTimeout(step, 220)
						else {
							window.scrollTo(0, 0)
							setTimeout(res, 900)
						}
					}
					step()
				})
		)
		await page.waitForTimeout(1200)

		await page.screenshot({ path: `${SHOTS}/${slug}-${form}-full.png`, fullPage: true })
		await page.screenshot({ path: `${SHOTS}/${slug}-${form}-fold.png` })

		page.off('response', onResp)
		net[`${slug}-${form}`] = reqs
		console.log(`shot ${slug} ${form} (${reqs.length} reqs)`)
	}
	await ctx.close()
}

writeFileSync(HERE + 'raw/network.json', JSON.stringify(net, null, 2))
await browser.close()
console.log('SHOTS COMPLETE')

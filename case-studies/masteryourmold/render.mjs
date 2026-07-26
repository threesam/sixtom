// Renders scorecard.html → scorecard.png (the case-study artifact).
import { chromium } from '@playwright/test'

const HERE = new URL('.', import.meta.url).pathname
const name = process.env.OUT ?? 'scorecard'

const browser = await chromium.launch()
// Short viewport on purpose: fullPage captures max(content, viewport), so a tall
// viewport would pad the artifact with dead space below the content.
const page = await browser.newPage({ viewport: { width: 1600, height: 400 }, deviceScaleFactor: 2 })
await page.goto(`file://${HERE}${name}.html`)
await page.waitForTimeout(600)
await page.screenshot({ path: `${HERE}${name}.png`, fullPage: true })
await browser.close()
console.log(`wrote ${name}.png`)

// Builds the social card (static/og.png): the brand bubble field behind the real
// SIXTOM logo lockup + subhead.
//
// The background bakes one frame of the hero's value-noise field (static/bubbles.js)
// into SVG circles (oklch -> sRGB). The foreground renders the *actual* wordmark
// markup — six + inverted "to" chip + m — in the real Recursive webfont via headless
// Chromium, so the logo matches the site exactly (Recursive is proportional, so it
// can't be faked on a monospace SVG grid). Deterministic: same field, same output.
//
// Run: node scripts/og-source/build-og.mjs   (needs playwright chromium + magick)
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(DIR, '../..')
const W = 1200
const H = 630

// --- bubble field (mirrors static/bubbles.js, coarsened for OG scale) ---
const DENSITY = 16 // grid cells across the short side (fewer/bolder than the live hero's 46)
const BLOBS = 4.5
const SEED = 20 // same seed as the hero so the motif matches
const FRAME = 3400 * 0.00024 // STATIC_FRAME * NDRIFT — a representative mid-drift offset
const ALPHA_MAX = 0.85

const fade = (t) => t * t * (3 - 2 * t)
const map = (v, a1, a2, b1, b2) => b1 + ((v - a1) * (b2 - b1)) / (a2 - a1)

const makeNoise = (seed) => {
	const hash = (x, y) => {
		let n = (x * 374761393 + y * 668265263 + seed * 1610612741) | 0
		n = (n ^ (n >>> 13)) >>> 0
		n = Math.imul(n, 1274126177) >>> 0
		n = (n ^ (n >>> 16)) >>> 0
		return (n & 0x7fffffff) / 0x7fffffff
	}
	return (x, y) => {
		const xi = Math.floor(x)
		const yi = Math.floor(y)
		const fx = fade(x - xi)
		const fy = fade(y - yi)
		const n00 = hash(xi, yi)
		const n10 = hash(xi + 1, yi)
		const n01 = hash(xi, yi + 1)
		const n11 = hash(xi + 1, yi + 1)
		const nx0 = n00 + fx * (n10 - n00)
		const nx1 = n01 + fx * (n11 - n01)
		return nx0 + fy * (nx1 - nx0)
	}
}

// oklch(L% C H) -> sRGB [0..255]. Standard Oklab matrices + sRGB gamma.
const oklchToRgb = (Lpct, C, Hdeg) => {
	const L = Lpct / 100
	const h = (Hdeg * Math.PI) / 180
	const a = C * Math.cos(h)
	const b = C * Math.sin(h)
	const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
	const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
	const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
	const lin = [
		4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
		-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
		-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_
	]
	return lin.map((c) => {
		const cl = Math.max(0, Math.min(1, c))
		const g = cl <= 0.0031308 ? 12.92 * cl : 1.055 * cl ** (1 / 2.4) - 0.055
		return Math.round(g * 255)
	})
}

const noise = makeNoise(SEED)
const minDim = Math.min(W, H)
const space = minDim / DENSITY
const blobScale = BLOBS / minDim

const circles = []
for (let x = space / 2; x < W; x += space) {
	for (let y = space / 2; y < H; y += space) {
		const px = x + (noise(x * 0.1, y * 0.1) - 0.5) * space * 0.5
		const py = y + (noise(y * 0.1, x * 0.1) - 0.5) * space * 0.5
		const n = noise(px * blobScale + FRAME, py * blobScale + FRAME * 0.4)
		const [r, g, b] = oklchToRgb(
			map(n, 0, 1, 64, 72),
			map(n, 0, 1, 0.16, 0.15),
			map(n, 0, 1, 178, 200)
		)
		const radius = space * map(n, 0, 1, 0.12, 0.95)
		const alpha = map(n, 0, 1, 0.1, ALPHA_MAX)
		circles.push(
			`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${radius.toFixed(1)}" fill="rgb(${r},${g},${b})" fill-opacity="${alpha.toFixed(3)}"/>`
		)
	}
}

const bubbleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
	<defs><radialGradient id="scrim" cx="50%" cy="44%" r="62%">
		<stop offset="0%" stop-color="#161616" stop-opacity="0.62"/>
		<stop offset="100%" stop-color="#161616" stop-opacity="0.18"/>
	</radialGradient></defs>
	<rect width="${W}" height="${H}" fill="#161616"/>
	<g>${circles.join('')}</g>
	<rect width="${W}" height="${H}" fill="url(#scrim)"/>
</svg>`

// Recursive webfont, base64-embedded so the page renders offline/deterministically.
const fontB64 = readFileSync(resolve(ROOT, 'static/fonts/recursive.woff2')).toString('base64')

// Logo lockup mirrors src/lib/components/SiteFooter.svelte: six + inverted "to"
// chip + m, uppercase, bold, tight tracking — just scaled up for the card.
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Recursive';src:url(data:font/woff2;base64,${fontB64}) format('woff2');font-weight:400 700;font-display:block;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${W}px;height:${H}px;overflow:hidden;}
body{background:#161616;position:relative;font-family:'Recursive',ui-monospace,monospace;color:#f7f7f7;}
.bg{position:absolute;inset:0;width:100%;height:100%;}
.wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;padding-bottom:24px;}
.logo{display:inline-flex;align-items:center;font-weight:700;font-size:168px;line-height:1;letter-spacing:-0.03em;text-transform:uppercase;}
.logo .a{padding-right:3px;}
.logo .chip{background:#f7f7f7;color:#161616;padding:2px 6px;}
.logo .b{padding-left:3px;}
.sub{font-size:36px;font-weight:500;letter-spacing:-0.01em;color:#c8c8c8;}
.sub b{color:#f7f7f7;font-weight:700;}
.domain{position:absolute;bottom:44px;left:0;width:100%;text-align:center;font-size:22px;letter-spacing:6px;color:#7a7a7a;text-transform:uppercase;}
</style></head><body>
<div class="bg">${bubbleSvg}</div>
<div class="wrap">
	<div class="logo"><span class="a">six</span><span class="chip">to</span><span class="b">m</span></div>
	<div class="sub">AI built your first draft. i build <b>your solution.</b></div>
</div>
<div class="domain">sixtom.com</div>
</body></html>`

const browser = await chromium.launch({ args: ['--no-sandbox', '--force-color-profile=srgb'] })
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
const shot2x = resolve(DIR, 'og-2x.png')
const pngPath = resolve(ROOT, 'static/og.png')
await page.screenshot({ path: shot2x, clip: { x: 0, y: 0, width: W, height: H } })
await browser.close()

// Downsample the 2x supersample to the declared 1200x630 for crisp edges.
execFileSync('magick', [shot2x, '-resize', `${W}x${H}`, '-strip', pngPath])
execFileSync('rm', ['-f', shot2x])
console.log(`og.png written (${String(circles.length)} bubbles, real Recursive logo) -> ${pngPath}`)

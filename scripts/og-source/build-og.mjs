// Builds the social card (static/og.png) from the brand bubble field + wordmark.
//
// The hero's "sea of shapes" (static/bubbles.js) paints oklch circles on a live
// <canvas>. This bakes one representative frame of that same value-noise field
// into static SVG <circle>s, converts oklch -> sRGB (rsvg-convert can't parse
// oklch), composes the SIXTOM wordmark + subhead on top, and rasterizes to PNG.
//
// Run: node scripts/og-source/build-og.mjs   (requires rsvg-convert on PATH)
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = dirname(fileURLToPath(import.meta.url))
const W = 1200
const H = 630

// --- bubble field params (mirrors static/bubbles.js, coarsened for OG scale) ---
const DENSITY = 16 // grid cells across the short side (fewer/bolder than the live hero's 46)
const BLOBS = 4.5 // noise blobs across the short side
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

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
	<title>sixtom — AI built your first draft. i build your solution.</title>
	<defs>
		<radialGradient id="scrim" cx="50%" cy="44%" r="62%">
			<stop offset="0%" stop-color="#161616" stop-opacity="0.62"/>
			<stop offset="100%" stop-color="#161616" stop-opacity="0.18"/>
		</radialGradient>
	</defs>
	<rect width="${W}" height="${H}" fill="#161616"/>
	<g>${circles.join('')}</g>
	<rect width="${W}" height="${H}" fill="url(#scrim)"/>
	<rect x="600" y="220" width="168" height="120" fill="#ffffff"/>
	<g font-family="ui-monospace, 'Fira Mono', Menlo, Monaco, Consolas, monospace" font-weight="700" font-size="140">
		<text x="348" y="329" fill="#ffffff" textLength="252" lengthAdjust="spacingAndGlyphs">SIX</text>
		<text x="600" y="329" fill="#161616" textLength="168" lengthAdjust="spacingAndGlyphs">TO</text>
		<text x="768" y="329" fill="#ffffff" textLength="84" lengthAdjust="spacingAndGlyphs">M</text>
	</g>
	<text x="600" y="452" xml:space="preserve" font-family="ui-monospace, 'Fira Mono', Menlo, Monaco, Consolas, monospace" font-size="34" text-anchor="middle"><tspan fill="#c4c4c4">AI built your first draft. i build </tspan><tspan fill="#ffffff" font-weight="700">your solution.</tspan></text>
	<text x="600" y="544" font-family="ui-monospace, 'Fira Mono', Menlo, Monaco, Consolas, monospace" font-weight="400" font-size="22" fill="#7a7a7a" text-anchor="middle" letter-spacing="4">SIXTOM.COM</text>
</svg>
`

const svgPath = resolve(DIR, 'og.svg')
const pngPath = resolve(DIR, '../../static/og.png')
writeFileSync(svgPath, svg)
execFileSync('rsvg-convert', ['-w', String(W), '-h', String(H), svgPath, '-o', pngPath])
console.log(`og.png written (${String(circles.length)} bubbles) -> ${pngPath}`)

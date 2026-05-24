// Hero bubble field — a "sea of shapes" descended from threesam.com's day20
// sketch: a dot grid whose circles swell and brighten where a slow-drifting
// value-noise field is high, so contiguous blobs of blue-green drift through
// rather than rippling uniformly in place. Standalone (no framework) so the home
// page can stay csr=false — zero SvelteKit JS — for ~1.3KB. No-ops on any page
// without a [data-bubble] canvas. A left→right CSS overlay fades it under the copy.
const initBubbles = () => {
	const canvas = document.querySelector('canvas[data-bubble]')
	if (!canvas) return
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const DENSITY = 46 // grid cells across the short side (desktop)
	const MOBILE_DENSITY = 32 // ~half the circle count on narrow screens (count ∝ density²)
	const BLOBS = 4.5 // noise blobs across the short side — low → big contiguous blobs
	const NDRIFT = 0.00024 // noise-units/ms the field scrolls (blobs "move through")
	const ALPHA_MAX = 0.85 // peak opacity at a blob's core; the CSS overlay fades left→right
	const STATIC_FRAME = 3400 // reduced-motion: a representative mid-drift elapsed (ms)
	const FPS = 20 // cap render rate — a slow ambient drift needs no more, keeps cost low
	const FRAME_MS = 1000 / FPS

	const fade = (t) => t * t * (3 - 2 * t)

	// 2D value noise (ported from the garden's 3D noise with z fixed at 0).
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

	const map = (v, a1, a2, b1, b2) => b1 + ((v - a1) * (b2 - b1)) / (a2 - a1)

	const noise = makeNoise(20)
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

	// Returns the field (geometry + fixed point positions) or null while the canvas
	// is unsized. Rendered at the element's real pixel size (crisp, no upscale); the
	// noise blob scale is tied to the short side so blobs are a fixed fraction of the
	// viewport regardless of resolution. Positions carry a small static jitter so the
	// grid doesn't read as a grid. Rebuilt on resize, not mutated.
	const buildField = () => {
		const { width, height } = canvas.getBoundingClientRect()
		if (width === 0 || height === 0) return null
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = Math.round(width * dpr)
		canvas.height = Math.round(height * dpr)
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

		const minDim = Math.min(width, height)
		const space = minDim / (width < 768 ? MOBILE_DENSITY : DENSITY)
		const blobScale = BLOBS / minDim

		const points = []
		for (let x = space / 2; x < width; x += space) {
			for (let y = space / 2; y < height; y += space) {
				points.push({
					x: x + (noise(x * 0.1, y * 0.1) - 0.5) * space * 0.5,
					y: y + (noise(y * 0.1, x * 0.1) - 0.5) * space * 0.5
				})
			}
		}
		return { width, height, space, blobScale, points }
	}

	// Each frame, sample the noise at every point with a time offset (the drift) so
	// the high-noise regions — blobs — translate across the grid. A point's radius,
	// colour and opacity all track its local noise value, so a blob reads as a
	// swelling, brightening cluster sliding through. Colour spans the CTA gradient
	// (oklch 64% .16 178 → 72% .15 200) by noise, so the field is the same teal.
	const render = (field, elapsed) => {
		ctx.clearRect(0, 0, field.width, field.height)
		const { space, blobScale, points } = field
		const drift = elapsed * NDRIFT
		for (const p of points) {
			const n = noise(p.x * blobScale + drift, p.y * blobScale + drift * 0.4)
			const l = map(n, 0, 1, 64, 72)
			const c = map(n, 0, 1, 0.16, 0.15)
			const h = map(n, 0, 1, 178, 200)
			ctx.fillStyle = `oklch(${l.toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)} / ${map(n, 0, 1, 0.1, ALPHA_MAX).toFixed(3)})`
			ctx.beginPath()
			ctx.arc(p.x, p.y, space * map(n, 0, 1, 0.12, 0.95), 0, Math.PI * 2)
			ctx.fill()
		}
	}

	let field = null
	let raf = 0
	let running = false
	let onScreen = true
	let elapsed = 0 // accumulated animation time (ms), persists across pauses
	let lastRender = 0

	// rAF fires at display rate (~60/120Hz) but we only redraw at FPS — the loop
	// body is a cheap timestamp check on skipped frames. `elapsed` accumulates only
	// the time between rendered frames, so pausing (tab hidden / scrolled away) and
	// resuming continues the drift from where it left off instead of snapping back.
	const frame = (now) => {
		if (!running) return
		if (now - lastRender >= FRAME_MS) {
			if (lastRender) elapsed += now - lastRender
			lastRender = now
			render(field, elapsed)
		}
		raf = requestAnimationFrame(frame)
	}

	const startLoop = () => {
		if (running || !field || reduceMotion || document.hidden || !onScreen) return
		running = true
		lastRender = 0 // re-anchor without advancing elapsed → no jump on resume
		raf = requestAnimationFrame(frame)
	}

	const stopLoop = () => {
		running = false
		cancelAnimationFrame(raf)
	}

	// Single source of truth for "the canvas has a size". ResizeObserver fires an
	// initial callback and again on any layout change, so there's no need for a
	// blind rAF retry — a 0-sized canvas simply never builds a field and never loops.
	const sync = () => {
		field = buildField()
		if (!field) {
			stopLoop()
			return
		}
		if (reduceMotion) render(field, STATIC_FRAME)
		else startLoop()
	}

	new ResizeObserver(sync).observe(canvas)

	// Pause whenever the hero scrolls out of view — no point painting a canvas
	// nobody can see while the rest of the page is read.
	new IntersectionObserver((entries) => {
		onScreen = entries[0].isIntersecting
		if (onScreen) startLoop()
		else stopLoop()
	}).observe(canvas)

	document.addEventListener('visibilitychange', () => {
		if (document.hidden) stopLoop()
		else startLoop()
	})
}

initBubbles()

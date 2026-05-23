// Hero bubble field — self-contained port of threesam.com's day20 "sea of
// shapes": a grid of blue-green circles that sway via sine waves and breathe in
// size. Standalone (no framework) so the home page can stay csr=false — zero
// SvelteKit JS — while still getting the animation for ~1.3KB. No-ops on any
// page without a [data-bubble] canvas.
const initBubbles = () => {
	const canvas = document.querySelector('canvas[data-bubble]')
	if (!canvas) return
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const DENSITY = 40
	const WAVE_CELLS = 7 // wave wavelength in cells — set relative to cell size so the
	// sway stays a coherent traveling wave at any viewport (a fixed spatial frequency
	// drifts in/out of phase as the responsive cell size changes, which reads as
	// circles "dancing in place" rather than rippling).
	const SPEED = 0.00045 // sway units per ms (slow ambient drift)
	const STATIC_FRAME = 3.4 // reduced-motion: freeze on a swayed mid-sketch frame
	const FPS = 20 // cap render rate — a slow ambient sway needs no more, keeps cost low
	const FRAME_MS = 1000 / FPS
	const BUCKETS = 13 // distinct fill tones; the whole field draws in BUCKETS fill()
	// calls instead of one per circle (no per-circle colour-string parsing/fill setup).
	const MAX_ALPHA = 0.69 // opacity at the right edge; ramps from 0 on the left

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
	const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

	const noise = makeNoise(20)
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

	// BUCKETS fixed fills sampled along the CTA gradient (oklch 72% .15 200 →
	// 64% .16 178), opacity ramping 0 → MAX_ALPHA. Computed once; points reference
	// these by index so the render loop can batch one fill() per tone.
	const bucketFills = Array.from({ length: BUCKETS }, (_, i) => {
		const f = i / (BUCKETS - 1)
		const l = map(f, 0, 1, 72, 64)
		const c = map(f, 0, 1, 0.15, 0.16)
		const hue = map(f, 0, 1, 200, 178)
		return `oklch(${l.toFixed(1)}% ${c.toFixed(3)} ${hue.toFixed(1)} / ${(f * MAX_ALPHA).toFixed(3)})`
	})

	// Returns an immutable field (geometry + bucketed points) or null until the
	// canvas has a real laid-out size. Rebuilt on resize rather than mutating globals.
	const buildField = () => {
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		const { width, height } = canvas.getBoundingClientRect()
		if (width === 0 || height === 0) return null
		canvas.width = Math.round(width * dpr)
		canvas.height = Math.round(height * dpr)
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

		// Tile the full canvas (centered origin). Cell size scales with the short
		// side but is floor-capped so a tall/narrow phone canvas doesn't explode
		// the point count.
		const halfW = width / 2
		const halfH = height / 2
		const multi = 0.025
		const space = Math.max(Math.min(width, height) / DENSITY, 12)
		// Positional sway (~0.6 cell at full strength) ramps with x: calm under the
		// copy on the left, full on the right.
		const baseAmp = space * 0.6
		// Cell-relative wave frequency → coherent ripple at any viewport. Size
		// "breathe" is a small, separate pulse so the high-amplitude right side
		// undulates instead of pulsing violently.
		const freq = (Math.PI * 2) / (space * WAVE_CELLS)
		const breathe = space * 0.12

		// Spans the whole screen. Each point is sorted into a tone bucket by its x
		// position dithered by the noise field — the dither (smooth value noise)
		// turns the BUCKETS hard tone steps into organic, blobby boundaries.
		const buckets = Array.from({ length: BUCKETS }, () => [])
		for (let x = -halfW; x < halfW; x += space) {
			for (let y = -halfH; y < halfH; y += space) {
				const n = noise(x * multi, y * multi)
				const tx = map(x, -halfW, halfW, 0, 1) // 0 left → 1 right
				const shade = clamp01(tx + (n - 0.5) * 0.32)
				const bi = Math.round(shade * (BUCKETS - 1))
				buckets[bi].push({
					x,
					y,
					// Tight radius range (~0.42–0.56 cell) keeps the dots distinct so the
					// tone variation reads — a wide size range let big circles overlap
					// into blobs and washed the texture out.
					r: map(n, 0, 1, space * 0.42, space * 0.56),
					wamp: baseAmp * tx
				})
			}
		}
		return { width, height, freq, breathe, buckets }
	}

	// One fill() per bucket: set the tone, trace every circle in it into a single
	// path (moveTo before each arc so the subpaths don't connect), fill once.
	const render = (field, offset) => {
		ctx.clearRect(0, 0, field.width, field.height)
		ctx.save()
		ctx.translate(field.width / 2, field.height / 2)
		const { freq, breathe, buckets } = field
		for (let b = 0; b < buckets.length; b++) {
			const pts = buckets[b]
			if (pts.length === 0) continue
			ctx.fillStyle = bucketFills[b]
			ctx.beginPath()
			for (let i = 0; i < pts.length; i++) {
				const p = pts[i]
				const cx = p.x + Math.sin(p.y * freq + offset) * p.wamp
				const cy = p.y + Math.sin(p.x * freq + offset) * p.wamp
				const r = Math.max(0.5, p.r + Math.sin((p.x + p.y) * freq + offset) * breathe)
				ctx.moveTo(cx + r, cy)
				ctx.arc(cx, cy, r, 0, Math.PI * 2)
			}
			ctx.fill()
		}
		ctx.restore()
	}

	let field = null
	let raf = 0
	let running = false
	let onScreen = true
	let t0 = 0
	let lastRender = 0

	// rAF fires at display rate (~60/120Hz) but we only redraw at FPS — the loop
	// body is a cheap timestamp check on skipped frames. Motion is time-based, so
	// throttling lowers cost without changing the sway speed.
	const frame = (now) => {
		if (now - lastRender >= FRAME_MS) {
			t0 ||= now
			lastRender = now
			render(field, (now - t0) * SPEED)
		}
		raf = requestAnimationFrame(frame)
	}

	const startLoop = () => {
		if (running || !field || reduceMotion || document.hidden || !onScreen) return
		running = true
		t0 = 0
		lastRender = 0
		raf = requestAnimationFrame(frame)
	}

	const stopLoop = () => {
		running = false
		cancelAnimationFrame(raf)
	}

	// Single source of truth for "the canvas has a size". ResizeObserver fires an
	// initial callback and again whenever the canvas crosses the md breakpoint
	// (display:none ⇄ block), so there's no need for a blind rAF retry — a hidden
	// canvas (mobile) simply never builds a field and never loops.
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

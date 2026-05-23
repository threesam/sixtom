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

	const DENSITY = 44
	const SPEED = 0.000225 // sway units per ms (~20x slower than the original; ~28s loop)
	const STATIC_FRAME = 3.4 // reduced-motion: freeze on a swayed mid-sketch frame
	const FPS = 24 // cap render rate — a very slow ambient sway needs no more, keeps cost low
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

	// Returns an immutable field (geometry + points) or null until the canvas
	// has a real laid-out size. Rebuilt on resize rather than mutating globals.
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
		// Wave amplitude (~0.9 of a cell at full strength) is enveloped to the right
		// 2/3: zero through the left third (calm under the copy), ramping to full at
		// the right edge — so the ripple "hits" across the visible right side.
		const baseAmp = space * 0.9

		// Each bubble's colour is sampled along the CTA gradient (oklch 72% .15 200
		// → 64% .16 178) by its x position; alpha ramps left→0 so the field can't
		// hurt text contrast over the copy. Both are baked into a fill string here
		// so the per-frame loop never builds strings.
		const points = []
		// Skip the left third entirely — it ramps to ~0 alpha and 0 wave anyway, so
		// it's pure waste. ~33% fewer drawn circles.
		for (let x = -halfW / 3; x < halfW; x += space) {
			for (let y = -halfH; y < halfH; y += space) {
				const n = noise(x * multi, y * multi)
				const tx = map(x, -halfW, halfW, 0, 1)
				// 0 at the left edge of the kept field → 1 at the right edge. Drives
				// both the wave amplitude and the opacity fade-in (so the skip boundary
				// fades in from transparent rather than showing a hard edge).
				const ramp = Math.max(0, (3 * tx - 1) / 2)
				// Colour follows the CTA gradient by x; lightness/hue/opacity are
				// jittered by the noise field so the bubbles read organic and mottled
				// (like the original) rather than a smooth uniform wash.
				const l = map(tx, 0, 1, 72, 64) + map(n, 0, 1, -6, 6)
				const c = map(tx, 0, 1, 0.15, 0.16)
				const hue = map(tx, 0, 1, 200, 178) + map(n, 0, 1, -8, 8)
				const alpha = ramp * map(n, 0, 1, 0.65, 1) // 0 left → ~1 right, mottled
				points.push({
					x,
					y,
					size: Math.floor(map(n, 0, 1, space * 0.69, space * 1.5)),
					wamp: baseAmp * ramp,
					fill: `oklch(${l}% ${c} ${hue} / ${alpha})`
				})
			}
		}
		return { width, height, points }
	}

	// Curried renderer: fix the frame's offset, return a per-point draw. Each point
	// carries its own wave amplitude (p.wamp) — enveloped so the ripple "hits" the
	// right side and fades out toward the (skipped) left third.
	const drawPoint = (offset) => (p) => {
		ctx.fillStyle = p.fill
		ctx.beginPath()
		ctx.arc(
			p.x + Math.sin(p.y * 0.41 + offset) * p.wamp,
			p.y + Math.sin(p.x * 0.41 + offset) * p.wamp,
			Math.max(1, (p.size + Math.sin((p.x + p.y) * 0.41 + offset) * p.wamp) / 2),
			0,
			Math.PI * 2
		)
		ctx.fill()
	}

	const render = (field, offset) => {
		ctx.clearRect(0, 0, field.width, field.height)
		ctx.save()
		ctx.translate(field.width / 2, field.height / 2)
		field.points.forEach(drawPoint(offset))
		ctx.restore()
	}

	let field = null
	let raf = 0
	let running = false
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
		if (running || !field || reduceMotion || document.hidden) return
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

	document.addEventListener('visibilitychange', () => {
		if (document.hidden) stopLoop()
		else startLoop()
	})
}

initBubbles()

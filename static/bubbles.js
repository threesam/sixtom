// Hero bubble field — self-contained port of threesam.com's day20 "sea of
// shapes": a grid of blue-green circles that sway via sine waves and breathe in
// size. Standalone (no framework) so the home page can stay csr=false — zero
// SvelteKit JS — while still getting the animation for ~1.3KB. No-ops on any
// page without a [data-bubble] canvas.
//
// Rendered into a fixed REF×REF buffer and CSS-scaled up (the canvas element is
// sized object-cover): this reproduces the live sketch exactly — same point
// count, noise frequency and wave coherence — just enlarged, rather than
// re-deriving the field at full-screen coordinates (which changes the texture).
// A left→right surface→transparent CSS overlay fades it under the copy.
const initBubbles = () => {
	const canvas = document.querySelector('canvas[data-bubble]')
	if (!canvas) return
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const DENSITY = 44
	const REF = 760 // fixed render resolution; CSS scales the canvas element up to cover
	const SPEED = 0.0018 // sway units per ms (matches the live sketch)
	const STATIC_FRAME = 3.4 // reduced-motion: freeze on a swayed mid-sketch frame
	const FPS = 20 // cap render rate — a slow ambient sway needs no more, keeps cost low
	const FRAME_MS = 1000 / FPS
	const ALPHA = 0.8 // flat opacity; the CSS overlay handles the left→right fade

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

	// Returns an immutable field (geometry + points) or null while the canvas is
	// unsized (display:none / not laid out). The buffer is fixed at REF — only the
	// laid-out check uses the element box. Rebuilt on resize, not mutated.
	const buildField = () => {
		const { width, height } = canvas.getBoundingClientRect()
		if (width === 0 || height === 0) return null
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = canvas.height = Math.round(REF * dpr)
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

		const half = REF / 2
		const multi = 0.025
		const space = (REF * 0.75) / DENSITY
		const waveAmp = space * 0.6

		// Size and blue-green colour are driven by the noise field (the og sketch's
		// organic texture); colour baked into a fill string so the loop builds none.
		const points = []
		for (let x = -half; x < half; x += space) {
			for (let y = -half; y < half; y += space) {
				const n = noise(x * multi, y * multi)
				const g = Math.floor(map(n, 0, 1, 100, 200))
				const b = Math.floor(map(n, 0, 1, 130, 255))
				points.push({
					x,
					y,
					size: Math.floor(map(n, 0, 1, space * 0.69, space * 1.5)),
					fill: `rgba(0,${g},${b},${ALPHA})`
				})
			}
		}
		return { dim: REF, waveAmp, points }
	}

	// Sway frequency 0.41 matches the live sketch and stays a coherent wave at REF's
	// cell size (a fixed frequency only reads as a ripple — not "dancing" — when the
	// cell size it was tuned for is held constant, which the fixed buffer guarantees).
	const render = (field, offset) => {
		ctx.clearRect(0, 0, field.dim, field.dim)
		ctx.save()
		ctx.translate(field.dim / 2, field.dim / 2)
		const { waveAmp, points } = field
		for (const p of points) {
			ctx.fillStyle = p.fill
			ctx.beginPath()
			ctx.arc(
				p.x + Math.sin(p.y * 0.41 + offset) * waveAmp,
				p.y + Math.sin(p.x * 0.41 + offset) * waveAmp,
				Math.max(1, (p.size + Math.sin((p.x + p.y) * 0.41 + offset) * waveAmp) / 2),
				0,
				Math.PI * 2
			)
			ctx.fill()
		}
		ctx.restore()
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
	// resuming continues the sway from where it left off instead of snapping back.
	const frame = (now) => {
		if (!running) return
		if (now - lastRender >= FRAME_MS) {
			if (lastRender) elapsed += now - lastRender
			lastRender = now
			render(field, elapsed * SPEED)
		}
		raf = requestAnimationFrame(frame)
	}

	const startLoop = () => {
		if (running || !field || reduceMotion || document.hidden || !onScreen) return
		running = true
		lastRender = 0 // re-anchor without advancing elapsed → no phase jump on resume
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

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
	const ALPHA_SCALE = 0.55 // right-edge cap; left edge ramps to 0 over the copy
	const SPEED = 0.0018 // sway units per ms (~2.5x slower than the original)
	const STATIC_FRAME = 3.4 // reduced-motion: freeze on a swayed mid-sketch frame

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

		const smallSide = Math.min(width, height) * 0.75
		const multi = 0.025
		const start = -smallSide * 0.4
		const end = smallSide * 0.4
		const space = smallSide / DENSITY

		const points = []
		for (let x = start; x < end; x += space) {
			for (let y = start; y < end; y += space) {
				const n = noise(x * multi, y * multi)
				points.push({
					x,
					y,
					size: Math.floor(map(n, 0, 1, space * 0.69, space * 1.5)),
					g: Math.floor(map(n, 0, 1, 100, 200)),
					b: Math.floor(map(n, 0, 1, 130, 255)),
					a: map(x, start, end, 0, 1) // left -> right alpha ramp (0..1)
				})
			}
		}
		return { width, height, start, end, points }
	}

	// Curried renderer: fix the frame's offset + field bounds, return a per-point draw.
	const drawPoint = (offset, start, end) => (p) => {
		const waveX = map(p.x, start, end, 10, 0)
		const waveY = map(p.y, start, end, 10, 0)
		ctx.fillStyle = `rgba(0,${p.g},${p.b},${p.a * ALPHA_SCALE})`
		ctx.beginPath()
		ctx.arc(
			p.x + Math.sin(p.y * 0.41 + offset) * waveX,
			p.y + Math.sin(p.x * 0.41 + offset) * waveY,
			Math.max(1, (p.size + Math.sin((p.x + p.y) * 0.41 + offset) * waveX) / 2),
			0,
			Math.PI * 2
		)
		ctx.fill()
	}

	const render = (field, offset) => {
		ctx.clearRect(0, 0, field.width, field.height)
		ctx.save()
		ctx.translate(field.width / 2, field.height / 2)
		field.points.forEach(drawPoint(offset, field.start, field.end))
		ctx.restore()
	}

	let field = null
	let raf = 0
	let running = false
	let t0 = 0

	const frame = (now) => {
		t0 ||= now
		render(field, (now - t0) * SPEED)
		raf = requestAnimationFrame(frame)
	}

	const startLoop = () => {
		if (running || !field || reduceMotion) return
		running = true
		t0 = 0
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

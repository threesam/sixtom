<script lang="ts">
	import { onMount } from 'svelte'
	import { makeNoise, map } from '$lib/art/noise'

	// Faithful port of threesam.com day20 "sea of shapes": a grid of blue-green
	// circles that sway via sine waves and breathe in size. Adapted for the hero:
	//  - clearRect (not a black fill) so it floats transparently over the hero bg
	//  - far lower alpha so it can never hurt text contrast (a11y)
	//  - elapsed-ms timing so the sway runs at one speed on 60Hz and 120Hz alike
	//  - reduced-motion → one static frame; paused while the tab is hidden
	const DENSITY = 44
	const ALPHA_SCALE = 0.18 // much more transparent than the original
	const SPEED = 0.0018 // sway units per ms (~2.5× slower than the original)

	let canvas: HTMLCanvasElement

	onMount(() => {
		const maybeCtx = canvas.getContext('2d')
		if (!maybeCtx) return
		// Bind to a non-null const so the closures below keep the narrowed type
		// without per-call non-null assertions.
		const ctx = maybeCtx

		const noise = makeNoise(20)
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		interface Point {
			x: number
			y: number
			size: number
			g: number
			b: number
			a: number
		}

		let points: Point[] = []
		let w = 0
		let h = 0
		let start = 0
		let end = 0

		function build() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2)
			const rect = canvas.getBoundingClientRect()
			w = rect.width
			h = rect.height
			if (w === 0 || h === 0) return
			canvas.width = Math.round(w * dpr)
			canvas.height = Math.round(h * dpr)
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

			const smallSide = (w > h ? h : w) * 0.75
			const multi = 0.025
			start = -smallSide * 0.4
			end = smallSide * 0.4
			const space = smallSide / DENSITY

			points = []
			for (let x = start; x < end; x += space) {
				for (let y = start; y < end; y += space) {
					const n = noise(x * multi, y * multi)
					points.push({
						x,
						y,
						size: Math.floor(map(n, 0, 1, space * 0.69, space * 1.5)),
						g: Math.floor(map(n, 0, 1, 100, 200)),
						b: Math.floor(map(n, 0, 1, 130, 255)),
						a: Math.floor(map(y, start, end, 255, 10))
					})
				}
			}
		}

		function draw(offset: number) {
			ctx.clearRect(0, 0, w, h)
			ctx.save()
			ctx.translate(w / 2, h / 2)
			for (const p of points) {
				const waveX = map(p.x, start, end, 10, 0)
				const waveY = map(p.y, start, end, 10, 0)
				ctx.fillStyle = `rgba(0, ${String(p.g)}, ${String(p.b)}, ${String((p.a / 255) * ALPHA_SCALE)})`
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
			ctx.restore()
		}

		build()

		let raf = 0
		let running = false
		let t0 = 0

		function loop(now: number) {
			if (t0 === 0) t0 = now
			draw((now - t0) * SPEED)
			raf = requestAnimationFrame(loop)
		}

		function startLoop() {
			if (running || reduceMotion) return
			running = true
			raf = requestAnimationFrame(loop)
		}

		function stopLoop() {
			running = false
			cancelAnimationFrame(raf)
		}

		if (reduceMotion) draw(0)
		else startLoop()

		const ro = new ResizeObserver(() => {
			build()
			if (reduceMotion) draw(0)
		})
		ro.observe(canvas)

		function onVisibility() {
			if (document.hidden) stopLoop()
			else startLoop()
		}
		document.addEventListener('visibilitychange', onVisibility)

		return () => {
			stopLoop()
			ro.disconnect()
			document.removeEventListener('visibilitychange', onVisibility)
		}
	})
</script>

<canvas bind:this={canvas} aria-hidden="true" class="block h-full w-full"></canvas>

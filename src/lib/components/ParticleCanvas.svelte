<script lang="ts">
	const { store } = $props()
	import { onMount, onDestroy } from 'svelte'
	import type P5 from 'p5'
	import init, { ParticleSystem } from '$lib/wasm-particle-system/pkg'

	let particleSystem: ParticleSystem
	let p5Instance: P5
	let canvas: HTMLCanvasElement
	const NUM_PARTICLES = 111

	let color = $derived(store.isActive ? 0 : 255)

	onMount(async () => {
		try {
			// Initialize WASM module
			await init()

			// Create particle system
			particleSystem = new ParticleSystem(NUM_PARTICLES, window.innerWidth, window.innerHeight, 111)

			const sketch = (p: P5) => {
				p.setup = () => {
					canvas = p.createCanvas(
						window.innerWidth,
						window.innerHeight
					) as unknown as HTMLCanvasElement
					p.frameRate(60)

					// Set initial canvas dimensions in particle system
					particleSystem.set_dimensions(p.width, p.height)
				}

				p.draw = () => {
					p.background(0)

					// Update particle positions
					particleSystem.update(p.width, p.height)

					// Render particles
					const particles = particleSystem.get_particles() as Array<{ x: number; y: number }>
					p.fill(255)
					p.noStroke()

					particles.forEach((particle) => {
						p.circle(particle.x, particle.y, 1)
					})

					// Render links between particles
					const links = particleSystem.get_links() as Array<{
						x1: number
						y1: number
						x2: number
						y2: number
						opacity: number
					}>
					p.stroke(255)
					links.forEach((link) => {
						p.strokeWeight(link.opacity * 2) // Thicker lines for closer links
						p.stroke(255, 255, color, link.opacity * 255) // Adjust alpha based on opacity
						p.line(link.x1, link.y1, link.x2, link.y2)
					})
				}

				p.windowResized = () => {
					p.resizeCanvas(window.innerWidth, window.innerHeight)
					particleSystem.set_dimensions(p.width, p.height)
				}
			}

			// Import p5 and initialize sketch
			const p5 = (await import('p5')).default
			p5Instance = new p5(sketch, document.getElementById('p5-container')!)
		} catch (error) {
			console.error('Error initializing WASM:', error)
		}
	})

	onDestroy(() => {
		if (p5Instance) {
			p5Instance.remove()
		}
		if (particleSystem) {
			try {
				particleSystem.cleanup()
			} catch (e) {
				console.error('Error cleaning up particle system:', e)
			}
		}
	})
</script>

<div id="p5-container"></div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	#p5-container {
		width: 100%;
		height: calc(100vh - 56px);
		background: #141414;
	}

	:global(canvas) {
		display: block;
	}
</style>

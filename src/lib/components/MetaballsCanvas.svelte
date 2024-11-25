<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import type P5 from 'p5'
	import init, { ParticleSystem } from '$lib/wasm-particle-system/pkg'

	let particleSystem: ParticleSystem
	let p5Instance: P5
	let canvas: HTMLCanvasElement
	const NUM_PARTICLES = 66 // Fewer particles for metaballs
	const RESOLUTION = 13 // Pixel resolution (higher = better performance)

	onMount(async () => {
		try {
			await init()
			particleSystem = new ParticleSystem(NUM_PARTICLES, window.innerWidth, window.innerHeight)

			const sketch = (p: P5) => {
				let pixels: Uint8ClampedArray

				p.setup = () => {
					canvas = p.createCanvas(
						window.innerWidth,
						window.innerHeight
					) as unknown as HTMLCanvasElement
					p.frameRate(60)
					p.pixelDensity(1)
					particleSystem.set_dimensions(p.width, p.height)
				}

				const calculateMetaball = (
					x: number,
					y: number,
					particles: Array<{ x: number; y: number; radius: number }>
				) => {
					let sum = 0
					for (const particle of particles) {
						const dx = x - particle.x
						const dy = y - particle.y
						const r = Math.sqrt(dx * dx + dy * dy)
						if (r <= 0) continue
						sum += (particle.radius * particle.radius) / (r * r)
					}
					return sum
				}

				p.draw = () => {
					p.loadPixels()
					particleSystem.update(p.width, p.height)
					const particles = particleSystem.get_particles() as Array<{
						x: number
						y: number
						radius: number
					}>

					// Process pixels
					for (let x = 0; x < p.width; x += RESOLUTION) {
						for (let y = 0; y < p.height; y += RESOLUTION) {
							const index = 4 * (y * p.width + x)
							const value = calculateMetaball(x, y, particles)

							// Create color based on metaball value
							const color = value > 1 ? 255 : 0

							// Fill the pixel block
							for (let i = 0; i < RESOLUTION; i++) {
								for (let j = 0; j < RESOLUTION; j++) {
									if (x + i < p.width && y + j < p.height) {
										const idx = 4 * ((y + j) * p.width + (x + i))
										p.pixels[idx] = 0 // R
										p.pixels[idx + 1] = color // G
										p.pixels[idx + 2] = 0 // B
										p.pixels[idx + 3] = 25 // A
									}
								}
							}
						}
					}
					p.updatePixels()
				}

				p.windowResized = () => {
					p.resizeCanvas(window.innerWidth, window.innerHeight)
					particleSystem.set_dimensions(p.width, p.height)
					p.pixelDensity(1)
				}
			}

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

<div id="p5-container" />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #000;
	}

	#p5-container {
		width: 100%;
		height: 100vh;
	}

	:global(canvas) {
		display: block;
	}
</style>

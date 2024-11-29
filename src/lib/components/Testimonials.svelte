<script lang="ts">
	import { onMount } from 'svelte'

	const testimonials = [
		{ name: 'John Doe', role: 'CEO, Tech Co', quote: 'Exceptional service and results!' },
		{
			name: 'Jane Smith',
			role: 'Marketing Director, Brand Inc',
			quote: 'Transformed our online presence.'
		},
		{
			name: 'David Johnson',
			role: 'Founder, Startup Hub',
			quote: 'Their web development exceeded our expectations.'
		},
		{
			name: 'Emily White',
			role: 'Creative Lead, Design Studio',
			quote: 'Fantastic branding and creative direction!'
		}
	]

	let speed = $state(1) // Default scroll speed
	let marqueeContainer: HTMLDivElement
	let isDragging = $state(false)
	let startX: number
	let scrollLeft: number
	let isAutoScrolling = $state(true)
	let animationFrame: number

	function startDragging(e: MouseEvent | TouchEvent) {
		isDragging = true
		isAutoScrolling = false

		startX =
			'touches' in e
				? (e as TouchEvent).touches[0].pageX - marqueeContainer.offsetLeft
				: (e as MouseEvent).pageX - marqueeContainer.offsetLeft

		scrollLeft = marqueeContainer.scrollLeft
	}

	function stopDragging() {
		isDragging = false
		isAutoScrolling = true
	}

	function drag(e: MouseEvent | TouchEvent) {
		if (!isDragging) return

		e.preventDefault()
		const x =
			'touches' in e
				? (e as TouchEvent).touches[0].pageX - marqueeContainer.offsetLeft
				: (e as MouseEvent).pageX - marqueeContainer.offsetLeft

		const walk = (x - startX) * 2 // Drag sensitivity
		marqueeContainer.scrollLeft = scrollLeft - walk
	}

	onMount(() => {
		if (!marqueeContainer) return

		// Duplicate content for seamless scroll
		const content = marqueeContainer.innerHTML
		marqueeContainer.innerHTML += content

		function autoScroll() {
			if (!isAutoScrolling) {
				cancelAnimationFrame(animationFrame)
				return
			}

			marqueeContainer.scrollLeft += speed

			// Reset to start when content scrolls out of view
			if (marqueeContainer.scrollLeft >= marqueeContainer.scrollWidth / 2) {
				marqueeContainer.classList.add('no-transition')
				marqueeContainer.scrollLeft = 0
				marqueeContainer.classList.remove('no-transition')
			}

			animationFrame = requestAnimationFrame(autoScroll)
		}

		// Start auto-scroll
		autoScroll()

		// Add event listeners for dragging
		marqueeContainer.addEventListener('mousedown', startDragging)
		marqueeContainer.addEventListener('mouseleave', stopDragging)
		marqueeContainer.addEventListener('mouseup', stopDragging)
		marqueeContainer.addEventListener('mousemove', drag)

		// Touch events
		marqueeContainer.addEventListener('touchstart', startDragging)
		marqueeContainer.addEventListener('touchend', stopDragging)
		marqueeContainer.addEventListener('touchmove', drag)

		return () => {
			cancelAnimationFrame(animationFrame)
			marqueeContainer.removeEventListener('mousedown', startDragging)
			marqueeContainer.removeEventListener('mouseleave', stopDragging)
			marqueeContainer.removeEventListener('mouseup', stopDragging)
			marqueeContainer.removeEventListener('mousemove', drag)
			marqueeContainer.removeEventListener('touchstart', startDragging)
			marqueeContainer.removeEventListener('touchend', stopDragging)
			marqueeContainer.removeEventListener('touchmove', drag)
		}
	})
</script>

<section id="testimonials" class="bg-gray-100 py-20">
	<div class="container mx-auto md:px-4">
		<h2 class="mb-8 text-2xl font-bold text-black md:text-center md:text-4xl">
			What Our Clients Say
		</h2>
		<div
			bind:this={marqueeContainer}
			class="relative flex cursor-grab select-none overflow-x-hidden active:cursor-grabbing"
		>
			<div class="flex space-x-8">
				{#each testimonials as testimonial}
					<div class="w-80 shrink-0 py-4 first:ml-8">
						<div class="relative my-6 inline-block w-full bg-yellow-100 p-4 text-black">
							<blockquote class="relative z-10 text-sm italic text-gray-900">
								"{testimonial.quote}"
							</blockquote>
							<!-- Triangle -->
							<div
								class="absolute -bottom-2 left-7 h-5 w-5 -translate-x-1/2 rotate-45 transform bg-yellow-100"
							></div>
						</div>
						<div class="px-4 font-semibold text-black">{testimonial.name}</div>
						<div class="px-4 text-sm text-gray-500">{testimonial.role}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* Hide transitions during resets */
	.no-transition {
		transition: none !important;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	.animate-marquee {
		display: flex;
		animation: marquee 20s linear infinite;
	}
</style>

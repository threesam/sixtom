<script lang="ts">
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	const testimonials = [
		{ name: 'John Doe', role: 'CEO, Tech Co', quote: 'Exceptional service and results!' },
		{
			name: 'Jane Smith',
			role: 'Marketing Director, Brand Inc',
			quote:
				'Transformed our online presence. Transformed our online presence.Transformed our online presence.Transformed our online presence.Transformed our online presence.Transformed our online presence.Transformed our online presence.Transformed our online presence.'
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

	// State for tracking navigation visibility
	let isAtStart = $state(true)
	let isAtEnd = $state(false)

	// Reference to the slider container
	let sliderContainer: HTMLElement

	function navigateSlider(direction: 'prev' | 'next') {
		if (!sliderContainer) return

		const scrollAmount = sliderContainer.clientWidth
		sliderContainer.scrollBy({
			left: direction === 'prev' ? -scrollAmount : scrollAmount,
			behavior: 'smooth'
		})
	}

	// Add scroll event to update navigation state
	function handleScroll() {
		if (!sliderContainer) return

		const scrollLeft = sliderContainer.scrollLeft
		const scrollWidth = sliderContainer.scrollWidth
		const clientWidth = sliderContainer.clientWidth

		isAtStart = scrollLeft === 0
		isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1 // Small buffer for rounding
	}

	onMount(() => {
		if (!sliderContainer) return

		const observer = new IntersectionObserver(
			(entries) => {
				// Check first and last items
				const firstItem = entries[0]
				const lastItem = entries[entries.length - 1]

				// Update start and end states
				isAtStart = firstItem.isIntersecting
				isAtEnd = lastItem.isIntersecting
			},
			{ root: sliderContainer, threshold: 0.5 }
		)

		// Observe first and last items
		const items = sliderContainer.querySelectorAll('li')
		if (items.length > 0) {
			observer.observe(items[0])
			observer.observe(items[items.length - 1])
		}

		sliderContainer.addEventListener('scroll', handleScroll)

		// Cleanup
		return () => {
			observer.disconnect()
			sliderContainer.removeEventListener('scroll', handleScroll)
		}
	})
</script>

<section id="testimonials" class="relative bg-gray-100 py-20">
	<div class="container relative mx-auto">
		<h2 class="mb-8 px-4 text-3xl font-bold text-black md:text-center md:text-4xl">
			What Our Clients Say
		</h2>

		<!-- Navigation Arrows -->
		<div
			class="pointer-events-none absolute -left-16 -right-16 top-1/2 z-10 flex justify-between max-md:hidden"
		>
			{#if !isAtStart}
				<button
					onclick={() => navigateSlider('prev')}
					transition:fade={{ duration: 100 }}
					class="pointer-events-auto rounded-lg bg-black/30 p-2 text-black transition-all duration-300 hover:scale-95 hover:bg-yellow-400"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M15 18l-6-6 6-6" />
					</svg>
					<span class="sr-only">previous</span>
				</button>
			{/if}
			{#if !isAtEnd}
				<button
					onclick={() => navigateSlider('next')}
					transition:fade={{ duration: 100 }}
					class="pointer-events-auto ml-auto rounded-lg bg-black/30 p-2 text-black transition-all duration-300 hover:scale-95 hover:bg-yellow-400"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
					<span class="sr-only">next</span>
				</button>
			{/if}
		</div>

		<ul
			bind:this={sliderContainer}
			class="scrollbar-none relative flex w-full snap-x snap-mandatory overflow-y-hidden overflow-x-scroll overscroll-x-none md:gap-4"
		>
			{#each testimonials as testimonial}
				<li
					class="group max-w-[70%] shrink-0 snap-start rounded-lg max-md:pl-4 max-md:last:mr-4 md:w-[30%]"
				>
					<div class="w-full">
						<div class="relative mb-6 inline-block w-full bg-yellow-100 p-4 text-black">
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
				</li>
			{/each}
		</ul>
	</div>
</section>

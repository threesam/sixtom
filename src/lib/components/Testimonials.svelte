<script lang="ts">
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	const testimonials = [
		{ name: 'John Doe', subtitle: 'CEO, Tech Co', text: 'Exceptional service and results!' },
		{
			name: 'Jane Smith',
			subtitle: 'Marketing Director, Brand Inc',
			text: 'Transformed our online presence.'
		},
		{ name: 'David Johnson', subtitle: 'Founder, Startup Hub', text: 'Exceeded expectations.' },
		{ name: 'Emily White', subtitle: 'Creative Lead, Design Studio', text: 'Fantastic work!' }
	]

	let { section } = $props()

	let isAtStart = $state(true)
	let isAtEnd = $state(false)
	let currentSlideIndex = $state(0)
	let sliderContainer: HTMLElement

	// Updated `navigateSlider` function
	function navigateSlider(desiredIndex: number) {
		if (!sliderContainer) return

		const items = sliderContainer.querySelectorAll('li')

		// Clamp the index to ensure it's within bounds
		const newIndex = Math.max(0, Math.min(items.length - 1, desiredIndex))

		currentSlideIndex = newIndex // Update state
		scrollToSlide(newIndex)
	}

	function handleScroll() {
		if (!sliderContainer) return

		const scrollLeft = sliderContainer.scrollLeft
		const scrollWidth = sliderContainer.scrollWidth
		const clientWidth = sliderContainer.clientWidth

		isAtStart = scrollLeft === 0
		isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1 // Small buffer for rounding
	}

	function scrollToSlide(index: number) {
		if (!sliderContainer) return

		const items = sliderContainer.querySelectorAll('li')
		if (index < 0 || index >= items.length) return

		const targetItem = items[index] as HTMLLIElement
		sliderContainer.scrollTo({
			left: targetItem.offsetLeft - sliderContainer.offsetLeft,
			behavior: 'smooth'
		})
	}

	onMount(() => {
		if (!sliderContainer) return

		const observer = new IntersectionObserver(
			(entries) => {
				// Type assertion to HTMLLIElement
				const visibleEntry = entries.find(
					(entry) => entry.isIntersecting && entry.target instanceof HTMLLIElement
				)

				if (visibleEntry && visibleEntry.target instanceof HTMLLIElement) {
					// Get the index of the visible item
					const items = Array.from(sliderContainer.querySelectorAll('li'))
					const visibleIndex = items.indexOf(visibleEntry.target)

					// Update states
					isAtStart = visibleIndex === 0
					isAtEnd = visibleIndex === items.length - 1

					// New variable to track the current visible index
					currentSlideIndex = visibleIndex
				}
			},
			{
				root: sliderContainer,
				threshold: 0.5 // Trigger when at least 50% of the item is visible
			}
		)

		// Get all list items in the slider
		const items = sliderContainer.querySelectorAll('li')

		// If there are items, observe all items
		if (items.length > 0) {
			items.forEach((item) => {
				// Type assertion to ensure it's an HTMLLIElement
				if (item instanceof HTMLLIElement) {
					observer.observe(item)
				}
			})
		}

		sliderContainer.addEventListener('scroll', handleScroll)

		// Cleanup
		return () => {
			observer.disconnect()
			sliderContainer.removeEventListener('scroll', handleScroll)
		}
	})
</script>

<section id="testimonials" class="container relative mx-auto w-full bg-gray-100 py-20">
	<div class="relative mx-auto lg:max-w-xl">
		<div
			class="absolute bottom-0 left-0 top-0 z-20 w-4 bg-gradient-to-r from-gray-100 to-transparent lg:w-10"
		></div>
		<div
			class="absolute bottom-0 right-0 top-0 z-20 w-4 bg-gradient-to-r from-transparent to-gray-100 lg:w-10"
		></div>

		<h2 class="mb-8 px-4 text-3xl font-bold text-black lg:text-center lg:text-4xl">
			What Our Clients Say
		</h2>

		{#if section.items?.length > 1}
			<div
				class="pointer-events-none absolute -left-16 -right-16 top-1/2 z-10 flex justify-between max-lg:hidden"
			>
				<button
					onclick={() => navigateSlider(currentSlideIndex - 1)}
					transition:fade={{ duration: 100 }}
					disabled={isAtStart}
					class="pointer-events-auto rounded-full border-2 border-black p-2 text-black transition-all duration-300 hover:scale-95 hover:bg-yellow-400 disabled:opacity-0"
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
				<button
					onclick={() => navigateSlider(currentSlideIndex + 1)}
					transition:fade={{ duration: 100 }}
					disabled={isAtEnd}
					class="pointer-events-auto rounded-full border-2 border-black p-2 text-black transition-all duration-300 hover:scale-95 hover:bg-yellow-400 disabled:opacity-0"
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
			</div>
		{/if}

		<ul
			bind:this={sliderContainer}
			class="scrollbar-none relative flex snap-x snap-mandatory overflow-y-hidden overflow-x-scroll overscroll-x-none lg:gap-4"
		>
			{#each section.items as testimonial}
				<li class="group grid w-full shrink-0 snap-start place-content-center px-4">
					<div class="mx-auto w-full max-w-lg">
						<div
							class="relative mb-6 inline-block w-full border-2 border-black bg-yellow-100 p-6 text-black"
						>
							<blockquote
								class="text-base italic text-gray-900 data-[is-big=true]:text-xl"
								data-is-big={testimonial.text.length < 200}
							>
								"{testimonial.text}"
							</blockquote>
							<div
								class="absolute -bottom-[11px] left-7 h-5 w-5 -translate-x-1/2 rotate-45 transform border-b-2 border-r-2 border-black bg-yellow-100"
							></div>
						</div>
						<div class="flex items-center">
							<div class="px-2 font-semibold text-black">{testimonial.person.name}</div>
							<div class="pr-4 text-sm text-gray-500">{testimonial.subtitle}</div>
						</div>
					</div>
				</li>
			{/each}
		</ul>

		{#if section.items?.length > 1}
			<div aria-inert="true" class="absolute flex w-full items-center justify-center gap-2 py-8">
				{#each section.items as _, index}
					<button
						class="h-4 w-4 rounded-full border-2 border-black data-[is-selected=true]:bg-black"
						data-is-selected={currentSlideIndex === index}
						onclick={() => navigateSlider(index)}
					>
						<span class="sr-only">{index}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</section>

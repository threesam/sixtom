<script lang="ts">
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	type Link = {
		title: string
		url: string
	}

	let { section } = $props()

	// State for tracking navigation visibility
	let isAtStart = $state(true)
	let isAtEnd = $state(false)

	// Reference to the slider container
	let sliderContainer: HTMLElement

	function getLink(links: Link[]) {
		const websiteLink = links?.find(({ title }) => title === 'website')

		if (websiteLink) return websiteLink.url

		return '#'
	}

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

<section id="portfolio" class="relative overflow-x-hidden bg-gray-200 py-20">
	<div class="container relative mx-auto">
		<div
			class="absolute bottom-0 left-0 top-0 z-20 w-4 bg-gradient-to-r from-gray-200 to-transparent xl:w-4"
		></div>
		<div
			class="absolute bottom-0 right-0 top-0 z-20 w-4 bg-gradient-to-r from-transparent to-gray-200 xl:w-4"
		></div>

		<h2
			class="relative z-30 mb-8 px-4 text-2xl font-bold text-black max-xl:border-b-2 max-xl:border-yellow-400 xl:mb-12 xl:text-center xl:text-4xl"
		>
			{section?.title ?? 'Portfolio'}
		</h2>

		<!-- Navigation Arrows -->
		<div
			class="pointer-events-none absolute -left-16 -right-16 top-1/2 z-10 flex justify-between max-xl:hidden"
		>
			{#if !isAtStart}
				<button
					onclick={() => navigateSlider('prev')}
					transition:fade={{ duration: 100 }}
					class="pointer-events-auto rounded-full border-2 border-black p-2 text-black transition-all duration-300 hover:scale-95 hover:bg-yellow-400"
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
					class="pointer-events-auto ml-auto rounded-full border-2 border-black p-2 text-black transition-all duration-300 hover:scale-95 hover:bg-yellow-400"
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
			class="scrollbar-none relative flex w-full snap-x snap-mandatory overflow-y-hidden overflow-x-scroll overscroll-x-none xl:gap-4 xl:px-4"
		>
			{#each (section?.items ?? []) as { config, image, links, title, subtitle }}
				{#if config?.isActive}
					<li
						class="group max-w-[70%] shrink-0 snap-start rounded-lg bg-gray-200 pl-4 last:max-xl:mr-4 xl:w-[30%]"
						data-is-featured={config.isFeatured}
					>
						<a class="w-full" href={getLink(links)}>
							<figure class="aspect-square h-auto w-full overflow-hidden rounded-t-lg grayscale">
								<img
									src={image?.asset.url}
									alt={title}
									loading="lazy"
									decoding="async"
									class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
								/>
							</figure>
							<div class="py-4">
								<h3 class="relative mb-1 inline text-xl font-semibold text-black">
									{title}
									<span
										class="absolute bottom-[-5px] left-0 h-[2px] w-full bg-yellow-400 opacity-0 transition-all duration-300 group-hover:bottom-0 group-hover:opacity-100"
									></span>
								</h3>

								<p class="text-xs uppercase text-gray-500">{subtitle}</p>
							</div>
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</section>

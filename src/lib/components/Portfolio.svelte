<script lang="ts">
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import CaseStudyCard from '$lib/components/CaseStudyCard.svelte'

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
			{section.title}
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
			{#each section.items as item}
				{#if item?._type === 'caseStudy'}
					<li class="group max-w-[70%] shrink-0 snap-start rounded-lg bg-gray-200 pl-4 last:max-xl:mr-4 xl:w-[30%]">
						<CaseStudyCard study={item} />
					</li>
				{:else}
					{#if item?.config?.isActive}
						<li
							class="group max-w-[70%] shrink-0 snap-start rounded-lg bg-gray-200 pl-4 last:max-xl:mr-4 xl:w-[30%]"
							data-is-featured={item.config.isFeatured}
						>
							<a class="w-full" href={getLink(item.links)}>
								<figure class="aspect-square h-auto w-full overflow-hidden rounded-t-lg grayscale">
									<img
										src={item?.image?.asset.url}
										alt={item?.title}
										class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
									/>
								</figure>
								<div class="py-4">
									<h3 class="relative mb-1 inline text-xl font-semibold text-black">
										{item?.title}
										<span
											class="absolute bottom-[-5px] left-0 h-[2px] w-full bg-yellow-400 opacity-0 transition-all duration-300 group-hover:bottom-0 group-hover:opacity-100"
										></span>
									</h3>

									<p class="text-xs uppercase text-gray-500">{item?.subtitle}</p>
								</div>
							</a>
						</li>
					{/if}
				{/if}
			{/each}
		</ul>

		<!-- MOFU CTA under slider -->
		<div class="mx-4 mt-8 rounded-lg bg-black p-6 text-white md:mx-auto md:w-2/3">
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<div class="text-center md:text-left">
					<h3 class="text-xl font-semibold">Want similar results?</h3>
					<p class="text-gray-300">Get our case study guide and a free action plan for your use case.</p>
				</div>
				<div class="flex gap-3">
					<a href="/assets/case-study-guide.pdf" class="rounded bg-white px-4 py-2 font-semibold text-black">Download guide</a>
					<a href="/contact" class="rounded border border-white px-4 py-2 font-semibold text-white">Talk to us</a>
				</div>
			</div>
		</div>
	</div>
</section>

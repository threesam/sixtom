<script lang="ts">
	import type { Project } from '$lib/types'
	const defaultItems = [
		{
			title: 'Custom E-Commerce Platform for Retailer',
			description:
				'Designed and developed a fully customized e-commerce website for a growing retailer, integrating seamless checkout, product catalogs, and a responsive design to maximize sales.',
			image:
				'https://images.unsplash.com/photo-1593642634367-d91a135587b5?crop=entropy&cs=tinysrgb&fit=max&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDQxfHxld29tZXJjZXxlbnwwfDB8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
		},
		{
			title: 'SEO & PPC Strategy for Tech Startup',
			description:
				'Implemented a data-driven digital marketing campaign combining SEO optimization and paid search advertising, leading to a 30% increase in traffic and a 20% boost in conversions.',
			image:
				'https://images.unsplash.com/photo-1593642634367-d91a135587b5?crop=entropy&cs=tinysrgb&fit=max&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDQxfHxld29tZXJjZXxlbnwwfDB8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
		},
		{
			title: 'Rebranding for Creative Agency',
			description:
				'Led the full rebranding of a creative agency, including logo design, brand guidelines, and a refreshed visual identity that resonated with their target audience and reinforced their market position.',
			image:
				'https://images.unsplash.com/photo-1593642634367-d91a135587b5?crop=entropy&cs=tinysrgb&fit=max&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDQxfHxld29tZXJjZXxlbnwwfDB8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
		}
	]

	let { section = [] } = $props()

	function getLink(links) {
		const websiteLink = links?.find(({ title }) => title === 'website')

		if (websiteLink) return websiteLink.url

		return '#'
	}
</script>

<section id="portfolio" class="bg-gray-200 py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-4 text-2xl font-bold text-black md:mb-12 md:text-center md:text-4xl">
			{section.title}
		</h2>
		<ul class="flex w-full overflow-x-scroll gap-2 scrollbar-none snap-x snap-mandatory">
			{#each section.items as { config, image, links, title, subtitle }, index}
				{#if config?.isActive}
					<li
						class="group md:w-[40%] max-w-[60%] snap-start shrink-0 rounded-lg border-4 border-transparent bg-gray-200 duration-500 hover:border-yellow-400"
						data-is-featured={config.isFeatured}
					>
						<a class="w-full" href={getLink(links)}>
							<figure class="h-auto w-full aspect-square overflow-hidden grayscale">
								<img
									src={image?.asset.url}
									alt={title}
									class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
								/>
							</figure>
							<div class="py-4">
								<h3 class="text-xl mb-1font-semibold text-black">{title}</h3>
								<p class="text-gray-500 uppercase text-xs">{subtitle}</p>
							</div>
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</section>

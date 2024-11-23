<script>
	const portfolioItems = [
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
</script>

<section id="portfolio" class="bg-gray-100 py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold text-gray-900">Our Portfolio</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each portfolioItems as item}
				<div class="border border-gray-200 bg-white">
					<img src={item.image} alt={item.title} class="h-48 w-full object-cover" />
					<div class="p-4">
						<h3 class="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
						<p class="text-gray-600">{item.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

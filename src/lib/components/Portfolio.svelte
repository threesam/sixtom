<script>
	const portfolioItems = [
		{
			title: 'Project 1',
			description: 'Web Design',
			image: '/placeholder.svg?height=300&width=400'
		},
		{
			title: 'Project 2',
			description: 'Mobile App',
			image: '/placeholder.svg?height=300&width=400'
		},
		{ title: 'Project 3', description: 'Branding', image: '/placeholder.svg?height=300&width=400' }
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

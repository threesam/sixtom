<script>
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
</script>

<section id="testimonials" class="bg-gray-100 py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-2xl font-bold text-black md:text-4xl">
			What Our Clients Say
		</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			{#each testimonials as testimonial}
				<div class="p-6 shadow-lg shadow-gray-200">
					<p class="mb-4 text-gray-600">"{testimonial.quote}"</p>
					<div class="font-semibold text-black">{testimonial.name}</div>
					<div class="text-sm text-gray-500">{testimonial.role}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<script>
	const testimonials = [
		{ name: 'John Doe', role: 'CEO, Tech Co', quote: 'Exceptional service and results!' },
		{
			name: 'Jane Smith',
			role: 'Marketing Director, Brand Inc',
			quote: 'Transformed our online presence.'
		}
	]
</script>

<section id="testimonials" class="bg-white py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold text-gray-900">What Our Clients Say</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			{#each testimonials as testimonial}
				<div class="border border-gray-200 p-6">
					<p class="mb-4 text-gray-600">"{testimonial.quote}"</p>
					<div class="font-semibold text-gray-900">{testimonial.name}</div>
					<div class="text-sm text-gray-500">{testimonial.role}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

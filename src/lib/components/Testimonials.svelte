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
	<div class="container mx-auto md:px-4">
		<h2 class="mb-4 px-4 text-2xl font-bold text-black md:mb-12 md:text-center md:text-4xl">
			What Our Clients Say
		</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			{#each testimonials as testimonial}
				<div class="p-4">
					<div class="relative my-6 inline-block bg-yellow-100 p-4 text-black">
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
</section>

<script>
	const services = [
		{
			name: 'Web Development & E-Commerce Solutions',
			text: 'We create custom websites and scalable e-commerce platforms tailored to your business needs, ensuring seamless user experiences, high performance, and future growth.'
		},
		{
			name: 'Digital Marketing & Creative Strategy',
			text: 'Our comprehensive digital marketing strategies and creative services include SEO, paid media campaigns, social media management, branding, and creative direction to elevate your business online.'
		}
	]
</script>

<section id="services" class="bg-white py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold text-gray-900">Our Services</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			{#each services as { name, text }}
				<div class="p-6 shadow-lg shadow-gray-200">
					<h3 class="mb-4 text-xl font-semibold text-gray-900">{name}</h3>
					<p class="text-gray-600">
						{text}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

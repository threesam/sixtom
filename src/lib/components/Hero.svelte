<script>
	let title = 'Sharpen the Axe'
	let subtitle = 'Custom Solutions to Build, Grow, and Differentiate Your Brand'
	import Clock from '$lib/components/Clock.svelte'
</script>

<!-- Hero Section -->
<section
	class="relative bg-black pb-20 pt-28"
	style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 90%);"
>
	<div
		class="container mx-auto flex flex-col items-center justify-between gap-5 px-4 md:grid md:grid-cols-12"
	>
		<div class="mb-8 flex items-center justify-center md:hidden">
			<Clock size={250} hasBlur={false} />
		</div>
		<div class="mb-8 w-full text-center md:col-span-6 md:mb-0 md:text-left">
			<h1 class="mb-4 w-full text-4xl font-bold text-gray-100 md:text-6xl">{title}</h1>
			<p class="mb-8 text-base text-gray-100">{subtitle}</p>
			<a
				href="#contact"
				class="inline-block rounded-lg bg-yellow-400 px-8 py-4 font-bold text-black transition-all duration-300 hover:scale-95"
			>
				Book Consultation
			</a>
		</div>
		<div class="hidden items-center justify-center md:col-span-6 md:flex">
			<Clock size={666} />
		</div>
	</div>
</section>

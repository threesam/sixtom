<script>
	let title = 'AI systems that ship.'
	let subtitle = 'For ecommerce teams that want faster execution and better conversion.'
	import Clock from '$lib/components/Clock.svelte'
</script>

<!-- Hero Section -->
<section
	class="relative bg-black pt-28 pb-20 max-xl:min-h-screen max-xl:snap-start"
	style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 90%);"
>
	<div
		class="container mx-auto flex flex-col items-center justify-between gap-5 px-4 xl:grid xl:grid-cols-12"
	>
		<div class="mb-8 flex items-center justify-center xl:hidden">
			<Clock size={250} hasBlur={false} />
		</div>
		<div class="mb-8 w-full text-center xl:col-span-6 xl:mb-0 xl:text-left">
			<h1 class="mb-4 w-full text-4xl font-bold text-gray-100 xl:text-4xl">{title}</h1>
			<p class="mb-8 text-base text-gray-200">{subtitle}</p>
			<div class="flex flex-wrap items-center justify-center gap-3 xl:justify-start">
				<a
					href="#contact"
					class="inline-block rounded-lg bg-yellow-400 px-8 py-4 font-bold text-black transition-all duration-300 hover:scale-95"
				>
					Book Call
				</a>
			</div>
		</div>
		<div class="hidden items-center justify-center xl:col-span-6 xl:flex">
			<Clock size={666} />
		</div>
	</div>
</section>

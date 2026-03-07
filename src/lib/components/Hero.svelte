<script>
	let title = 'AI Enablement for Digital Systems'
	let subtitle =
		'For ecommerce and content-led teams that are done experimenting. We build practical AI workflows tied to conversion, speed, and team output.'
	import Clock from '$lib/components/Clock.svelte'
</script>

<!-- Hero Section -->
<section
	class="relative bg-black pt-28 pb-20"
	style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 90%);"
>
	<div
		class="container mx-auto flex flex-col items-center justify-between gap-5 px-4 xl:grid xl:grid-cols-12"
	>
		<div class="mb-8 flex items-center justify-center xl:hidden">
			<Clock size={250} hasBlur={false} />
		</div>
		<div class="mb-8 w-full text-center xl:col-span-6 xl:mb-0 xl:text-left">
			<h1 class="mb-4 w-full text-4xl font-bold text-gray-100 xl:text-6xl">{title}</h1>
			<p class="mb-8 text-base text-gray-100">{subtitle}</p>
			<p class="mb-8 text-sm text-gray-300">
				Best fit: fashion, cookware, and content-first brands that need a clear first AI system.
			</p>
			<div class="flex flex-wrap items-center justify-center gap-3 xl:justify-start">
				<a
					href="#contact"
					class="inline-block rounded-lg bg-yellow-400 px-8 py-4 font-bold text-black transition-all duration-300 hover:scale-95"
				>
					Book a Niche-Fit Call
				</a>
				<a
					href="https://linkedin.com/in/threesam"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block rounded-lg border-2 border-gray-100 px-6 py-4 font-semibold text-gray-100 transition-all duration-300 hover:scale-95 hover:border-yellow-400 hover:text-yellow-400"
				>
					Connect on LinkedIn
				</a>
			</div>
		</div>
		<div class="hidden items-center justify-center xl:col-span-6 xl:flex">
			<Clock size={666} />
		</div>
	</div>
</section>

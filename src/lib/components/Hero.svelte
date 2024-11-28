<script>
	let title = 'Pioneering Digital Excellence'
	let subtitle = 'Delivering cutting-edge solutions that inspire growth and drive lasting impact.'
	import Clock from '$lib/components/Clock.svelte'
</script>

<!-- Hero Section -->
<section class="relative bg-black py-20" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 90%);">
	<div class="container mx-auto flex flex-col items-center justify-between gap-2 px-4 md:flex-row">
		<div class="mb-8 flex items-center justify-center md:hidden">
			<Clock size={250} hasBlur={false} />
		</div>
		<div class="mb-8 text-center md:mb-0 md:w-1/2 md:text-left">
			<h1 class="mb-4 text-4xl font-bold text-gray-100 md:text-5xl">{title}</h1>
			<p class="mb-8 text-xl text-gray-100">{subtitle}</p>
			<a
				href="#contact"
				class="rounded-lg bg-yellow-400 px-8 py-4 font-bold text-black transition duration-300 hover:bg-yellow-500"
			>
				Get Started
			</a>
		</div>
		<div class="hidden items-center justify-center md:flex">
			<Clock size={666} />
		</div>
	</div>
</section>

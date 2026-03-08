<script>
	import { hero } from '$lib/copy'
</script>

<section id="hero" class="snap-section relative bg-black px-4">
	<div class="mx-auto flex max-w-3xl flex-col items-center text-center">
		<h1 class="mb-6 text-4xl font-bold leading-tight text-gray-100 sm:text-5xl xl:text-7xl">
			{hero.heading}<br />
			<span class="text-yellow-400">{hero.headingHighlight}</span>
		</h1>
		<p class="mb-10 max-w-xl text-base text-gray-400 sm:text-lg">
			{hero.subheading}
		</p>
		<a
			href={hero.cta.href}
			class="inline-block rounded-full bg-yellow-400 px-10 py-4 text-lg font-bold text-black transition-all duration-300 hover:scale-95 hover:bg-yellow-500"
		>
			{hero.cta.text}
		</a>
	</div>
</section>

<script lang="ts">
	import { credibility } from '$lib/copy'

	let { testimonial }: { testimonial?: { text: string; person: { name: string }; subtitle: string } } = $props()
</script>

<section id="credibility" class="snap-section relative bg-black px-4 py-12">
	<div class="mx-auto max-w-3xl">
		<h2 class="mb-8 text-center text-2xl font-bold text-gray-100 sm:text-3xl xl:text-4xl">
			{credibility.heading}
		</h2>

		<div class="mb-8 grid grid-cols-3 gap-4">
			{#each credibility.stats as stat}
				<div class="text-center">
					<p class="mb-1 text-2xl font-bold text-yellow-400 sm:text-3xl xl:text-4xl">{stat.value}</p>
					<p class="text-[10px] tracking-widest uppercase text-gray-500 sm:text-xs">{stat.label}</p>
				</div>
			{/each}
		</div>

	{#if testimonial}
		<div class="mx-auto mb-8 max-w-xl">
			<div class="relative bg-yellow-400 px-6 py-5 sm:px-8 sm:py-6">
				<span class="mb-3 block text-4xl font-black leading-none text-black/20 sm:text-5xl">"</span>
				<blockquote class="mb-4 text-base font-medium leading-relaxed text-black sm:text-lg">
					{testimonial.text}
				</blockquote>
				<div class="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-black/10 pt-3">
					<span class="text-sm font-black uppercase tracking-wide text-black">{testimonial.person.name}</span>
					{#if testimonial.subtitle}
						<span class="text-xs text-black/60">&mdash; {testimonial.subtitle}</span>
					{/if}
				</div>
			</div>
		</div>
	{/if}

		<div class="text-center">
			<p class="mb-4 text-xs tracking-widest uppercase text-gray-500">{credibility.techLabel}</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each credibility.capabilities as tech}
					<span class="rounded border border-gray-700 px-2 py-1 text-xs text-gray-400 transition-colors duration-200 hover:border-yellow-400 hover:text-yellow-400">
						{tech}
					</span>
				{/each}
			</div>
		</div>
	</div>
</section>

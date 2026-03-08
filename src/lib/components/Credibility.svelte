<script lang="ts">
	import type { CredibilityCopy } from '$lib/copy/types'

	let {
		copy,
		testimonial
	}: {
		copy: CredibilityCopy
		testimonial?: { text: string; person: { name: string }; subtitle: string }
	} = $props()
</script>

<section id="credibility" class="snap-section relative bg-black px-4 py-12">
	<div class="mx-auto max-w-3xl">
		<h2 class="mb-8 text-center text-2xl font-bold text-gray-100 sm:text-3xl xl:text-4xl">
			{copy.headline}
		</h2>

		<div class="mb-10 grid grid-cols-3 gap-4">
			{#each copy.stats as stat}
				<div class="text-center">
					<p class="mb-1 text-2xl font-bold text-yellow-400 sm:text-3xl xl:text-4xl">{stat.value}</p>
					<p class="text-[10px] tracking-widest uppercase text-gray-500 sm:text-xs">{stat.label}</p>
				</div>
			{/each}
		</div>

		{#if testimonial}
			<div class="mx-auto max-w-xl">
				<div class="bg-yellow-400 p-6 sm:p-8">
					<div class="mb-4 text-5xl font-black leading-none text-black/20 sm:text-6xl">&ldquo;</div>
					<blockquote class="-mt-6 mb-6 text-base font-medium leading-relaxed text-black sm:text-lg">
						{testimonial.text}
					</blockquote>
					<div class="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-black/20 pt-4">
						<span class="text-sm font-black uppercase tracking-wide text-black">{testimonial.person.name}</span>
						{#if testimonial.subtitle}
							<span class="text-xs font-medium text-black/60">&mdash; {testimonial.subtitle}</span>
						{/if}
					</div>
					<a
						href="#contact"
						class="inline-block w-full bg-black px-6 py-3 text-center text-sm font-bold uppercase tracking-widest text-yellow-400 transition-all duration-200 hover:bg-gray-900"
					>
						I want results like this &rarr;
					</a>
				</div>
			</div>
		{/if}
	</div>
</section>

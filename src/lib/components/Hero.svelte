<script lang="ts">
	import { site } from '$lib/content'

	// Split the h1 epigram so each sentence renders on its own line at every
	// viewport — no awkward mid-sentence wraps. Source still lives in site.ts.
	const heroLines = site.hero.h1
		.split(/\.\s+/)
		.map((line, i, arr) => (i < arr.length - 1 ? `${line}.` : line))
</script>

<section class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-4xl px-6">
		<p class="eyebrow text-sm">sixtom</p>
		<h1
			class="text-fg border-border mt-6 border-b pb-8 text-5xl leading-[1.02] font-bold tracking-tight md:text-7xl lg:text-8xl"
		>
			{#each heroLines as line, i (i)}
				<span class="block">{line}</span>
			{/each}
		</h1>
		<p class="text-fg-muted mt-8 max-w-2xl text-base leading-relaxed md:text-xl">
			{site.hero.subhead}
		</p>
		<div class="mt-12">
			<a
				href="/book"
				data-umami-event="cta_hero_book"
				class="btn-accent px-8 py-4 text-lg hover:opacity-90"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
		<div
			class="text-fg-subtle mt-12 flex flex-col gap-1.5 text-xs tracking-widest uppercase sm:flex-row sm:items-center sm:gap-4"
		>
			<span>@ {site.operator.currentEmployer}</span>
			<span>formerly @ {site.operator.formerEmployer}</span>
			<a
				href={site.gardenUrl}
				target="_blank"
				rel="noopener noreferrer"
				data-umami-event="cta_hero_garden"
				class="text-fg hover:text-coin transition-colors"
			>
				portfolio →
			</a>
		</div>
	</div>
</section>

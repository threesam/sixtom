<script lang="ts">
	import { site } from '$lib/content'
</script>

<section class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-4xl px-6">
		<p class="eyebrow text-sm">sixtom — async sprints</p>
		<h1
			class="text-fg mt-6 text-5xl leading-[1.02] font-bold tracking-tight md:text-7xl lg:text-8xl"
		>
			{site.hero.h1}
		</h1>
		<p class="text-fg-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
			{site.hero.subhead}
		</p>
		<div class="mt-12">
			<a
				href={site.bookingUrl}
				data-umami-event="cta_hero_book"
				class="btn-accent px-8 py-4 text-lg hover:opacity-90"
				rel="noopener noreferrer"
				target="_blank"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
		<p class="text-fg-subtle mt-12 text-xs tracking-widest uppercase">
			@ {site.operator.currentEmployer} · formerly @ {site.operator.formerEmployer} ·
			<a
				href={site.gardenUrl}
				target="_blank"
				rel="noopener noreferrer"
				data-umami-event="cta_hero_garden"
				class="hover:text-coin transition-colors"
			>
				portfolio →
			</a>
		</p>
	</div>
</section>

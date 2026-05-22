<script lang="ts">
	import { site } from '$lib/content'
</script>

<section class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-4xl px-6">
		<p class="eyebrow text-sm">sixtom</p>
		<h1
			class="text-fg mt-6 text-5xl leading-[1.02] font-bold tracking-tight md:text-7xl lg:text-8xl"
		>
			<span class="block">it works for you.</span>
			<span class="block">it dies in production.</span>
		</h1>
		<p class="text-fg-muted mt-8 max-w-2xl text-base leading-relaxed md:text-xl">
			the demo was the easy part. i ship <span class="text-fg">solutions</span>.
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

<script lang="ts">
	import { site } from '$lib/content'
</script>

<section class="snap-section bg-surface relative overflow-hidden">
	<!-- Atmospheric glow, desktop only — gives the oversized type depth instead of
	     floating on flat black. Hidden on mobile so the mobile layout is untouched. -->
	<div
		class="pointer-events-none absolute top-1/2 left-[-12%] hidden h-[75vh] w-[75vh] -translate-y-1/2 rounded-full opacity-[0.08] blur-[130px] md:block"
		style="background: radial-gradient(circle, var(--color-accent) 0%, transparent 70%)"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto w-full max-w-6xl px-6">
		<h1 class="text-fg">
			<span class="eyebrow block text-sm md:text-base" data-hero style="--rise: 0ms">AI built</span>
			<span
				class="mt-2 block text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl lg:text-8xl lg:leading-[0.92] xl:text-[7.5rem]"
				data-hero
				style="--rise: 80ms">your demo.</span
			>
			<span class="eyebrow mt-10 block text-sm md:text-base" data-hero style="--rise: 160ms"
				>i build</span
			>
			<span
				class="mt-2 block text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl lg:text-8xl lg:leading-[0.92] xl:text-[7.5rem]"
				data-hero
				style="--rise: 240ms">your solution.</span
			>
		</h1>
		<p
			class="text-fg-muted mt-8 max-w-2xl text-base leading-relaxed md:text-xl"
			data-hero
			style="--rise: 340ms"
		>
			what's the <span class="text-accent">X</span> between you and peace of mind?
		</p>
		<div class="mt-12" data-hero style="--rise: 440ms">
			<a
				href="/book"
				data-umami-event="cta_hero_book"
				class="btn-accent px-8 py-4 text-lg hover:opacity-90"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
</section>

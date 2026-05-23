<script lang="ts">
	import { site } from '$lib/content'

	// Shared headline shape; size is per-line so "your demo." (the setup) sits a
	// notch below "your solution." (the payoff). mt-1 keeps each line tight to its
	// eyebrow.
	const headlineBase = 'mt-1 block leading-[1.05] font-bold tracking-tight lg:leading-[0.92]'
	const solutionSize = 'text-4xl md:text-6xl lg:text-8xl xl:text-[7.5rem]'
	const demoSize = 'text-[1.95rem] md:text-[3.1rem] lg:text-[5rem] xl:text-[6.25rem]'
</script>

<section class="snap-section bg-surface relative">
	<!-- Bubble field (threesam day20 "sea of shapes" port), full-bleed behind the
	     text. Its own overflow-hidden wrapper clips the bleed without constraining
	     the section (oversized type can exceed 100svh on short/zoomed viewports and
	     must stay un-clipped). Animated by static/bubbles.js (wired in app.html) so
	     the page keeps csr=false — the canvas is plain markup that survives
	     no-hydration; the script no-ops elsewhere. Decorative + aria-hidden; opacity
	     ramps to 0 on the left so it can't hurt text contrast where it overlaps the
	     copy. -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<canvas data-bubble class="absolute inset-0 block h-full w-full"></canvas>
	</div>

	<div class="relative mx-auto w-full max-w-6xl px-6">
		<h1 class="text-fg">
			<span class="eyebrow block text-sm leading-none lg:text-base" data-hero style="--rise: 0ms"
				>AI built</span
			>
			<span class="{headlineBase} {demoSize} text-fg-muted" data-hero style="--rise: 80ms"
				>your demo.</span
			>
			<span
				class="eyebrow mt-10 block text-sm leading-none lg:text-base"
				data-hero
				style="--rise: 160ms">i build</span
			>
			<span class="{headlineBase} {solutionSize}" data-hero style="--rise: 240ms"
				>your solution.</span
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
				class="btn-accent px-8 py-4 text-lg font-bold hover:opacity-90"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
</section>

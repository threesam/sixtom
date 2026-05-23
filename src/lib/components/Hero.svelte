<script lang="ts">
	import { site } from '$lib/content'

	const headlineClass =
		'mt-2 block text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl lg:text-8xl lg:leading-[0.92] xl:text-[7.5rem]'
</script>

<section class="snap-section bg-surface relative">
	<!-- Bubble field (threesam day20 "sea of shapes" port), behind the text. Its
	     own overflow-hidden wrapper clips the bleed without constraining the
	     section (oversized type can exceed 100svh on short/zoomed viewports and
	     must stay un-clipped). Desktop: a square snapped right into the void beside
	     the copy. Mobile: a square centered behind the copy (no right-side void on
	     a phone). Animated by static/bubbles.js (wired in app.html) so the page
	     keeps csr=false — the canvas is plain markup that survives no-hydration;
	     the script no-ops elsewhere. Decorative + aria-hidden; alpha ramps to 0 on
	     the left so it can't hurt text contrast where it overlaps the copy. -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<div
			class="absolute aspect-square max-md:top-1/2 max-md:left-1/2 max-md:h-[80%] max-md:-translate-x-1/2 max-md:-translate-y-1/2 md:inset-y-[8%] md:right-[-6%]"
		>
			<canvas data-bubble class="block h-full w-full"></canvas>
		</div>
	</div>

	<div class="relative mx-auto w-full max-w-6xl px-6">
		<h1 class="text-fg">
			<span class="eyebrow block text-sm lg:text-base" data-hero style="--rise: 0ms">AI built</span>
			<span class={headlineClass} data-hero style="--rise: 80ms">your demo.</span>
			<span class="eyebrow mt-10 block text-sm lg:text-base" data-hero style="--rise: 160ms"
				>i build</span
			>
			<span class={headlineClass} data-hero style="--rise: 240ms">your solution.</span>
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

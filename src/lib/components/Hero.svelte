<script lang="ts">
	import { site } from '$lib/content'

	// Centered, escalating hierarchy: "AI built your demo." (smaller — the setup),
	// then "i build your solution." bigger with only "your solution." bright. The
	// payoff is one line on desktop; it only breaks (i build / your solution) on
	// narrow screens, where it wouldn't fit otherwise.
	const setupSize = 'block text-2xl leading-[1.15] md:text-3xl lg:text-5xl'
	const payoffSize = 'block text-4xl leading-[1.05] md:text-5xl lg:text-7xl'
</script>

<section class="snap-section bg-surface relative">
	<!-- Bubble field ("sea of shapes"), full-bleed and rendered crisp at native pixel
	     size. A left→right black overlay darkens the text side for contrast while
	     leaving a lighter veil on the field. overflow-hidden keeps it from adding
	     scrollbars without constraining the section (oversized type can exceed 100svh
	     and must stay un-clipped). Animated by static/bubbles.js (wired in app.html)
	     so the page keeps csr=false — the canvas is plain markup that survives
	     no-hydration; the script no-ops elsewhere. Decorative + aria-hidden. -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<canvas data-bubble class="absolute inset-0 block h-full w-full"></canvas>
		<div class="absolute inset-0 bg-gradient-to-r from-[#000000d9] to-[#00000073]"></div>
	</div>

	<div class="relative mx-auto w-full max-w-6xl px-6 text-center">
		<h1 class="text-fg-muted font-bold tracking-tight">
			<span class={setupSize} data-hero style="--rise: 0ms">AI built your demo.</span>
			<span class={payoffSize} data-hero style="--rise: 80ms"
				>i build <br class="md:hidden" /><span class="text-fg">your solution.</span></span
			>
		</h1>
		<p
			class="text-fg mx-auto mt-8 max-w-2xl text-lg leading-relaxed md:text-2xl"
			data-hero
			style="--rise: 200ms"
		>
			what's the X between you<br />and peace of mind?
		</p>
		<div class="mt-12" data-hero style="--rise: 300ms">
			<a
				href="/book"
				data-umami-event="cta_hero_book"
				class="btn-accent block w-full px-8 py-4 text-center text-lg font-bold hover:opacity-90 md:inline-block md:w-auto"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
</section>

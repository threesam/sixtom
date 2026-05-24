<script lang="ts">
	import { site } from '$lib/content'

	// One sentence broken into its two clauses (a clause per line); everything is
	// damped except "your solution." (the payoff) so the eye lands on the offering.
	// Mobile is sized so the longer clause still fits on one line.
	const headlineClass =
		'text-[1.75rem] leading-[1.15] font-bold tracking-tight sm:text-4xl md:text-6xl lg:text-7xl'
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

	<div class="relative mx-auto w-full max-w-6xl px-6">
		<h1 class="{headlineClass} text-fg-muted" data-hero style="--rise: 0ms">
			AI built your demo.<br />i build <span class="text-fg">your solution.</span>
		</h1>
		<p
			class="text-fg mt-8 max-w-2xl text-lg leading-relaxed md:text-2xl"
			data-hero
			style="--rise: 120ms"
		>
			what's the X between you and peace of mind?
		</p>
		<div class="mt-12" data-hero style="--rise: 240ms">
			<a
				href="/book"
				data-umami-event="cta_hero_book"
				class="btn-accent block w-full px-8 py-4 text-center text-lg font-bold hover:opacity-90 md:inline-block md:w-auto md:text-left"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
</section>

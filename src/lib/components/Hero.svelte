<script lang="ts">
	import { site } from '$lib/content'
</script>

<section class="snap-section bg-surface relative">
	<!-- Bubble field ("sea of shapes"), full-bleed and rendered crisp at native pixel
	     size. Mobile (portrait, centered copy): a symmetric vertical scrim — dark
	     behind the copy, easing off so the field glows top & bottom. Desktop: a
	     left→right scrim. overflow-hidden keeps it from adding scrollbars without
	     constraining the section (oversized type can exceed 100svh and must stay
	     un-clipped). Animated by static/bubbles.js (wired in app.html) so the page
	     keeps csr=false — the canvas is plain markup that survives no-hydration; the
	     script no-ops elsewhere. Decorative + aria-hidden. -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<canvas data-bubble class="absolute inset-0 block h-full w-full"></canvas>
		<div
			class="absolute inset-0 bg-gradient-to-b from-[#0000005c] via-[#000000eb] to-[#00000080] md:hidden"
		></div>
		<div
			class="absolute inset-0 hidden bg-gradient-to-r from-[#000000d9] to-[#00000073] md:block"
		></div>
	</div>

	<div class="relative mx-auto w-full max-w-6xl px-6 text-center">
		<!-- One sentence per line, each fluid (vw) so it fills the width on mobile,
		     clamped for desktop. Only "your solution." (the payoff) is bright. -->
		<h1 class="font-bold tracking-tight" data-hero style="--rise: 0ms">
			<span class="text-fg-muted block leading-[1.1] text-[clamp(1.25rem,7.1vw,3rem)]"
				>AI built your first draft.</span
			>
			<span class="text-fg-muted block leading-[1.05] text-[clamp(1.5rem,8.2vw,3.5rem)]"
				>i build <span class="text-fg">your solution.</span></span
			>
		</h1>
		<p
			class="text-fg mx-auto mt-8 max-w-2xl text-lg leading-relaxed md:text-2xl"
			data-hero
			style="--rise: 120ms"
		>
			what's the X between you<br />and peace of mind?
		</p>
		<div class="mt-12" data-hero style="--rise: 240ms">
			<a
				href="/book"
				data-umami-event="cta_hero_book"
				class="btn-accent block w-full px-8 py-4 text-center text-xl font-bold hover:opacity-90 md:inline-block md:w-auto"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
</section>

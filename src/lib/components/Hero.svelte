<script lang="ts">
	import XMark from './XMark.svelte'
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

	<div class="relative mx-auto w-full max-w-6xl px-6 text-left md:text-center">
		<!-- Lead with the question as the hero title; the positioning line follows,
		     bright and bold (the wedge, not a footnote), with "your solution" the
		     emphasized payoff. -->
		<h1
			class="text-fg text-[clamp(2.25rem,9.5vw,4.75rem)] font-bold leading-[1.08] tracking-tight"
			data-hero
			style="--rise: 0ms"
		>
			what's the <XMark class="bg-fg text-surface" /> between you and peace of mind?
		</h1>
		<p
			class="text-fg mx-auto mt-6 max-w-3xl text-xl font-medium leading-snug md:mt-8 md:text-3xl"
			data-hero
			style="--rise: 120ms"
		>
			AI built your first draft. i build <span class="font-bold whitespace-nowrap">your solution.</span>
		</p>
		<div class="mt-12" data-hero style="--rise: 240ms">
			<a
				href="/book"
				data-umami-event="cta_hero_book"
				class="block w-full rounded-full bg-coin px-8 py-4 text-center text-xl font-bold text-[#161616] transition hover:brightness-110 md:inline-block md:w-auto md:px-12 md:py-5 md:text-2xl"
			>
				solve for <XMark class="bg-[#161616] text-coin" />
			</a>
		</div>
	</div>
</section>

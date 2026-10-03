<script lang="ts">
	import { grandSlam } from '$lib/content'

	// Two display beats from the one prose headline; periods drop on screen
	// (the line break is the punctuation) but survive in content and meta.
	// Sentences past the first join into beat two so copy is never dropped.
	const [beatOne, ...rest] = grandSlam.headline
		.split(/(?<=\.)\s+/)
		.map((beat) => beat.replace(/\.$/, ''))
	const beatTwo = rest.join(' ')
	// Phones: each beat is sized to span the full column, so the shorter beat sets
	// bigger. Font size per unit of line width, measured for this headline in this
	// face (0.12688 / 0.15218) and shaved 0.5% so rounding never wraps. No JS on
	// this page, so the fit is CSS: container width * ratio. Re-measure when the
	// headline changes; e2e/hero-responsive.spec.ts fails if either beat drifts.
	const FIT = [0.1262, 0.1514]
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
			class="absolute inset-0 bg-gradient-to-b from-black/65 via-black/92 to-black/50 md:hidden"
		></div>
		<div
			class="absolute inset-0 hidden bg-[radial-gradient(ellipse_60%_70%_at_50%_45%,rgb(0_0_0/0.82),rgb(0_0_0/0.38))] md:block"
		></div>
	</div>

	<div class="relative mx-auto w-full max-w-6xl px-6 py-12 text-center md:py-20">
		<h1
			class="text-fg @container leading-[1.04] font-bold tracking-tight md:text-[clamp(2.5rem,9.5vw,5.75rem)]"
		>
			<span
				class="text-fg-muted block text-balance max-md:text-[length:calc(100cqw*var(--fit))] max-md:tracking-tight max-md:whitespace-nowrap"
				style="--fit: {FIT[0]}">{beatOne}</span
			>
			<span
				class="block text-balance max-md:text-[length:calc(100cqw*var(--fit))] max-md:tracking-tight max-md:whitespace-nowrap"
				style="--fit: {FIT[1]}">{beatTwo}</span
			>
		</h1>
		<!-- Three text elements: headline (the problem), lead (what you get), CTAs.
		     offerLine stays in content for the JSON-LD description. -->
		<p class="text-fg mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-balance md:text-xl">
			{grandSlam.lead}
		</p>
		<div class="mt-10 flex flex-col items-center gap-4 md:mt-12">
			<a
				href="#waitlist"
				data-umami-event="cta_hero_waitlist"
				class="btn-accent w-full px-8 py-3.5 text-center text-lg font-bold md:w-auto md:px-12 md:py-5 md:text-2xl"
			>
				join the waitlist →
			</a>
			<a
				href="#waitlist"
				data-umami-event="cta_hero_teardown"
				class="text-fg-muted hover:text-fg text-xs tracking-widest uppercase transition-colors"
			>
				or start with a teardown
			</a>
		</div>
	</div>
</section>

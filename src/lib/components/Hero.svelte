<script lang="ts">
	import { grandSlam } from '$lib/content'
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

	<div class="relative mx-auto w-full max-w-6xl px-6 py-16 text-left md:py-20 md:text-center">
		<p class="eyebrow text-fg-muted text-xs md:text-sm">{grandSlam.chip}</p>
		<!-- One string in content; two beats on screen. The stray space between the
		     block spans keeps textContent equal to the plain headline. -->
		<h1
			class="text-fg mt-6 text-[clamp(2.75rem,10.5vw,6.5rem)] leading-[1.04] font-bold tracking-tight"
		>
			{#each grandSlam.headline.split(/(?<=\.)\s+/) as beat, i (beat)}
				{#if i > 0}{' '}{/if}<span class="block text-balance">{beat}</span>
			{/each}
		</h1>
		<p class="text-fg-muted mx-auto mt-6 max-w-3xl text-base leading-relaxed md:text-lg">
			{grandSlam.lead}
		</p>
		<p class="text-fg mx-auto mt-6 max-w-3xl text-xl leading-snug font-medium md:text-2xl">
			{grandSlam.offerLine}
		</p>
		<div class="mt-10 flex flex-col items-start gap-4 md:items-center">
			<a
				href="#waitlist"
				data-umami-event="cta_hero_waitlist"
				class="btn-accent w-full px-8 py-4 text-center text-xl font-bold md:w-auto md:px-12 md:py-5 md:text-2xl"
			>
				join the waitlist →
			</a>
			<a
				href="#waitlist"
				data-umami-event="cta_hero_teardown"
				class="text-fg hover:text-fg-subtle text-xs tracking-widest uppercase transition-colors"
			>
				or get a free teardown
			</a>
		</div>
		<ul class="mt-12 flex list-none flex-wrap gap-x-10 gap-y-4 p-0 md:justify-center">
			{#each grandSlam.stats as stat (stat.label)}
				<li>
					<p class="text-fg text-lg font-bold tabular-nums md:text-xl">{stat.value}</p>
					<p class="text-fg-subtle text-xs tracking-widest uppercase">{stat.label}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

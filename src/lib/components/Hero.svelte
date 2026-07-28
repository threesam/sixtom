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
			class="absolute inset-0 bg-gradient-to-b from-black/36 via-black/92 to-black/50 md:hidden"
		></div>
		<div class="absolute inset-0 hidden bg-gradient-to-r from-black/85 to-black/45 md:block"></div>
	</div>

	<div class="relative mx-auto w-full max-w-6xl px-6 py-16 text-left md:py-20 md:text-center">
		<p class="eyebrow text-fg-subtle text-xs md:text-sm">{grandSlam.chip}</p>
		<h1
			class="text-fg mt-6 text-[clamp(2.25rem,8.5vw,4.5rem)] leading-[1.08] font-bold tracking-tight text-balance"
		>
			{grandSlam.headline}
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
				class="text-fg-subtle hover:text-coin text-xs tracking-widest uppercase transition-colors"
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

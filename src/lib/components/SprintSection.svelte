<script lang="ts">
	import { site } from '$lib/content'
</script>

<section id="sprint" class="snap-section bg-neutral-900">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class="text-coin text-sm tracking-widest uppercase">The offer</p>
		<h2 class="mt-2 text-4xl font-bold tracking-tight text-neutral-100 md:text-6xl">
			The {site.offer.name}.
		</h2>
		<p class="mt-8 text-xl leading-relaxed text-neutral-300 md:text-2xl">
			A working site by Friday. Read access in. Working version live mid-sprint. Before-and-after
			measured.
		</p>
		<p class="text-coin mt-8 text-2xl font-semibold md:text-3xl">
			${site.offer.priceUSD.toLocaleString()} fixed. {site.offer.cadence}
		</p>
		<p class="mt-6 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">
			If the working version isn't on track by day 3, we pause. You keep what we've built and pay
			only for time spent.
		</p>
		<div class="mt-12">
			<a
				href={site.bookingUrl}
				class="bg-coin inline-block rounded-md px-8 py-4 text-lg font-medium text-neutral-950 transition-opacity hover:opacity-90"
				rel="noopener noreferrer"
				target="_blank"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
</section>

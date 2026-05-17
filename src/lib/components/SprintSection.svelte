<script lang="ts">
	import { site } from '$lib/content'
</script>

<section id="sprint" class="snap-section bg-neutral-900">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class="text-coin text-sm tracking-widest uppercase">how it works</p>
		<h2 class="mt-2 text-4xl font-bold tracking-tight text-neutral-100 md:text-6xl">
			The {site.offer.name}.
		</h2>
		<p class="mt-6 text-lg leading-relaxed text-neutral-300 md:text-xl">
			{site.offer.promise}
		</p>

		<dl class="mt-12 space-y-4 border-l border-neutral-800 pl-6">
			{#each site.process as { label, body } (label)}
				<div class="flex flex-col gap-1 md:flex-row md:gap-6">
					<dt class="text-coin w-28 shrink-0 text-sm font-semibold tracking-wider uppercase">
						{label}
					</dt>
					<dd class="text-base leading-relaxed text-neutral-300 md:text-lg">{body}</dd>
				</div>
			{/each}
		</dl>

		<dl class="mt-12 grid grid-cols-3 gap-6 border-t border-neutral-800 pt-10">
			{#each site.stats as { value, label } (label)}
				<div>
					<dt class="text-coin text-2xl font-bold tracking-tight md:text-4xl">{value}</dt>
					<dd class="mt-1 text-xs tracking-widest text-neutral-500 uppercase">{label}</dd>
				</div>
			{/each}
		</dl>

		<p class="text-coin mt-12 text-2xl font-semibold md:text-3xl">
			${site.offer.priceUSD.toLocaleString()} fixed. {site.offer.cadence}
		</p>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">
			If we're off track by day 3, we stop. You keep what we built. Pay for the time, that's it.
		</p>

		<blockquote
			class="mt-10 border-l-2 border-neutral-700 pl-6 text-base leading-relaxed text-neutral-300 italic md:text-lg"
		>
			“{site.testimonial.quote}”
			<footer class="mt-2 text-sm text-neutral-500 not-italic">
				— {site.testimonial.attribution}
			</footer>
		</blockquote>

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

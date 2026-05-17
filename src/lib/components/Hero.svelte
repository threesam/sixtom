<script lang="ts">
	import { site } from '$lib/content'
</script>

<section class="snap-section bg-neutral-950">
	<div class="mx-auto w-full max-w-4xl px-6">
		<p class="text-coin text-sm tracking-widest uppercase">sixtom — async sprints</p>
		<h1
			class="mt-6 text-5xl leading-[1.02] font-bold tracking-tight text-neutral-100 md:text-7xl lg:text-8xl"
		>
			{site.hero.h1}
		</h1>
		<p class="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">
			{site.hero.subhead}
		</p>
		<p class="text-coin mt-10 text-2xl md:text-3xl">
			${site.audit.priceUSD} audit → ${site.sprint.priceUSD.toLocaleString()} sprint. By appointment.
		</p>
		<div class="mt-12">
			<a
				href={site.bookingUrl}
				data-umami-event="cta_hero_book"
				class="bg-coin inline-block rounded-md px-8 py-4 text-lg font-medium text-neutral-950 transition-opacity hover:opacity-90"
				rel="noopener noreferrer"
				target="_blank"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
		<p class="mt-12 text-xs tracking-widest text-neutral-500 uppercase">
			@ {site.operator.currentEmployer} · Formerly @ {site.operator.formerEmployer}
		</p>
	</div>
</section>

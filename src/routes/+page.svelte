<script lang="ts">
	import Hero from '$lib/components/Hero.svelte'
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import { site } from '$lib/content'

	const h2Class =
		'text-fg text-3xl leading-tight font-semibold tracking-tight md:text-5xl lg:text-6xl'
	const bodyClass =
		'text-fg-muted mt-8 max-w-2xl text-base leading-relaxed md:text-lg'
</script>

<Hero />

<!-- who this is for -->
<section class="snap-section surface-uv">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>who this is for</h2>
		<p class={bodyClass}>
			you already built it. real customers are about to break it — or already are. you know it.
		</p>
	</div>
</section>

<!-- recognize any of these -->
<section class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>recognize any of these?</h2>
		<ul class="text-fg-muted mt-10 space-y-6 text-base leading-relaxed md:text-lg">
			<li>
				<span class="text-fg font-semibold">uptime.</span>
				your biggest customer wants a number you can't give.
			</li>
			<li>
				<span class="text-fg font-semibold">security.</span>
				a sale is stuck waiting on a review you don't pass.
			</li>
			<li>
				<span class="text-fg font-semibold">scale.</span>
				investors keep asking how. you keep saying "we'll figure it out."
			</li>
			<li>
				<span class="text-fg font-semibold">peace of mind.</span>
				every time you launch a feature, something else breaks.
			</li>
		</ul>
	</div>
</section>

<!-- what's it costing you -->
<section class="snap-section surface-uv">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>what's it costing you?</h2>
		<p class={bodyClass}>
			your time fighting fires, times your hourly rate, times how much slower it gets every
			month. usually six figures a year.
			<a
				href="/tax"
				data-umami-event="cta_tax_calc"
				class="text-fg hover:text-coin underline underline-offset-4 transition-colors"
			>
				run yours →
			</a>
		</p>
	</div>
</section>

<!-- how this works -->
<section id="offers" class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>how this works</h2>
		<p class={bodyClass}>
			2 weeks. fixed scope, agreed up front. you see progress every day. live and stable in 10
			days. every change reviewed before it goes live. you own everything.
			<span class="text-fg font-semibold">${site.sprint.priceUSD.toLocaleString()} flat</span>
			(or {site.sprint.paymentPlan}). 1 client a month.
		</p>
	</div>
</section>

<!-- why me -->
<section class="snap-section surface-uv">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>why me</h2>
		<p class={bodyClass}>
			day job: lead engineer at Made In Cookware. multi-million visitors a month. i rebuilt my
			own creative work — the Garden — on the same methods. 5 hours of build time, 40% smaller,
			every score up.
		</p>
		<p class="mt-6 flex flex-wrap gap-6 text-sm">
			<a
				href={site.gardenUrl}
				target="_blank"
				rel="noopener noreferrer"
				data-umami-event="cta_garden_link_why"
				class="text-fg hover:text-coin underline underline-offset-4 transition-colors"
			>
				see the work →
			</a>
			<a
				href="/log/garden-party"
				data-umami-event="cta_case_study"
				class="text-fg-muted hover:text-coin underline underline-offset-4 transition-colors"
			>
				the writeup →
			</a>
		</p>
		<blockquote
			class="text-fg-muted mt-12 max-w-2xl text-base leading-relaxed italic md:text-lg"
		>
			“{site.testimonial.quote}”
			<footer class="text-fg-subtle mt-2 text-sm not-italic">
				— {site.testimonial.attribution}
			</footer>
		</blockquote>
	</div>
</section>

<!-- the ask -->
<section class="snap-section bg-surface !justify-between">
	<div class="flex w-full flex-1 items-center px-6 py-16">
		<div class="mx-auto w-full max-w-3xl">
			<h2
				class="text-fg text-4xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl"
			>
				want to look at it together?
			</h2>
			<p class="text-fg-muted mt-8 text-base leading-relaxed md:text-lg">
				${site.audit.priceUSD.toLocaleString()} to look at what you've got. within a week: a written
				breakdown plus a short video walkthrough. credited toward the sprint if you book one within
				30 days.
			</p>
			<a
				href="/book"
				data-umami-event="cta_final_book"
				class="btn-accent mt-12 inline-block px-8 py-4 text-lg hover:opacity-90"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
	<SiteFooter />
</section>

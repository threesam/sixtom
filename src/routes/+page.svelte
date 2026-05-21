<script lang="ts">
	import Hero from '$lib/components/Hero.svelte'
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import { site } from '$lib/content'
</script>

<Hero />

<!-- who this is for -->
<section class="snap-section surface-uv">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class="eyebrow text-fg text-sm">— who this is for</p>
		<h2
			class="text-fg mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl lg:text-6xl"
		>
			you already built it. it works in dev.
		</h2>
		<p class="text-fg-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
			real users are going to break it. you know it. that's why you're here.
		</p>
	</div>
</section>

<!-- recognize any of these -->
<section class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class="eyebrow text-sm">— recognize any of these?</p>
		<h2
			class="text-fg mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl lg:text-6xl"
		>
			safety. security. scalability. peace of mind.
		</h2>
		<ul class="text-fg-muted mt-10 space-y-4 text-lg leading-relaxed md:text-xl">
			<li>— the 2am bug you can't reproduce.</li>
			<li>— the SOC2 or SSO review you can't pass yet.</li>
			<li>— traffic that breaks what worked yesterday.</li>
			<li>— code you can't defend in a review.</li>
		</ul>
	</div>
</section>

<!-- what's it costing you -->
<section class="snap-section surface-uv">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class="eyebrow text-fg text-sm">— what's it costing you?</p>
		<p
			class="text-fg mt-4 text-3xl leading-tight font-semibold tracking-tight italic md:text-5xl lg:text-6xl"
		>
			every week you wait, the codebase grows past the wall.
		</p>
		<p class="text-fg-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
			firefighting hours × your hourly rate × the slowdown multiplier. the number is usually six
			figures a year, and it's quietly compounding.
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
		<p class="eyebrow text-sm">— how this works</p>
		<h2
			class="text-fg mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl lg:text-6xl"
		>
			a 2-week sprint. live in production day 10.
		</h2>
		<p class="text-fg-muted mt-8 text-lg leading-relaxed md:text-xl">
			fixed scope agreed up front. daily drops. i sit alongside your existing workstream —
			ride-along — scope what needs to ship, then ship it. you own the code.
			<span class="text-fg font-semibold">${site.sprint.priceUSD.toLocaleString()} flat</span>
			(or {site.sprint.paymentPlan}). 1 client a month, by appointment.
		</p>
	</div>
</section>

<!-- why me -->
<section class="snap-section surface-uv">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class="eyebrow text-fg text-sm">— why me</p>
		<p
			class="text-fg mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl lg:text-6xl"
		>
			i ran this on my own site first.
		</p>
		<p class="text-fg-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
			30,000 lines of React, ported to SvelteKit under tight review in ~5–6 hours of active build.
			40% less code, every lighthouse score up.
			<a
				href="/log/garden-party"
				data-umami-event="cta_case_study"
				class="text-fg hover:text-coin underline underline-offset-4 transition-colors"
			>
				the case study →
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
			<p class="eyebrow text-sm">— want to look at it together?</p>
			<h2
				class="text-fg mt-4 text-4xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl"
			>
				let's see if a sprint fits.
			</h2>
			<p class="text-fg-muted mt-8 text-lg leading-relaxed md:text-xl">
				${site.audit.priceUSD.toLocaleString()} working session. you send your repo, i send back a
				1-pager and a 15-min Loom — your X, my solve, what it's costing you to leave it as-is.
				credited toward the sprint if you book one within 30 days.
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

<script lang="ts">
	import Hero from '$lib/components/Hero.svelte'
	import BookCta from '$lib/components/BookCta.svelte'
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import { site } from '$lib/content'

	const h2Class =
		'text-fg text-3xl leading-tight font-semibold tracking-tight md:text-5xl lg:text-6xl'
	const bodyClass = 'text-fg-muted mt-8 max-w-2xl text-base leading-relaxed md:text-lg'
</script>

<!-- Scroll-snap is the home page's full-screen-section experience only. Scope it
     to this route via the head so every other (overflowing) route — book,
     notify, tax, … — scrolls freely instead of being snap-jacked. -->
<svelte:head>
	<style>
		html {
			scroll-snap-type: y mandatory;
		}
	</style>
</svelte:head>

<Hero />

<!-- who this is for -->
<section class="snap-section surface-uv">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>who is this for?</h2>
		<p class={bodyClass}>you already built it. you're probably one of these:</p>
		<ul class="text-fg-muted mt-10 space-y-6 text-base leading-relaxed md:text-lg">
			<li>
				<span class="text-fg font-semibold">the demo darling.</span>
				it killed the pitch, then folded the first time a dozen real people logged in.
			</li>
			<li>
				<span class="text-fg font-semibold">paying &amp; breaking.</span>
				real customers, real revenue, and a 3am pager that won't quit.
			</li>
			<li>
				<span class="text-fg font-semibold">about to scale.</span>
				someone just asked you to 10× the users — you said yes and started sweating.
			</li>
			<li>
				<span class="text-fg font-semibold">enterprise-blocked.</span>
				one contract away from real money, stuck behind a SOC2 / SSO box you can't tick.
			</li>
		</ul>
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

<!-- what are you losing -->
<section class="snap-section surface-uv">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>what are you losing?</h2>
		<p class="text-fg mt-10 text-2xl font-semibold tabular-nums md:text-4xl">
			deals × value × time = $
		</p>
		<p class="text-fg-muted mt-6 text-base leading-relaxed md:text-lg">
			typical case: 1/mo × $50k × 12 = ~$600k/yr. plus the weekends. plus the sleep.
		</p>
		<p class="mt-6">
			<a
				href="/tax"
				data-umami-event="cta_tax_calc"
				class="text-fg hover:text-coin text-base underline underline-offset-4 transition-colors md:text-lg"
			>
				run yours →
			</a>
		</p>
	</div>
</section>

<!-- how this works -->
<section id="offers" class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>only two weeks?</h2>
		<div class="text-fg-muted mt-10 space-y-2 text-base leading-relaxed md:text-lg">
			<p>daily progress.</p>
			<p>the answer when they ask.</p>
			<p>your weekends back.</p>
		</div>
		<p class="text-fg-subtle mt-8 text-sm md:text-base">
			${site.sprint.priceUSD.toLocaleString()} flat. or {site.sprint.paymentPlan}. 1 client a month.
		</p>
	</div>
</section>

<!-- why me -->
<section class="snap-section surface-uv">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>why me?</h2>
		<p class={bodyClass}>
			day job: lead engineer at Made In Cookware. multi-million visitors a month. i rebuilt my own
			creative work — the Garden — on the same methods. 5 hours of build time, 40% smaller, every
			score up.
		</p>
		<p class="mt-6 flex flex-wrap gap-6 text-sm">
			<a
				href={site.gardenUrl}
				target="_blank"
				rel="noopener noreferrer"
				data-umami-event="cta_garden_link_why"
				class="text-fg hover:text-coin transition-colors"
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
		<blockquote class="text-fg-muted mt-12 max-w-2xl text-base leading-relaxed italic md:text-lg">
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
			<h2 class="text-fg text-4xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl">
				want to look at it together?
			</h2>
			<p class="text-fg-muted mt-8 text-base leading-relaxed md:text-lg">
				${site.audit.priceUSD.toLocaleString()} to look at what you've got. within a week: a written breakdown
				plus a short video walkthrough. credited toward the sprint if you book one within 30 days.
			</p>
			<BookCta event="cta_final_book" class="mt-12" />
		</div>
	</div>
	<SiteFooter />
</section>

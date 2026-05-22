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
			you already built it. it works when you use it.
		</h2>
		<p class="text-fg-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
			real customers are about to break it — or already are. you know it. that's why you're here.
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
			uptime. security. scale. peace of mind.
		</h2>
		<ul class="text-fg-muted mt-10 space-y-4 text-lg leading-relaxed md:text-xl">
			<li>— your biggest customer is asking about uptime you can't promise.</li>
			<li>— a sale is stuck waiting on a security review you don't pass yet.</li>
			<li>— you're afraid to launch new features because something always breaks.</li>
			<li>— investors are asking how this scales and the answer is "we'll figure it out."</li>
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
			every week you wait, it gets harder for anyone to touch — including the AI you built it with.
		</p>
		<p class="text-fg-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
			your time fighting fires, times what your time is worth, times how much slower it gets every
			month. usually six figures a year, compounding quietly.
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
			a 2-week sprint. live and stable in 10 days.
		</h2>
		<p class="text-fg-muted mt-8 text-lg leading-relaxed md:text-xl">
			fixed scope agreed up front — no surprises, no creep. you see progress every day. i sit
			alongside whatever you've already built (yours, your contractor's, doesn't matter) and fix
			what's blocking you. every change is reviewed before it goes live. you own everything.
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
			i ship for a brand you know by day.
		</p>
		<p class="text-fg-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
			lead engineer at Made In Cookware — multi-million visitors a month. i rebuilt my own creative
			work on the same methods: 5 hours of actual build time, 40% smaller, every measurable score
			went up.
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
			<p class="eyebrow text-sm">— want to look at it together?</p>
			<h2
				class="text-fg mt-4 text-4xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl"
			>
				let's see if a sprint fits.
			</h2>
			<p class="text-fg-muted mt-8 text-lg leading-relaxed md:text-xl">
				${site.audit.priceUSD.toLocaleString()} to look at what you've got. send me the link or
				access, however your build is set up. within a week you get a written breakdown and a
				short video walkthrough — what's broken, what i'd fix, what it's costing you to leave it.
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

<script lang="ts">
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import { site } from '$lib/content'

	const teardownPrice = `$${site.teardown.priceUSD.toLocaleString('en-US')}`
</script>

<svelte:head>
	<title>terms | SIXTOM</title>
	<meta
		name="description"
		content="how engagement with sixtom works. plain-English terms for the sprint, the day-10 guarantee, and the teardown."
	/>
	<meta property="og:title" content="terms | SIXTOM" />
	<meta
		property="og:description"
		content="how engagement with sixtom works. plain-English terms for the sprint, the day-10 guarantee, and the teardown."
	/>
</svelte:head>

<div class="bg-surface flex min-h-svh flex-col">
	<div class="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
		<header class="mb-16">
			<a
				href="/"
				class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
				data-umami-event="legal_back_home"
			>
				sixtom
			</a>
			<p class="eyebrow mt-12 text-sm">legal</p>
			<h1 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">terms.</h1>
			<p class="text-fg-muted mt-6 text-lg leading-relaxed">
				how engagement works. pricing, scope, and cadence live on the home page; this page covers
				the boring bits when it goes sideways.
			</p>
		</header>

		<div class="text-fg-muted space-y-10 text-base leading-relaxed">
			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">the guarantee</h2>
				<p class="mt-3">
					the sprint — live in production by day 10, or the remaining payments are waived. "live"
					means the deploy target we name in writing on the day-0 call. the guarantee clock pauses
					while something i need sits with you — access, approvals, content, feedback — and resumes
					when i have it.
				</p>
				<p class="mt-3">
					the day-5 scope check — if we both see it won't ship in scope, we stop there. you keep
					everything built and pay only for the time used.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">the teardown</h2>
				<p class="mt-3">
					{teardownPrice}, paid up front, credited in full against the sprint if you book one within
					90 days. you get the written findings either way and you own them. it carries no
					obligation on either side — i may decline if your project isn't a fit, and if i decline
					after you've paid, you get all of it back.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">code ownership</h2>
				<p class="mt-3">
					code i write for you is yours. i retain the right to discuss approach and outcomes
					publicly with names and identifying details removed, unless you say otherwise in writing.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">if something breaks</h2>
				<p class="mt-3">
					email me. i'll fix what's mine. implied warranties and indirect or consequential damages
					are excluded, but i'm not going to be difficult about real problems.
				</p>
			</section>

			<p class="text-fg-subtle mt-16 text-xs tracking-widest uppercase">last updated: july 2026</p>
		</div>
	</div>
	<SiteFooter />
</div>

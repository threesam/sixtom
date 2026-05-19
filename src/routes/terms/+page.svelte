<script lang="ts">
	import { site } from '$lib/content'
</script>

<svelte:head>
	<title>terms — sixtom</title>
	<meta
		name="description"
		content="How engagement with sixtom works. Plain-English terms for the audit and async sprint."
	/>
	<link rel="canonical" href={`${site.siteUrl}/terms`} />
</svelte:head>

<div class="bg-surface min-h-screen">
	<div class="mx-auto w-full max-w-3xl px-6 py-20">
		<header class="mb-16">
			<a
				href="/"
				class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
				data-umami-event="legal_back_home"
			>
				← sixtom
			</a>
			<p class="eyebrow mt-12 text-sm">legal</p>
			<h1 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">Terms.</h1>
			<p class="text-fg-muted mt-6 text-lg leading-relaxed">How engagement works. Plain English.</p>
		</header>

		<div class="text-fg-muted space-y-10 text-base leading-relaxed">
			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">Two things I sell</h2>
				<p class="mt-3">
					The {site.audit.name} — ${site.audit.priceUSD}. Send your repo + the thing you've been trying
					to ship; I send back a 1-pager and a 15-min Loom within a week.
				</p>
				<p class="mt-3">
					The {site.sprint.name} — ${site.sprint.priceUSD.toLocaleString()}. Two weeks, fixed scope
					agreed up front, daily drops. Live in production day 10.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">Refunds</h2>
				<p class="mt-3">
					Audit: non-refundable once I've started. Full refund if I haven't started within 7 days of
					payment.
				</p>
				<p class="mt-3">
					Sprint: if by day 5 we both agree it won't ship in scope, we stop. You keep what was built
					and I refund 50%.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">Code ownership</h2>
				<p class="mt-3">
					Code I write for you is yours, no strings. I retain the right to discuss approach and
					outcomes publicly with names and identifying details removed, unless you say otherwise in
					writing.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">If something breaks</h2>
				<p class="mt-3">
					Email me. I'll fix what's mine. Implied warranties and indirect or consequential damages
					are excluded, but I'm not going to be difficult about real problems.
				</p>
			</section>

			<p class="text-fg-subtle mt-16 text-xs tracking-widest uppercase">Last updated: May 2026</p>
		</div>
	</div>
</div>

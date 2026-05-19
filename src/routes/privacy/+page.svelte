<script lang="ts">
	import { site } from '$lib/content'
</script>

<svelte:head>
	<title>privacy — sixtom</title>
	<meta name="description" content="What sixtom collects, what it doesn't, and how to get it deleted." />
	<link rel="canonical" href={`${site.siteUrl}/privacy`} />
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
			<h1 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">Privacy.</h1>
			<p class="text-fg-muted mt-6 text-lg leading-relaxed">The short, honest version.</p>
		</header>

		<div class="text-fg-muted space-y-10 text-base leading-relaxed">
			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">What I collect</h2>
				<p class="mt-3">The email and message you submit through the contact or notify form.</p>
				<p class="mt-3">
					Anonymous traffic data via Umami, self-hosted at analytics.sixtom.com. No cookies, no
					fingerprinting, no IP address storage.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">What I do with it</h2>
				<p class="mt-3">
					Reply to you. Look at aggregate patterns — which pages get traffic, where it comes from.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">What I don't do</h2>
				<p class="mt-3">
					Sell your data. Share it with a third party. Use it for retargeting. Pretend GDPR doesn't
					exist.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">Removal</h2>
				<p class="mt-3">
					Email the address you submitted from and I'll delete what I have on you within a week.
				</p>
			</section>

			<p class="text-fg-subtle mt-16 text-xs tracking-widest uppercase">Last updated: May 2026</p>
		</div>
	</div>
</div>

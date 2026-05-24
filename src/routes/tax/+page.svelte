<script lang="ts">
	import VibeTaxCalculator from '$lib/components/VibeTaxCalculator.svelte'
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import { site } from '$lib/content'
</script>

<svelte:head>
	<title>vibe-code tax | SIXTOM</title>
	<meta
		name="description"
		content="how much your vibe-coded prototype is costing you per year. 4 inputs, instant number, no email."
	/>
	<meta property="og:title" content="vibe-code tax | SIXTOM" />
	<meta
		property="og:description"
		content="how much your vibe-coded prototype is costing you per year."
	/>
	<meta property="og:url" content={`${site.siteUrl}/tax`} />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="bg-surface flex min-h-screen flex-col">
	<div class="mx-auto w-full max-w-3xl px-6 pt-12">
		<a
			href="/"
			class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
			data-umami-event="tax_back_home"
		>
			← sixtom
		</a>
	</div>
	<VibeTaxCalculator />
	<SiteFooter />
</div>

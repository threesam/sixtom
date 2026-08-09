<script lang="ts">
	import VibeTaxCalculator from '$lib/components/VibeTaxCalculator.svelte'
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import PageMeta from '$lib/components/PageMeta.svelte'
</script>

<PageMeta
	title="vibe-code tax | SIXTOM"
	description="how much your vibe-coded prototype is costing you per year. 3 inputs, instant number, no email."
	socialDescription="how much your vibe-coded prototype is costing you per year."
/>

<div class="bg-surface flex min-h-screen flex-col">
	<div class="mx-auto w-full max-w-3xl px-6 pt-12">
		<a
			href="/"
			class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
			data-umami-event="tax_back_home"
		>
			sixtom
		</a>
	</div>
	<VibeTaxCalculator />
	<SiteFooter />
</div>

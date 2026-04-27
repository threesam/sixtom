<script lang="ts">
	import '../app.css'
	import { personJsonLd, serviceJsonLd, faqPageJsonLd } from '$lib/seo/jsonld'

	let { children } = $props()

	const personLd = JSON.stringify(personJsonLd())
	const serviceLd = JSON.stringify(serviceJsonLd())
	const faqLd = JSON.stringify(faqPageJsonLd())
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${personLd}</script>`}
	{@html `<script type="application/ld+json">${serviceLd}</script>`}
	{@html `<script type="application/ld+json">${faqLd}</script>`}
</svelte:head>

<main class="bg-white font-sans text-neutral-900 min-h-screen">
	{@render children()}
</main>

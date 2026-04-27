<script lang="ts">
	import '../app.css'
	import { personJsonLd, serviceJsonLd, faqPageJsonLd } from '$lib/seo/jsonld'

	let { children } = $props()

	const SCRIPT_OPEN = '<script type="application/ld+json">'
	const SCRIPT_CLOSE = '</' + 'script>' // split avoids parser confusion in template literals
	const jsonLdHtml = [personJsonLd(), serviceJsonLd(), faqPageJsonLd()]
		.map((ld) => SCRIPT_OPEN + JSON.stringify(ld) + SCRIPT_CLOSE)
		.join('')
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: JSON.stringify of typed in-repo content -->
	{@html jsonLdHtml}
</svelte:head>

<main class="min-h-screen bg-white font-sans text-neutral-900">
	{@render children()}
</main>

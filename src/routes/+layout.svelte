<script lang="ts">
	import '../app.css'
	import { personJsonLd, serviceJsonLd } from '$lib/seo/jsonld'

	let { children } = $props()

	const SCRIPT_OPEN = '<script type="application/ld+json">'
	const SCRIPT_CLOSE = '</' + 'script>' // split avoids parser confusion in template literals
	const jsonLdHtml = [personJsonLd(), serviceJsonLd()]
		.map((ld) => SCRIPT_OPEN + JSON.stringify(ld) + SCRIPT_CLOSE)
		.join('')
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: JSON.stringify of typed in-repo content -->
	{@html jsonLdHtml}
</svelte:head>

<main class="bg-neutral-950 font-sans text-neutral-100 antialiased">
	{@render children()}
</main>

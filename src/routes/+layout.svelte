<script lang="ts">
	import type { Snippet } from 'svelte'
	import '../app.css'
	import { personJsonLd, serviceJsonLd } from '$lib/seo/jsonld'

	let { children }: { children: Snippet } = $props()

	const SCRIPT_OPEN = '<script type="application/ld+json">'
	const SCRIPT_CLOSE = '</' + 'script>' // split avoids parser confusion in template literals
	const jsonLdHtml = [personJsonLd(), serviceJsonLd()]
		// Escape `<` so a future content author can't break out of the JSON-LD script block.
		.map((ld) => SCRIPT_OPEN + JSON.stringify(ld).replace(/</g, '\\u003c') + SCRIPT_CLOSE)
		.join('')
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: JSON.stringify of typed in-repo content -->
	{@html jsonLdHtml}
</svelte:head>

<main class="bg-surface text-fg font-sans antialiased">
	{@render children()}
</main>

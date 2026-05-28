<script lang="ts">
	import type { Snippet } from 'svelte'
	import '../app.css'
	import { page } from '$app/state'
	import { site } from '$lib/content'
	import { personJsonLd, serviceJsonLd, webSiteJsonLd, renderJsonLd } from '$lib/seo/jsonld'

	let { children }: { children: Snippet } = $props()

	// Site-wide entity graph (WebSite + Person + ProfessionalService), present on
	// every route. Per-page nodes (home FAQ, /faq, /log, the writeup) are emitted
	// by those routes and merge in by shared @id.
	const jsonLdHtml = renderJsonLd(webSiteJsonLd(), personJsonLd(), serviceJsonLd())
</script>

<svelte:head>
	<link rel="canonical" href={`${site.siteUrl}${page.url.pathname}`} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: JSON.stringify of typed in-repo content -->
	{@html jsonLdHtml}
</svelte:head>

<main class="font-sans antialiased">
	{@render children()}
</main>

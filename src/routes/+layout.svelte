<script lang="ts">
	import type { Snippet } from 'svelte'
	import '../app.css'
	import { page } from '$app/state'
	import { site } from '#lib/content/index.js'
	// The file itself, served as it is: the home page ships no framework code
	// (csr = false), so the tracker is loaded by a script tag, not imported.
	import engagement from '#lib/engagement.js?url'
	import { personJsonLd, serviceJsonLd, webSiteJsonLd, renderJsonLd } from '#lib/seo/jsonld.js'

	let { children }: { children: Snippet } = $props()

	// Site-wide entity graph (WebSite + Person + Service), present on every route.
	// Per-page nodes (/faq, /log, the writeup) are emitted by those routes and
	// merge in by shared @id.
	const jsonLdHtml = renderJsonLd(webSiteJsonLd(), personJsonLd(), serviceJsonLd())
</script>

<svelte:head>
	<link rel="canonical" href={`${site.siteUrl}${page.url.pathname}`} />
	<meta property="og:url" content={`${site.siteUrl}${page.url.pathname}`} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: JSON.stringify of typed in-repo content -->
	{@html jsonLdHtml}
	<script type="module" src={engagement}></script>
</svelte:head>

<main class="font-sans antialiased">
	{@render children()}
</main>

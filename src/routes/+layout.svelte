<script lang="ts">
	import type { Snippet } from 'svelte'
	import '../app.css'
	import { page } from '$app/state'
	import { site } from '#lib/content/index.js'
	// The file itself, served as it is: the home page ships no framework code
	// (csr = false), so the tracker is loaded by a script tag, not imported.
	import engagement from '#lib/engagement.js?url'
	import {
		breadcrumbJsonLd,
		organizationJsonLd,
		personJsonLd,
		serviceJsonLd,
		webSiteJsonLd,
		renderJsonLd
	} from '#lib/seo/jsonld.js'

	let { children }: { children: Snippet } = $props()

	// Site-wide entity graph (WebSite + Organization + Person + Service), present
	// on every route. Per-page nodes (/faq, /log, the writeup) are emitted by those
	// routes and merge in by shared @id.
	const jsonLdHtml = renderJsonLd(
		webSiteJsonLd(),
		organizationJsonLd(),
		personJsonLd(),
		serviceJsonLd()
	)
	// An error page is not a page to point crawlers at: no canonical, no trail.
	const crumbs = $derived(page.error ? null : breadcrumbJsonLd(page.url.pathname))
	const crumbsHtml = $derived(crumbs ? renderJsonLd(crumbs) : '')
</script>

<svelte:head>
	{#if !page.error}
		<link rel="canonical" href={`${site.siteUrl}${page.url.pathname}`} />
		<meta property="og:url" content={`${site.siteUrl}${page.url.pathname}`} />
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: JSON.stringify of typed in-repo content -->
	{@html jsonLdHtml + crumbsHtml}
	<script type="module" src={engagement}></script>
</svelte:head>

<main class="font-sans antialiased">
	{@render children()}
</main>

<script lang="ts">
	// One title and one description per page, emitted once each into the tags
	// that need them. Hand-written heads had every route repeating both strings
	// across the plain/og/twitter variants, which is how og and twitter drift
	// apart. app.html keeps only the tags that are genuinely global (card type,
	// image, og:type) — anything page-specific there lands on every route.
	let {
		title,
		description,
		socialDescription = description,
		socialTitle = title
	}: {
		title: string
		description: string
		socialDescription?: string
		socialTitle?: string
	} = $props()
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={socialDescription} />
	<meta name="twitter:title" content={socialTitle} />
	<meta name="twitter:description" content={socialDescription} />
</svelte:head>

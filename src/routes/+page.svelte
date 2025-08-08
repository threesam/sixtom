<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'
	import Hero from '$lib/components/Hero.svelte'
	import Portfolio from '$lib/components/Portfolio.svelte'
	import Services from '$lib/components/Services.svelte'
	import Testimonials from '$lib/components/Testimonials.svelte'
	import Spacer from '$lib/components/Spacer.svelte'
	import type { Section } from '$lib/types'

	let { data }: { data: { page: { sections: Section[] } } } = $props()

	const canonicalUrl = 'https://sixtom.com/'
	const description =
		'Tailored solutions to transform your vision into reality. From custom development to digital marketing and branding, we drive your business forward.'
	const imageUrl =
		'https://cdn.sanity.io/images/qcht0vh1/production/bdfc49865d938bfcebf61726ddf78e29846ec0fe-870x870.png'
	const title = 'SIXTOM | Precision Tools for Accelerating Big Ideas'

	const orgSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: 'SIXTOM',
		url: canonicalUrl,
		logo: imageUrl,
		sameAs: [
			'https://twitter.com/six_to_m',
			'https://www.linkedin.com/in/sixtom/'
		]
	}

	const sections = (data?.page?.sections ?? []) as Section[]
	const portfolioSection = sections[0]
	const testimonialsSection = sections[1]
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>SIXTOM | Precision Tools for Accelerating Big Ideas</title>
	<meta name="description" content={description} />
	<meta charset="UTF-8" />

	<!-- Robots Meta Tag -->
	<meta name="robots" content="index, follow" />
	<meta name="googlebot" content="index, follow" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	<!-- Keywords -->
	<meta
		name="keywords"
		content="custom development, e-commerce, branding, digital marketing, scalable solutions, business growth"
	/>

	<!-- Canonical Link -->
	<link rel="canonical" href={canonicalUrl} />

	{@html `<script type="application/ld+json">${JSON.stringify(orgSchema)}</script>`}
</svelte:head>

<Header />
<div class="">
	<Hero />
	<Services />
	<Spacer isReversed={false} color1="bg-gray-100" color2="bg-gray-200" />
	{#if portfolioSection}
		<Portfolio section={portfolioSection} />
	{/if}
	<Spacer isReversed={false} color2="bg-gray-100" color1="bg-gray-200" />
	{#if testimonialsSection}
		<Testimonials section={testimonialsSection} />
	{/if}
	<Spacer isReversed={true} color2="bg-black" color1="bg-gray-100" />
</div>
<Footer />

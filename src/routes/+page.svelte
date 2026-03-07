<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'
	import Hero from '$lib/components/Hero.svelte'
	import ProblemSection from '$lib/components/ProblemSection.svelte'
	import Services from '$lib/components/Services.svelte'
	import Credibility from '$lib/components/Credibility.svelte'

	let { data } = $props()

	const sections = (data?.page as Record<string, any>)?.sections ?? []
	const testimonials = sections.find(
		(s: Record<string, any>) => s?.handle?.current === 'testimonials'
	)
	const rawTestimonial = testimonials?.items?.[0]
	const firstTestimonial = rawTestimonial
		? {
				...rawTestimonial,
				text: "He's built three sites for me and with each one, the unique needs and goals of the site dictated his approach, no cookie cutting corners."
			}
		: null

	const canonicalUrl = 'https://sixtom.com/'
	const description =
		'AI-enabled web development that ships in days, not months. Websites, e-commerce, automations, and digital infrastructure — built fast.'
	const imageUrl =
		'https://cdn.sanity.io/images/qcht0vh1/production/bdfc49865d938bfcebf61726ddf78e29846ec0fe-870x870.png'
	const title = 'SIXTOM | Your Website. Tomorrow.'
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta charset="UTF-8" />

	<meta name="robots" content="index, follow" />
	<meta name="googlebot" content="index, follow" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	<meta
		name="keywords"
		content="fast website development, AI web development, website in a day, rapid web development, e-commerce setup, workflow automation, digital infrastructure"
	/>

	<link rel="canonical" href={canonicalUrl} />

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "SIXTOM",
		"url": canonicalUrl,
		"logo": imageUrl,
		"sameAs": [
			"https://twitter.com/six_to_m",
			"https://www.linkedin.com/in/sixtom/"
		]
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "Need a website that actually converts?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "High-performance landing pages and marketing sites, built on modern frameworks like SvelteKit and Next.js, deployed in days. Mobile-first, SEO baked in, live in under a week."
				}
			},
			{
				"@type": "Question",
				"name": "Ready to sell online?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Your store, launched. Shopify or custom storefront with checkout flow optimization, payment and shipping integrations. Product launch in days, not quarters."
				}
			},
			{
				"@type": "Question",
				"name": "What if AI handled the boring stuff?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Workflow automation. AI integrations for chat, summarization, and triage. Internal tools that save hours per week with no vendor lock-in."
				}
			},
			{
				"@type": "Question",
				"name": "Want your digital systems just working?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "APIs, dashboards, CMS setup (Sanity). API design and integration, admin dashboards, and infrastructure that scales with your business."
				}
			}
		]
	})}</script>`}
</svelte:head>

<Header />
<Hero />
<ProblemSection />
<Services />
<Credibility testimonial={firstTestimonial} />
<Footer />

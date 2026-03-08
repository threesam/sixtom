<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'
	import Hero from '$lib/components/Hero.svelte'
	import ProblemSection from '$lib/components/ProblemSection.svelte'
	import Services from '$lib/components/Services.svelte'
	import Credibility from '$lib/components/Credibility.svelte'
	import { cro as copy } from '$lib/copy/cro'

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
	const imageUrl =
		'https://cdn.sanity.io/images/qcht0vh1/production/bdfc49865d938bfcebf61726ddf78e29846ec0fe-870x870.png'
</script>

<svelte:head>
	<title>{copy.meta.title}</title>
	<meta name="description" content={copy.meta.description} />
	<meta charset="UTF-8" />

	<meta name="robots" content="index, follow" />
	<meta name="googlebot" content="index, follow" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={copy.meta.title} />
	<meta property="og:description" content={copy.meta.description} />
	<meta property="og:image" content={imageUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={copy.meta.title} />
	<meta name="twitter:description" content={copy.meta.description} />
	<meta name="twitter:image" content={imageUrl} />

	<meta name="keywords" content={copy.meta.keywords} />

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
		"mainEntity": copy.services.map(s => ({
			"@type": "Question",
			"name": s.question,
			"acceptedAnswer": {
				"@type": "Answer",
				"text": `${s.answer} ${s.bullets.join('. ')}`
			}
		}))
	})}</script>`}
</svelte:head>

<Header />
<Hero copy={copy.hero} />
<ProblemSection copy={copy.problem} />
<Services services={copy.services} />
<Credibility copy={copy.credibility} testimonial={firstTestimonial} />
<Footer copy={copy.contact} />

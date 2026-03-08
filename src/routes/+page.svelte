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
		'Stop losing customers to a website that isn\'t earning its keep. Get a high-converting website live in 7 days — built around what your buyers need to say yes.'
	const imageUrl =
		'https://cdn.sanity.io/images/qcht0vh1/production/bdfc49865d938bfcebf61726ddf78e29846ec0fe-870x870.png'
	const title = 'SIXTOM | Your Website Should Be Making You Money.'
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
				"name": "What if your website actually brought in customers?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Most sites look professional and do nothing. Every page, headline, and call-to-action is built around turning a visitor into a lead. Loads in under 2 seconds, ranks on Google from day one, and is live generating leads within a week."
				}
			},
			{
				"@type": "Question",
				"name": "Ready to turn your store into a sales machine?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "The difference between a store that converts and one that doesn't is friction. Every barrier between your customer and checkout is removed. Checkout flows people complete, payment and shipping that works, product pages that answer every objection. Open for business in days, not quarters."
				}
			},
			{
				"@type": "Question",
				"name": "What would your team do with 10 extra hours a week?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "The tasks eating your team's time — copy-paste, manual follow-ups, repetitive approvals — can run themselves. Automations save 10+ hours per week from week one, customer follow-ups happen automatically, and you own it outright with no monthly platform fees."
				}
			},
			{
				"@type": "Question",
				"name": "Is broken infrastructure quietly costing you growth?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Slow dashboards, broken integrations, data scattered across five tools — technical debt compounds until it stops your growth. The foundation is built to handle 10x your current volume, with all your data in one place and business dashboards that show what actually matters."
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

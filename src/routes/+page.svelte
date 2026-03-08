<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'
	import Hero from '$lib/components/Hero.svelte'
	import ProblemSection from '$lib/components/ProblemSection.svelte'
	import Services from '$lib/components/Services.svelte'
	import Credibility from '$lib/components/Credibility.svelte'
	import { site, social, services } from '$lib/copy'

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

	// Build FAQ answer text that matches the visible page content (answer + bullets)
	function faqAnswerText(service: (typeof services)[number]): string {
		return `${service.answer} ${service.bullets.join('. ')}.`
	}

	const schemaWebSite = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${site.url}#website`,
		name: site.name,
		url: site.url,
		description: site.description,
	}

	const schemaOrganization = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${site.url}#organization`,
		name: site.name,
		url: site.url,
		logo: {
			'@type': 'ImageObject',
			url: site.imageUrl,
		},
		description: site.description,
		foundingDate: String(site.foundingYear),
		sameAs: [social.x.href, social.linkedin.href],
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'customer service',
			url: `${site.url}#contact`,
			availableLanguage: 'English',
		},
		knowsAbout: [
			'Web Development',
			'E-commerce',
			'AI Automation',
			'SvelteKit',
			'Next.js',
			'Shopify',
		],
	}

	const schemaWebPage = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${site.url}#webpage`,
		url: site.url,
		name: site.title,
		description: site.description,
		isPartOf: { '@id': `${site.url}#website` },
		about: { '@id': `${site.url}#organization` },
		primaryImageOfPage: {
			'@type': 'ImageObject',
			url: site.imageUrl,
		},
	}

	const schemaFAQPage = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: services.map((service) => ({
			'@type': 'Question',
			name: service.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faqAnswerText(service),
			},
		})),
	}
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />
	<meta charset="UTF-8" />

	<meta name="robots" content="index, follow" />
	<meta name="googlebot" content="index, follow" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={site.url} />
	<meta property="og:title" content={site.title} />
	<meta property="og:description" content={site.description} />
	<meta property="og:image" content={site.imageUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={site.url} />
	<meta name="twitter:title" content={site.title} />
	<meta name="twitter:description" content={site.description} />
	<meta name="twitter:image" content={site.imageUrl} />

	<meta name="keywords" content={site.keywords} />

	<link rel="canonical" href={site.url} />

	{@html `<script type="application/ld+json">${JSON.stringify(schemaWebSite)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(schemaOrganization)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(schemaWebPage)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(schemaFAQPage)}<\/script>`}
</svelte:head>

<Header />
<Hero />
<ProblemSection />
<Services />
<Credibility testimonial={firstTestimonial} />
<Footer />

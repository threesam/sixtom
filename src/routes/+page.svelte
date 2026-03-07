<script>
	import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'
	import Hero from '$lib/components/Hero.svelte'
	import Portfolio from '$lib/components/Portfolio.svelte'
	import Services from '$lib/components/Services.svelte'
	import Testimonials from '$lib/components/Testimonials.svelte'
	import Spacer from '$lib/components/Spacer.svelte'

	let { data } = $props()

	const canonicalUrl = 'https://sixtom.com/'
	const description =
		'AI enablement for ecommerce and content-led teams. Build practical digital systems that improve conversion, speed execution, and create measurable wins in 14-30 days.'
	const imageUrl =
		'https://cdn.sanity.io/images/qcht0vh1/production/bdfc49865d938bfcebf61726ddf78e29846ec0fe-870x870.png'
	const title = 'SIXTOM | AI Enablement for Digital Systems'
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
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
		content="AI enablement consultant, ecommerce AI systems, conversion rate optimization, AI workflow automation, linkedin personal brand, digital systems strategy"
	/>

	<!-- Canonical Link -->
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>

<Header />
<div class="">
	<Hero />
	<Services />
	<Spacer isReversed={false} color1="bg-gray-100" color2="bg-gray-200" />
	<Portfolio section={data?.page?.sections[0]} />
	<Spacer isReversed={false} color2="bg-gray-100" color1="bg-gray-200" />
	<Testimonials section={data?.page?.sections[1]} />
	<Spacer isReversed={true} color2="bg-black" color1="bg-gray-100" />
</div>
<Footer />

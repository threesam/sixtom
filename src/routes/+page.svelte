<script>
	import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'
	import Hero from '$lib/components/Hero.svelte'
	import Portfolio from '$lib/components/Portfolio.svelte'
	import Services from '$lib/components/Services.svelte'
	import Testimonials from '$lib/components/Testimonials.svelte'
	import Spacer from '$lib/components/Spacer.svelte'

	let { data } = $props()
</script>

<Header />
<div class="pt-8">
	<Hero />
	<Services />
	<Spacer isReversed={false} color1="bg-gray-100" color2="bg-gray-200" />
	<Portfolio section={data.page.sections[0]} />
	<Spacer isReversed={false} color2="bg-gray-100" color1="bg-gray-200" />
	<Testimonials />
	<Spacer isReversed={true} color2="bg-black" color1="bg-gray-100" />
</div>
<Footer />

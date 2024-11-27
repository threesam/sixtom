<script>
	import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'
	import Hero from '$lib/components/Hero.svelte'
	import Portfolio from '$lib/components/Portfolio.svelte'
	import Services from '$lib/components/Services.svelte'
	import Testimonials from '$lib/components/Testimonials.svelte'

	let { data } = $props()
	console.log(
		'data: ',
		data.projects.map(({ image }) => image)
	)
</script>

<Header />
<div class="pt-8">
	<Hero />
	<Services />
	<Portfolio items={data.projects} />
	<Testimonials />
</div>
<Footer />

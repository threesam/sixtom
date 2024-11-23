<script>
	import Contact from '$lib/components/Contact.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'
	import Hero from '$lib/components/Hero.svelte'
	import Portfolio from '$lib/components/Portfolio.svelte'
	import Services from '$lib/components/Services.svelte'
	import Testimonials from '$lib/components/Testimonials.svelte'
	import { onMount } from 'svelte'

	onMount(() => {
		// Any initialization code can go here
	})
</script>

<main class="bg-white font-sans text-gray-900">
	<Header />
	<Hero />
	<Services />
	<Portfolio />
	<Testimonials />
	<Contact />
	<Footer />
</main>

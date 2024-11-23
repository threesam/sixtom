<script lang="ts">
	import '../app.css'
	import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'

	let { children } = $props()
</script>

<Header />
<main class="bg-gray-100 pt-8 font-sans text-gray-900">
	{@render children()}
</main>
<Footer />

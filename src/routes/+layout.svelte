<script lang="ts">
	import '../app.css'

	let { children } = $props()
</script>

<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-brand-yellow focus:px-3 focus:py-2 focus:text-black">Skip to main content</a>

<main id="main-content" tabindex="-1" class="bg-gray-100 font-sans text-black">
	{@render children()}
</main>

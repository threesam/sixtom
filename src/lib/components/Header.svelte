<script>
	import { fade } from 'svelte/transition'

	let isMenuOpen = false

	function toggleMenu() {
		isMenuOpen = !isMenuOpen
	}
</script>

<header class="border-y-2 border-black bg-white">
	<div class="container mx-auto flex items-center justify-between px-4">
		<a href="/" class="text-4xl font-bold text-gray-900">
			<p class="py-2">six<span class="mx-0.5 bg-black px-1 py-2 text-white">to</span>m</p>
		</a>
		<nav class="hidden space-x-6 md:flex">
			<a href="#services" class="text-gray-600 hover:text-gray-900">Services</a>
			<a href="#portfolio" class="text-gray-600 hover:text-gray-900">Portfolio</a>
			<a href="#testimonials" class="text-gray-600 hover:text-gray-900">Testimonials</a>
			<a href="#contact" class="text-gray-600 hover:text-gray-900">Contact</a>
		</nav>
		<button class="md:hidden" on:click={toggleMenu} aria-label="Toggle menu">
			<svg
				class="h-6 w-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16m-7 6h7"
				></path>
			</svg>
		</button>
	</div>
	{#if isMenuOpen}
		<nav transition:fade class="border-t border-gray-200 bg-white px-4 py-2 md:hidden">
			<a href="#services" class="block py-2 text-gray-600 hover:text-gray-900">Services</a>
			<a href="#portfolio" class="block py-2 text-gray-600 hover:text-gray-900">Portfolio</a>
			<a href="#testimonials" class="block py-2 text-gray-600 hover:text-gray-900">Testimonials</a>
			<a href="#contact" class="block py-2 text-gray-600 hover:text-gray-900">Contact</a>
		</nav>
	{/if}
</header>

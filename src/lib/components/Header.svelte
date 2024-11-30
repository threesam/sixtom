<script lang="ts">
	import { fade, slide } from 'svelte/transition'
	let scrollY = 0
	let height = 0
	let isMenuOpen = false
	let headerHeight = 56 //px

	const navigationLinks = [
		{ href: '#services', text: 'Services' },
		{ href: '#portfolio', text: 'Portfolio' },
		{ href: '#testimonials', text: 'Testimonials' },
		{ href: '#contact', text: 'Contact' }
	]

	function toggleMenu() {
		isMenuOpen = !isMenuOpen
	}

	// Use onMount to ensure the DOM is available
	import { onMount } from 'svelte'

	function scrollMaxValue() {
		const body = document.body
		const html = document.documentElement

		const documentHeight = Math.max(
			body.scrollHeight,
			body.offsetHeight,
			html.clientHeight,
			html.scrollHeight,
			html.offsetHeight
		)

		return documentHeight - window.innerHeight
	}

	onMount(() => {
		height = scrollMaxValue() - headerHeight
	})
</script>

<svelte:window bind:scrollY on:resize={() => (height = scrollMaxValue() - headerHeight)} />

<header
	class="fixed z-10 w-full bg-black text-white shadow-lg shadow-black/30 transition-all duration-300"
	data-is-dark={false}
>
	<div class="container relative z-40 mx-auto flex items-center justify-between px-4">
		<a href="/">
			<p class="py-2 text-4xl font-bold">
				six<span
					class="mx-0.5 bg-white px-1 py-[6px] text-black transition-all duration-300"
					data-is-dark={false}>to</span
				>m
			</p>
		</a>
		<nav class="hidden space-x-12 md:flex">
			{#each navigationLinks as { href, text }}
				<div class="group relative inline-block">
					<a {href} class="">{text}</a>
					<span
						class="absolute bottom-[-5px] left-0 h-[2px] w-full bg-yellow-400 opacity-0 transition-all duration-300 group-hover:bottom-0 group-hover:opacity-100"
					></span>
				</div>
			{/each}
		</nav>
		{#if isMenuOpen}
			<button in:fade class="md:hidden" on:click={toggleMenu} aria-label="Toggle menu">
				<svg
					viewBox="0 0 15 15"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 rotate-45"
				>
					<path d="M7.5 1v13M1 7.5h13" stroke="currentColor"></path>
				</svg>
			</button>
		{:else}
			<button in:fade class="md:hidden" on:click={toggleMenu} aria-label="Toggle menu">
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
		{/if}
	</div>
	{#if isMenuOpen}
		<nav in:slide class="relative z-50 border-t-2 border-black bg-black px-4 py-2 md:hidden">
			{#each navigationLinks as { href, text }}
				<a {href} class="block py-2 text-white hover:text-gray-100" on:click={toggleMenu}>{text}</a>
			{/each}
		</nav>
		{#if isMenuOpen}
			<button in:fade class="fixed inset-0 z-10 bg-black opacity-65" on:click={toggleMenu}>
				<span class="sr-only">close menu</span>
			</button>
		{/if}
	{/if}
</header>

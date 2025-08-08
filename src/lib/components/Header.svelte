<script lang="ts">
	import { fade, slide } from 'svelte/transition'
	let scrollY = $state(0)
	let height = 0
	let isMenuOpen = $state(false)
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
		if (typeof window === 'undefined' || typeof document === 'undefined') return 0

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

	let isVisibleButton = $derived(
		scrollY >= scrollMaxValue() - headerHeight ||
			scrollY <= (typeof window !== 'undefined' ? window.innerHeight - 185 : 0)
	)

	onMount(() => {
		height = scrollMaxValue() - headerHeight
	})
</script>

<svelte:window bind:scrollY on:resize={() => (height = scrollMaxValue() - headerHeight)} />

<header
	class="fixed z-50 w-full border-b-2 border-black bg-black text-white shadow-black/30 transition-all duration-300 data-[is-menu-open=false]:border-transparent data-[is-menu-open=false]:shadow-lg"
	data-is-menu-open={isMenuOpen}
>
	<div class="container relative z-40 mx-auto flex items-center justify-between px-4">
		<a href="/">
			<p class="py-2 text-4xl font-bold">
				six<span class="mx-0.5 bg-gray-100 px-1 py-[6px] text-black transition-all duration-300">
					to
				</span>m
			</p>
		</a>
		<nav aria-label="Primary" class="hidden space-x-12 xl:flex">
			{#each navigationLinks as { href, text }}
				<div class="group relative inline-block">
					<a {href} class="">{text}</a>
					<span
						class="absolute bottom-[-5px] left-0 h-[2px] w-full bg-brand-yellow opacity-0 transition-all duration-300 group-hover:bottom-0 group-hover:opacity-100"
					></span>
				</div>
			{/each}
		</nav>
		{#if isVisibleButton}
			{#if isMenuOpen}
				<button in:fade class="xl:hidden" onclick={toggleMenu} aria-label="Toggle menu" aria-controls="primary-navigation" aria-expanded={isMenuOpen}>
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
				<button in:fade class="xl:hidden" onclick={toggleMenu} aria-label="Toggle menu" aria-controls="primary-navigation" aria-expanded={isMenuOpen}>
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
		{:else}
			<a
				in:fade
				class="rounded-md bg-brand-yellow px-3 py-1 text-sm font-bold text-black xl:hidden"
				href="#contact"
			>
				Book now
			</a>
		{/if}
	</div>
	{#if isMenuOpen}
		<nav id="primary-navigation" aria-label="Primary" in:slide class="relative z-50 bg-gray-100 px-4 py-2 xl:hidden">
			{#each navigationLinks as { href, text }}
				<a {href} class="block py-2 font-bold text-black hover:text-gray-800" onclick={toggleMenu}>
					{text}
				</a>
			{/each}
		</nav>
		<button in:fade class="fixed inset-0 z-10 bg-black opacity-85" onclick={toggleMenu} aria-label="Close menu">
			<span class="sr-only">close menu</span>
		</button>
	{/if}
</header>

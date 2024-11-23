<script>
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	let name = ''
	let email = ''
	let message = ''
	let status = ''

	const submitForm = async () => {
		const response = await fetch('/api/send-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, email, message })
		})

		const result = await response.json()
		status = result.status
	}

	let isMenuOpen = false
	let portfolioItems = [
		{
			title: 'Project 1',
			description: 'Web Design',
			image: '/placeholder.svg?height=300&width=400'
		},
		{
			title: 'Project 2',
			description: 'Mobile App',
			image: '/placeholder.svg?height=300&width=400'
		},
		{ title: 'Project 3', description: 'Branding', image: '/placeholder.svg?height=300&width=400' }
	]
	let testimonials = [
		{ name: 'John Doe', role: 'CEO, Tech Co', quote: 'Exceptional service and results!' },
		{
			name: 'Jane Smith',
			role: 'Marketing Director, Brand Inc',
			quote: 'Transformed our online presence.'
		}
	]

	onMount(() => {
		// Any initialization code can go here
	})

	function toggleMenu() {
		isMenuOpen = !isMenuOpen
	}
</script>

<main class="bg-white font-mono text-gray-900">
	<!-- Header -->
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
				<a href="#testimonials" class="block py-2 text-gray-600 hover:text-gray-900">Testimonials</a
				>
				<a href="#contact" class="block py-2 text-gray-600 hover:text-gray-900">Contact</a>
			</nav>
		{/if}
	</header>

	<!-- Hero Section -->
	<section class="bg-gray-100 py-20">
		<div class="container mx-auto px-4 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
				Innovative Digital Solutions
			</h1>
			<p class="mb-8 text-xl text-gray-600">
				We create stunning digital experiences that drive growth
			</p>
			<a
				href="#contact"
				class="bg-gray-900 px-8 py-3 font-bold text-white transition duration-300 hover:bg-gray-800"
			>
				Get Started
			</a>
		</div>
	</section>

	<!-- Services Section -->
	<section id="services" class="bg-white py-20">
		<div class="container mx-auto px-4">
			<h2 class="mb-12 text-center text-3xl font-bold text-gray-900">Our Services</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="border border-gray-200 p-6">
					<h3 class="mb-4 text-xl font-semibold text-gray-900">Web Design</h3>
					<p class="text-gray-600">
						Create stunning, responsive websites that engage your audience and drive conversions.
					</p>
				</div>
				<div class="border border-gray-200 p-6">
					<h3 class="mb-4 text-xl font-semibold text-gray-900">Digital Marketing</h3>
					<p class="text-gray-600">
						Boost your online presence with targeted campaigns and data-driven strategies.
					</p>
				</div>
				<div class="border border-gray-200 p-6">
					<h3 class="mb-4 text-xl font-semibold text-gray-900">Brand Identity</h3>
					<p class="text-gray-600">
						Develop a unique and memorable brand that resonates with your target audience.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Portfolio Section -->
	<section id="portfolio" class="bg-gray-100 py-20">
		<div class="container mx-auto px-4">
			<h2 class="mb-12 text-center text-3xl font-bold text-gray-900">Our Portfolio</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each portfolioItems as item}
					<div class="border border-gray-200 bg-white">
						<img src={item.image} alt={item.title} class="h-48 w-full object-cover" />
						<div class="p-4">
							<h3 class="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
							<p class="text-gray-600">{item.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Testimonials Section -->
	<section id="testimonials" class="bg-white py-20">
		<div class="container mx-auto px-4">
			<h2 class="mb-12 text-center text-3xl font-bold text-gray-900">What Our Clients Say</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				{#each testimonials as testimonial}
					<div class="border border-gray-200 p-6">
						<p class="mb-4 text-gray-600">"{testimonial.quote}"</p>
						<div class="font-semibold text-gray-900">{testimonial.name}</div>
						<div class="text-sm text-gray-500">{testimonial.role}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Contact Section -->
	<section id="contact" class="bg-gray-100 py-20">
		<div class="container mx-auto px-4">
			<h2 class="mb-12 text-center text-3xl font-bold text-gray-900">Get In Touch</h2>
			<form class="mx-auto max-w-lg" on:submit|preventDefault={submitForm}>
				<div class="mb-4">
					<label for="name" class="mb-2 block font-bold text-gray-700">Name</label>
					<input
						bind:value={name}
						type="text"
						id="name"
						name="name"
						class="w-full border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
						required
					/>
				</div>
				<div class="mb-4">
					<label for="email" class="mb-2 block font-bold text-gray-700">Email</label>
					<input
						bind:value={email}
						type="email"
						id="email"
						name="email"
						class="w-full border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
						required
					/>
				</div>
				<div class="mb-4">
					<label for="message" class="mb-2 block font-bold text-gray-700">Message</label>
					<textarea
						bind:value={message}
						id="message"
						name="message"
						rows="4"
						class="w-full border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
						required
					></textarea>
				</div>
				<div class="flex items-center gap-2">
					<button
						type="submit"
						class="bg-gray-900 px-6 py-3 font-bold text-white transition duration-300 hover:bg-gray-800"
					>
						Send Message
					</button>
					{#if status}
						<span>{status}</span>
					{/if}
				</div>
			</form>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-gray-900 py-8 text-white">
		<div class="container mx-auto px-4">
			<div class="flex flex-wrap justify-between">
				<div class="mb-6 w-full md:mb-0 md:w-1/3">
					<h3 class="mb-4 text-2xl font-bold">sixtom</h3>
					<p class="text-gray-400">Creating digital experiences that matter.</p>
				</div>
				<div class="mb-6 w-full md:mb-0 md:w-1/3">
					<h4 class="mb-4 text-lg font-semibold">Quick Links</h4>
					<ul class="space-y-2">
						<li><a href="#services" class="text-gray-400 hover:text-white">Services</a></li>
						<li><a href="#portfolio" class="text-gray-400 hover:text-white">Portfolio</a></li>
						<li><a href="#testimonials" class="text-gray-400 hover:text-white">Testimonials</a></li>
						<li><a href="#contact" class="text-gray-400 hover:text-white">Contact</a></li>
					</ul>
				</div>
				<div class="w-full md:w-1/3">
					<h4 class="mb-4 text-lg font-semibold">Connect With Us</h4>
					<div class="flex space-x-4">
						<a href="#" class="text-gray-400 hover:text-white">
							<span class="sr-only">Facebook</span>
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
						<a href="#" class="text-gray-400 hover:text-white">
							<span class="sr-only">Twitter</span>
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
								/>
							</svg>
						</a>
						<a href="#" class="text-gray-400 hover:text-white">
							<span class="sr-only">LinkedIn</span>
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>
			<div class="mt-8 text-center text-sm text-gray-400">
				© {new Date().getFullYear()} sixtom. All rights reserved.
			</div>
		</div>
	</footer>
</main>

<style>
	/* You can add any additional global styles here */
	:global(html) {
		scroll-behavior: smooth;
	}
</style>

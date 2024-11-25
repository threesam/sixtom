<script>
	import Canvas from './ParticleCanvas.svelte'
	// import Canvas from './MetaballsCanvas.svelte'
	import Contact from './Contact.svelte'
	import SocialLinks from './SocialLinks.svelte'

	import { createToggleStore } from '../stores/index.svelte'

	const navigationLinks = [
		{ href: '#services', text: 'Services' },
		{ href: '#portfolio', text: 'Portfolio' },
		{ href: '#testimonials', text: 'Testimonials' },
		{ href: '#contact', text: 'Contact' }
	]

	const toggleStore = createToggleStore()
</script>

<footer class="relative flex h-screen flex-col justify-between bg-black text-gray-100">
	<div class="container relative z-10 mx-auto flex h-full flex-col place-content-center px-4">
		<Contact store={toggleStore} />
		<div class="mx-auto flex w-full max-w-lg flex-col items-center pt-4">
			<h4 class="mb-4 w-full text-center text-2xl font-semibold">Connect With Us</h4>
			<SocialLinks />
		</div>
	</div>
	<div class="relative z-10 py-8 text-center text-sm text-gray-400">
		© {new Date().getFullYear()} sixtom. All rights reserved.
	</div>
	<div class="absolute inset-0">
		<Canvas store={toggleStore} />
	</div>
</footer>

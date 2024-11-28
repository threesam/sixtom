<script>
	import Contact from './Contact.svelte'
	import SocialLinks from './SocialLinks.svelte'

	const navigationLinks = [
		{ href: '#services', text: 'Services' },
		{ href: '#portfolio', text: 'Portfolio' },
		{ href: '#testimonials', text: 'Testimonials' },
		{ href: '#contact', text: 'Contact' }
	]
</script>

<footer class="relative flex h-screen flex-col justify-between bg-black pb-8 text-gray-100">
	<div class="container mx-auto flex h-full flex-col place-content-center px-4">
		<Contact />
		<div class="mx-auto flex w-full max-w-lg flex-col items-center pt-4">
			<h4 class="mb-4 w-full text-center text-2xl font-semibold">Connect With Us</h4>
			<SocialLinks />
		</div>
	</div>

	<!-- Slanted Top Background -->
	<div
		class="h-15 absolute -top-[1px] left-0 w-full bg-gray-100"
		style="clip-path: polygon(0 0, 100% 0, 100% 0, 0 100%);"
	></div>

	<div class="mt-8 bg-black text-center text-sm text-gray-400">
		© {new Date().getFullYear()} sixtom. All rights reserved.
	</div>
</footer>

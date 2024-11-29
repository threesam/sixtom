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

<footer class="relative flex flex-col justify-between bg-black text-gray-100">
	<div
		class="container mx-auto flex h-screen flex-col place-content-end px-4 max-md:pb-16 md:place-content-center"
	>
		<Contact />
		<div class="mx-auto flex w-full max-w-lg flex-col items-center pt-4">
			<h4 class="mb-4 w-full text-center text-2xl font-semibold">Connect With Us</h4>
			<SocialLinks />
		</div>
	</div>

	<div class="bg-black pb-4 text-center text-sm text-gray-400 md:mt-8">
		© {new Date().getFullYear()} sixtom. All rights reserved.
	</div>
</footer>

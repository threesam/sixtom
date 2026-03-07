<script>
	import Contact from './Contact.svelte'
	import SocialLinks from './SocialLinks.svelte'
</script>

<footer class="snap-section relative bg-black text-gray-100">
	<div class="container mx-auto flex flex-col place-content-center px-4" style="min-height: inherit;">
		<Contact />
		<div class="mx-auto flex w-full max-w-lg flex-col items-center pb-4 pt-12">
			<SocialLinks />
		</div>
	</div>

	<div class="absolute bottom-0 w-full bg-black pb-4 text-center text-sm text-gray-400">
		&copy; 2020-{new Date().getFullYear()} SIXTOM. All rights reserved.
	</div>
</footer>

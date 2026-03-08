<script>
	import Contact from './Contact.svelte'
	import SocialLinks from './SocialLinks.svelte'
	import { footer } from '$lib/copy'
</script>

<footer class="relative bg-black text-gray-100">
	<Contact />
	<div class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-8">
		<SocialLinks />
	</div>
	<div class="pb-6 text-center text-sm text-gray-400">
		&copy; {footer.foundingYear}-{new Date().getFullYear()} SIXTOM. All rights reserved.
	</div>
</footer>

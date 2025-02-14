<script>
	import Contact from './Contact.svelte'
	import SocialLinks from './SocialLinks.svelte'
</script>

<footer class="relative flex flex-col justify-between bg-black text-gray-100">
	<div class="container mx-auto flex h-screen flex-col place-content-center px-4">
		<Contact />
		<div class="mx-auto flex w-full max-w-lg flex-col items-center pb-4 pt-12">
			<SocialLinks />
		</div>
	</div>

	<div class="absolute bottom-0 w-full bg-black pb-4 text-center text-sm text-gray-400 xl:mt-8">
		© 2020-{new Date().getFullYear()} SIXTOM. All rights reserved.
	</div>
</footer>

<style>
	footer {
		height: calc(100vh - 56px);
	}
</style>

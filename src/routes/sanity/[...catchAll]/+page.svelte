<script lang="ts">
	export const ssr = false
	export const prerender = false
	import { sanityConfig } from '$lib/client/sanity'
	import SanityStudio from '$lib/components/SanityStudio.svelte'
</script>

<SanityStudio config={sanityConfig} />

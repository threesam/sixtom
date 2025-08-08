<script lang="ts">
	import { onMount } from 'svelte'

	let StudioComponent: any = null
	let config: any = null
	let loadError: unknown = null

	onMount(async () => {
		try {
			const [{ default: SanityStudio }, { sanityConfig }] = await Promise.all([
				import('$lib/components/SanityStudio.svelte'),
				import('$lib/client/sanity')
			])
			StudioComponent = SanityStudio
			config = sanityConfig
		} catch (e) {
			loadError = e
		}
	})
</script>

{#if StudioComponent && config}
	<svelte:component this={StudioComponent} {config} />
{:else}
	<div class="grid min-h-screen place-content-center p-4 text-center text-gray-200">
		<p aria-live="polite">{loadError ? 'Failed to load Studio' : 'Loading Studio...'}</p>
	</div>
{/if}

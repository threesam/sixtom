<script lang="ts">
	import { renderStudio, type Config } from 'sanity'
	import { onMount } from 'svelte'

	let { config }: { config: Config } = $props()
	let studioContainer: HTMLDivElement | undefined = $state()

	onMount(() => {
		if (studioContainer) {
			renderStudio(studioContainer, config)
		}
	})
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
	<meta name="robots" content="noindex" />
	<meta name="referrer" content="same-origin" />
</svelte:head>

<div id="svelte-studio">
	<div bind:this={studioContainer}></div>
</div>

<style>
	#svelte-studio {
		height: 100vh;
	}

	#svelte-studio > div {
		height: 100%;
	}
</style>

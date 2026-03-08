<script lang="ts">
	import type { ServiceItem } from '$lib/copy/types'
	import ServiceBlock from './ServiceBlock.svelte'

	let { services }: { services: ServiceItem[] } = $props()
</script>

{#each services as service}
	<ServiceBlock {...service} />
{/each}

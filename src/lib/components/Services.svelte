<script>
	import ServiceBlock from './ServiceBlock.svelte'
	import { services } from '$lib/copy'
</script>

{#each services as service}
	<ServiceBlock {...service} />
{/each}

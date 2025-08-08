<script lang="ts">
	import PortableText from '$lib/components/PortableText.svelte'
	let { value }: { value: any } = $props()
</script>

<div class="prose prose-invert max-w-none">
	<PortableText body={value} />
</div>
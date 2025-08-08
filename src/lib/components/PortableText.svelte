<script lang="ts">
	import { PortableText } from '@portabletext/svelte'
	import type { PortableTextBlock } from 'sanity'

	let { body }: { body: PortableTextBlock[] } = $props()
</script>

<PortableText value={body} />

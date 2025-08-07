<script lang="ts">
	import { PortableText } from '@portabletext/svelte'
	import type { PortableTextBlock } from '@portabletext/types'

	let { body } = $props()
</script>

<PortableText value={body as PortableTextBlock[]} />

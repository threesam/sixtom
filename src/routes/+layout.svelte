<script lang="ts">
	import '../app.css'
	import type { Snippet } from 'svelte'

	let { children }: { children: Snippet } = $props()
</script>

<main class="bg-gray-100 font-sans text-black">
	{@render children()}
</main>

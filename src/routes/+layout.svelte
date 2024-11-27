<script lang="ts">
	import '../app.css'

	let { children } = $props()
</script>

<main class="bg-gray-100 font-sans text-black">
	{@render children()}
</main>

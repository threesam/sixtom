<script lang="ts">
	export let height: string = '100px' // Default height
	export let color1: string = 'bg-gray-200' // Default top-left color
	export let color2: string = 'bg-gray-100' // Default bottom-right color
	export let isReversed: boolean = 'false'
</script>

<div
	class="relative w-full data-[is-reversed=true]:-scale-x-100"
	data-is-reversed={isReversed}
	style="height: {height};"
>
	<!-- Layer 1: Top-left color -->
	<div class={`absolute inset-0 ${color1}`} style="clip-path: polygon(0 0, 100% 0, 0 100%);"></div>

	<!-- Layer 2: Bottom-right color -->
	<div
		class={`absolute inset-0 ${color2}`}
		style="clip-path: polygon(100% 0, 100% 100%, 0 100%);"
	></div>
</div>

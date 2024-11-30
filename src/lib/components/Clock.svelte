<script>
	import { onMount } from 'svelte'
	import { spring } from 'svelte/motion'

	let {
		hasBlur = true,
		size = 300,
		color = '#facc15',
		backgroundImage = 'https://cdn.sanity.io/images/qcht0vh1/production/bdfc49865d938bfcebf61726ddf78e29846ec0fe-870x870.png'
	} = $props()

	let hours = 0
	let minutes = 0
	let seconds = 0

	const hourSpring = spring(0, { stiffness: 0.1, damping: 0.4 })
	const minuteSpring = spring(0, { stiffness: 0.1, damping: 0.4 })
	const secondSpring = spring(0, { stiffness: 0.3, damping: 0.3 })

	function updateClockHands() {
		const now = new Date()
		hours = now.getHours()
		minutes = now.getMinutes()
		seconds = now.getSeconds()

		hourSpring.set((hours % 12) * 30 + minutes * 0.5)
		minuteSpring.set(minutes * 6 + seconds * 0.1)
		secondSpring.set(seconds * 6)
	}

	onMount(() => {
		updateClockHands()
		const interval = setInterval(updateClockHands, 1000)
		return () => clearInterval(interval)
	})
</script>

<div class="relative inline-block" style="width: {size}px; height: {size}px;">
	<div
		class="group absolute inset-0 overflow-hidden rounded-full"
		style="clip-path: circle({size / 2}px at center);"
	>
		<svg width={size} height={size} viewBox="0 0 {size} {size}">
			<defs>
				<clipPath id="clock-face">
					<circle cx={size / 2} cy={size / 2} r={size / 2 - 2} />
				</clipPath>
			</defs>

			<!-- Background Image or Solid Color -->
			{#if backgroundImage}
				<image
					href={backgroundImage}
					x="0"
					y="0"
					class="grayscale"
					style="filter: grayscale(100%); -webkit-filter: grayscale(100%);"
					width={size}
					height={size}
					clip-path="url(#clock-face)"
					preserveAspectRatio="xMidYMid slice"
				/>
			{:else}
				<circle cx={size / 2} cy={size / 2} r={size / 2 - 2} class="fill-black" />
			{/if}

			<!-- Hour markers -->
			{#each Array(12) as _, i}
				<line
					x1={size / 2 + (size / 2 - 20) * Math.cos(((i * 30 - 90) * Math.PI) / 180)}
					y1={size / 2 + (size / 2 - 20) * Math.sin(((i * 30 - 90) * Math.PI) / 180)}
					x2={size / 2 + (size / 2 - 5) * Math.cos(((i * 30 - 90) * Math.PI) / 180)}
					y2={size / 2 + (size / 2 - 5) * Math.sin(((i * 30 - 90) * Math.PI) / 180)}
					stroke={color}
				/>
			{/each}

			<!-- Hour hand -->
			<line
				x1={size / 2}
				y1={size / 2}
				x2={size / 2 + (size / 3 - 20) * Math.cos((($hourSpring - 90) * Math.PI) / 180)}
				y2={size / 2 + (size / 3 - 20) * Math.sin((($hourSpring - 90) * Math.PI) / 180)}
				stroke={color}
				stroke-linecap="round"
			/>

			<!-- Minute hand -->
			<line
				x1={size / 2}
				y1={size / 2}
				x2={size / 2 + (size / 2 - 20) * Math.cos((($minuteSpring - 90) * Math.PI) / 180)}
				y2={size / 2 + (size / 2 - 20) * Math.sin((($minuteSpring - 90) * Math.PI) / 180)}
				stroke={color}
				stroke-linecap="round"
			/>

			<!-- Second hand -->
			<line
				x1={size / 2}
				y1={size / 2}
				x2={size / 2 + (size / 2 - 10) * Math.cos((($secondSpring - 90) * Math.PI) / 180)}
				y2={size / 2 + (size / 2 - 10) * Math.sin((($secondSpring - 90) * Math.PI) / 180)}
				stroke={color}
				stroke-linecap="round"
			/>

			<!-- Center dot -->
			<circle cx={size / 2} cy={size / 2} r="4" fill={color} />
		</svg>
	</div>
</div>

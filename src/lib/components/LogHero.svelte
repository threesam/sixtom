<script lang="ts">
	import { goto } from '$app/navigation'

	interface Props {
		href: string
		title: string
		eyebrow: string
		heroImage: string
		accentColor?: string
		clickable?: boolean
		headingLevel?: 1 | 2
	}

	let {
		href,
		title,
		eyebrow,
		heroImage,
		accentColor = 'var(--color-coin)',
		clickable = false,
		headingLevel = 1
	}: Props = $props()

	let cardEl: HTMLElement | undefined = $state()

	async function navigate(e: MouseEvent) {
		if (!clickable) return
		if (e.metaKey || e.ctrlKey || e.shiftKey) return
		e.preventDefault()
		if (cardEl) {
			cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
			await new Promise((r) => setTimeout(r, 500))
		}
		await goto(href)
	}
</script>

<a
	bind:this={cardEl}
	{href}
	onclick={navigate}
	class="log-hero-card relative block h-[55dvh] w-full overflow-hidden md:h-[65dvh]"
	class:clickable
	data-clickable={clickable}
>
	<img
		src={heroImage}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover"
		fetchpriority="high"
	/>
	<p
		class="eyebrow absolute top-6 left-6 text-sm md:top-10 md:left-10"
		style="color: {accentColor}"
	>
		{eyebrow}
	</p>
	{#if headingLevel === 1}
		<h1
			class="pointer-events-none absolute bottom-6 left-6 z-10 font-mono text-4xl font-bold uppercase tracking-[0.08em] md:bottom-12 md:left-12 md:text-7xl"
			style="color: {accentColor}"
		>
			{title}
		</h1>
	{:else}
		<h2
			class="pointer-events-none absolute bottom-6 left-6 z-10 font-mono text-4xl font-bold uppercase tracking-[0.08em] md:bottom-12 md:left-12 md:text-7xl"
			style="color: {accentColor}"
		>
			{title}
		</h2>
	{/if}
</a>

<style>
	.log-hero-card {
		transition: opacity 0.2s ease;
	}
	.log-hero-card.clickable {
		cursor: pointer;
	}
	@media (prefers-reduced-motion: no-preference) {
		.log-hero-card.clickable:hover {
			opacity: 0.88;
		}
	}
</style>

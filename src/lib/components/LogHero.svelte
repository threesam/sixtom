<script lang="ts">
	import { goto } from '$app/navigation'

	interface Props {
		id?: string
		href: string
		title: string
		eyebrow: string
		heroImage: string
		accentColor?: string
		clickable?: boolean
		headingLevel?: 1 | 2
	}

	let {
		id,
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
		if (id) history.replaceState(null, '', `#${id}`)
		cardEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		await new Promise((r) => setTimeout(r, 500))
		await goto(href)
	}
</script>

<a
	bind:this={cardEl}
	{id}
	{href}
	onclick={navigate}
	class="log-hero-card no-link relative block h-[35dvh] w-full overflow-hidden md:h-[45dvh]"
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
		class="eyebrow absolute top-6 left-1/2 z-10 -translate-x-1/2 text-sm md:top-8"
		style="color: {accentColor}"
	>
		{eyebrow}
	</p>
	{#if headingLevel === 1}
		<h1
			class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center font-mono text-4xl font-bold tracking-[0.08em] uppercase md:text-7xl"
			style="color: oklch(14.5% 0 0)"
		>
			{title}
		</h1>
	{:else}
		<h2
			class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center font-mono text-4xl font-bold tracking-[0.08em] uppercase md:text-7xl"
			style="color: oklch(14.5% 0 0)"
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

<script lang="ts">
	interface Item {
		src: string
		alt: string
		caption: string
	}
	interface Props {
		items: Item[]
	}
	let { items }: Props = $props()
</script>

<div class="relative -mx-6 my-12 md:my-16">
	<!-- A scroller with no focusable children must take focus itself, or
	     keyboard users can't pan it (WCAG 2.1.1; axe scrollable-region-focusable).
	     Svelte's rule doesn't know the region scrolls, hence the ignore. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		role="region"
		aria-label="case-study screenshots"
		tabindex="0"
		class="focus-visible:outline-accent flex snap-x snap-mandatory [scrollbar-width:thin] [scrollbar-color:var(--color-accent)_transparent] gap-4 overflow-x-auto px-6 pb-4 focus-visible:outline-2 focus-visible:-outline-offset-2 md:gap-6 md:px-12"
		style="scroll-padding-inline: 1.5rem;"
	>
		{#each items as item (item.src)}
			<figure class="shrink-0 basis-[85%] snap-start md:basis-[60%] lg:basis-[55%]">
				<div class="overflow-hidden rounded-lg border" style="border-color: var(--color-border);">
					<img
						src={item.src}
						alt={item.alt}
						class="block aspect-[16/10] w-full object-cover"
						loading="lazy"
					/>
				</div>
				<figcaption class="mt-3 px-1 text-sm leading-relaxed" style="color: var(--color-fg-muted);">
					{item.caption}
				</figcaption>
			</figure>
		{/each}
	</div>
</div>

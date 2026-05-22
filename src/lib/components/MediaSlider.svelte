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

<div class="relative -mx-6 my-12 md:my-16" aria-label="case-study screenshots">
	<div
		class="flex snap-x snap-mandatory [scrollbar-width:thin] [scrollbar-color:var(--color-accent)_transparent] gap-4 overflow-x-auto px-6 pb-4 md:gap-6 md:px-12"
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

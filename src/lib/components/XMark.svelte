<script lang="ts">
	// Decorative "X" chip echoing the "to" mark in the sixtom logo: a square tile
	// with a centered "X" that fades in on load. Colours (bg + text) and the
	// border (border-2 border-current — used on the hero h1, omitted on the CTAs)
	// arrive via `class`. The tile is aria-hidden and a sr-only "X" carries the
	// letter, so screen readers still read the surrounding sentence correctly.
	// Pure markup — safe on the csr=false home page.
	let { class: cls = '' }: { class?: string } = $props()
</script>

<span
	data-x-fade
	class="mx-[0.08em] inline-flex aspect-square h-[1.25em] items-center justify-center rounded-[0.2em] align-middle {cls}"
	aria-hidden="true"
	><span
		class="bg-[image:var(--gradient-accent)] bg-clip-text text-[0.95em] leading-none font-black text-transparent"
		>X</span
	></span
><span class="sr-only">X</span>

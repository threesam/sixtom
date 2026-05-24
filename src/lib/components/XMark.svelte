<script lang="ts">
	// Decorative "X" chip echoing the "to" mark in the sixtom logo: a square tile
	// with a centered "X". Colours (bg + text) arrive via `class`. The tile is
	// aria-hidden and a sr-only "X" carries the letter, so screen readers still
	// read the surrounding sentence correctly. Pure markup — safe on the
	// csr=false home page.
	let { class: cls = '' }: { class?: string } = $props()
</script>

<span
	class="mx-[0.08em] inline-flex aspect-square h-[1.25em] items-center justify-center border-2 border-current align-middle {cls}"
	aria-hidden="true"><span class="text-[0.95em] leading-none font-black">X</span></span
><span class="sr-only">X</span>

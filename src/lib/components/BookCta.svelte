<script lang="ts">
	// The "solve for X" booking CTA — teal-gradient pill with the logo-style X
	// chip. Used on the hero and the home page's closing section, so it lives in
	// one place. `event` sets the analytics label; `class` adds per-placement
	// tweaks (e.g. top margin). Pure markup — safe under csr=false.
	import XMark from './XMark.svelte'

	let { event, class: cls = '' }: { event: string; class?: string } = $props()
</script>

<a
	href="/book"
	data-umami-event={event}
	class="btn-accent w-full px-8 py-4 text-center text-xl font-bold md:w-auto md:px-12 md:py-5 md:text-2xl {cls}"
>
	solve for <XMark class="bg-[#161616] text-accent text-[1.35em]" />
</a>

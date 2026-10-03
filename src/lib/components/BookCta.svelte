<script lang="ts">
	// The intro-call CTA (/book), shared by /faq and the case study. `event` sets
	// the analytics label; `class` adds per-placement tweaks (e.g. top margin).
	// Pure markup, safe under csr=false.
	let { event, class: cls = '' }: { event: string; class?: string } = $props()
</script>

<a
	href="/book"
	data-umami-event={event}
	class="btn-accent w-full px-8 py-4 text-center text-xl font-bold md:w-auto md:px-12 md:py-5 md:text-2xl {cls}"
>
	book the intro call →
</a>

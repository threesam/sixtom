<script lang="ts">
	import { page } from '$app/state'
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import PageMeta from '$lib/components/PageMeta.svelte'

	const notFound = $derived(page.status === 404)
</script>

<PageMeta
	title={notFound ? 'not found | SIXTOM' : 'error | SIXTOM'}
	description={notFound ? "this page doesn't exist." : 'something went wrong on this page.'}
/>

<div class="bg-surface flex min-h-svh flex-col">
	<div class="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
		<p class="eyebrow text-sm">{page.status}</p>
		<h1 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">
			{notFound ? 'nothing here.' : 'something broke.'}
		</h1>
		<p class="text-fg-muted mt-6 text-lg leading-relaxed">
			<a href="/" data-umami-event="error_back_home">back to sixtom</a>
		</p>
	</div>
	<SiteFooter />
</div>

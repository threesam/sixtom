<script lang="ts">
	import type { CaseStudy } from '$lib/types/case-study'
	import { page } from '$app/stores'
	let { study }: { study: CaseStudy } = $props()
	let utm = $derived($page.url.search)
	function withUTM(url?: string) {
		if (!url) return undefined
		return utm ? `${url}${url.includes('?') ? '&' : '?'}${utm.slice(1)}` : url
	}
</script>

<section class="bg-black text-white">
	<div class="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2">
		<div>
			<h1 class="mb-2 text-3xl font-bold md:text-5xl">{study.title}</h1>
			{#if study.company || study.industry}
				<p class="text-gray-300">{[study.company, study.industry].filter(Boolean).join(' • ')}</p>
			{/if}
			{#if study.summary}
				<p class="mt-4 text-lg text-gray-200">{study.summary}</p>
			{/if}
			{#if study.metrics?.length}
				<div class="mt-6 grid grid-cols-2 gap-3">
					{#each study.metrics as m}
						<div class="rounded bg-white/10 p-3 text-center">
							<div class="text-2xl font-extrabold text-yellow-400">{m.value}</div>
							<div class="text-sm text-gray-300">{m.label}</div>
						</div>
					{/each}
				</div>
			{/if}
			{#if study.ctaUrl}
				<a href={withUTM(study.ctaUrl)} class="mt-8 inline-block rounded bg-yellow-400 px-6 py-3 font-semibold text-black">
					{study.ctaLabel ?? 'Talk to us'}
				</a>
			{/if}
		</div>
		{#if study.heroImage?.asset?.url}
			<img src={study.heroImage.asset.url} alt={study.title} class="h-full w-full rounded-lg object-cover" />
		{/if}
	</div>
</section>
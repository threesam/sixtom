<script lang="ts">
	import type { CaseStudy } from '$lib/types/case-study'
	let { study }: { study: CaseStudy } = $props()
</script>

<a href={`/case-studies/${study.slug.current}`} class="block w-full rounded-lg bg-white">
	{#if study.heroImage?.asset?.url}
		<img src={study.heroImage.asset.url} alt={study.title} class="h-48 w-full rounded-t-lg object-cover" />
	{/if}
	<div class="space-y-1 p-4">
		<h3 class="text-lg font-semibold text-black">{study.title}</h3>
		{#if study.summary}
			<p class="line-clamp-2 text-sm text-gray-600">{study.summary}</p>
		{/if}
		{#if study.metrics?.length}
			<div class="mt-2 grid grid-cols-2 gap-2 text-xs">
				{#each study.metrics.slice(0, 2) as m}
					<div class="rounded bg-gray-100 px-2 py-1"><span class="font-semibold">{m.value}</span> {m.label}</div>
				{/each}
			</div>
		{/if}
	</div>
</a>
<script lang="ts">
	import type { CaseStudy } from '$lib/types/case-study'
	let { data } = $props()
	let studies: CaseStudy[] = $derived(data.studies || [])
</script>

<section class="container mx-auto px-4 py-16">
	<h1 class="mb-8 text-4xl font-bold">Case Studies</h1>
	<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each studies as s}
			<li class="rounded-lg border bg-white shadow-sm transition hover:shadow-md">
				<a href={`/case-studies/${s.slug.current}`} class="block">
					{#if s.heroImage?.asset?.url}
						<img src={s.heroImage.asset.url} alt={s.title} class="h-48 w-full rounded-t-lg object-cover" />
					{/if}
					<div class="space-y-2 p-4">
						<h2 class="text-xl font-semibold">{s.title}</h2>
						{#if s.company || s.industry}
							<p class="text-sm text-gray-500">{[s.company, s.industry].filter(Boolean).join(' • ')}</p>
						{/if}
						{#if s.summary}
							<p class="line-clamp-3 text-gray-700">{s.summary}</p>
						{/if}
						{#if s.metrics?.length}
							<div class="mt-2 grid grid-cols-2 gap-2 text-sm">
								{#each s.metrics.slice(0, 2) as m}
									<div class="rounded bg-gray-100 px-2 py-1"><span class="font-semibold">{m.value}</span> {m.label}</div>
								{/each}
							</div>
						{/if}
					</div>
				</a>
			</li>
		{/each}
	</ul>
</section>
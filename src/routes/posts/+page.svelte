<script lang="ts">
	import type { BlogPostSummary } from '$lib/types/case-study'
	let { data } = $props()
	let posts: BlogPostSummary[] = $derived(data.posts || [])
</script>

<section class="container mx-auto px-4 py-16">
	<h1 class="mb-8 text-4xl font-bold">Posts</h1>
	<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each posts as p}
			<li class="rounded-lg border bg-white shadow-sm transition hover:shadow-md">
				<a href={`/posts/${p.slug.current}`} class="block">
					{#if p.featuredImage?.asset?.url}
						<img src={p.featuredImage.asset.url} alt={p.title} class="h-48 w-full rounded-t-lg object-cover" />
					{/if}
					<div class="space-y-2 p-4">
						<h2 class="text-xl font-semibold">{p.title}</h2>
						{#if p.excerpt}
							<p class="line-clamp-3 text-gray-700">{p.excerpt}</p>
						{/if}
						{#if p.publishedAt}
							<p class="text-xs text-gray-500">{new Date(p.publishedAt).toLocaleDateString()}</p>
						{/if}
					</div>
				</a>
			</li>
		{/each}
	</ul>
</section>
<script lang="ts">
	import type { BlogPost } from '$lib/types/case-study'
	import RichContent from '$lib/components/RichContent.svelte'
	let { data } = $props()
	let post = $derived(data.post as BlogPost | null)
</script>

{#if post}
	<section class="bg-gray-100 py-16">
		<div class="container mx-auto grid gap-12 px-4 md:grid-cols-3">
			<article class="md:col-span-2">
				<h1 class="mb-4 text-4xl font-bold">{post.title}</h1>
				{#if post.featuredImage?.asset?.url}
					<img src={post.featuredImage.asset.url} alt={post.title} class="mb-6 w-full rounded-lg" />
				{/if}
				<RichContent value={post.body} />
			</article>
			<aside class="space-y-4 rounded-lg bg-white p-4 shadow">
				<h3 class="text-lg font-semibold">Enjoying this content?</h3>
				<p class="text-gray-700">Subscribe to receive case studies and playbooks to accelerate growth.</p>
				<form class="flex gap-2">
					<input type="email" placeholder="Email" class="w-full rounded border px-3 py-2" />
					<button class="rounded bg-black px-4 py-2 font-semibold text-white">Subscribe</button>
				</form>
				<a href="/contact" class="block rounded border border-black px-4 py-2 text-center font-semibold">Talk to us</a>
			</aside>
		</div>
	</section>
{:else}
	<section class="container mx-auto px-4 py-16">
		<p>Post not found.</p>
	</section>
{/if}
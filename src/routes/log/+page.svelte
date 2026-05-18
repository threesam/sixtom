<script lang="ts">
	import type { PageData } from './$types'
	import type { LogPost } from './+page.server'
	import { site } from '$lib/content'

	let { data }: { data: PageData } = $props()

	const dateFmt = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
	function formatDate(iso: string | null): string {
		if (!iso) return ''
		return dateFmt.format(new Date(iso))
	}
</script>

{#snippet entry(post: LogPost)}
	<article>
		<div class="flex items-baseline gap-3">
			{#if post.publishedAt}
				<time
					datetime={post.publishedAt}
					class="text-fg-subtle group-hover:text-coin text-xs tracking-widest uppercase transition-colors"
				>
					{formatDate(post.publishedAt)}
				</time>
			{/if}
			{#if post.pinned}
				<span class="text-accent text-xs tracking-widest uppercase">pinned</span>
			{/if}
			{#if post.linkedinPermalink}
				<span
					aria-hidden="true"
					class="text-fg-subtle group-hover:text-coin ml-auto text-xs transition-colors"
				>→</span>
			{/if}
		</div>
		<p
			class="text-fg mt-4 text-base leading-relaxed break-words whitespace-pre-wrap"
		>{post.text}</p>
		{#if post.imageUrl}
			<img
				src={post.imageUrl}
				alt=""
				loading="lazy"
				class="border-border mt-6 rounded-lg border"
			/>
		{/if}
	</article>
{/snippet}

<svelte:head>
	<title>log — sixtom</title>
	<meta
		name="description"
		content="Everything I'm publishing on LinkedIn, mirrored here in one place."
	/>
	<link rel="canonical" href={`${site.siteUrl}/log`} />
	<meta property="og:title" content="log — sixtom" />
	<meta
		property="og:description"
		content="Everything I'm publishing on LinkedIn, mirrored here in one place."
	/>
	<meta property="og:url" content={`${site.siteUrl}/log`} />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="bg-surface min-h-screen">
	<div class="mx-auto w-full max-w-3xl px-6 py-20">
		<header class="mb-20">
			<a
				href="/"
				class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
				data-umami-event="log_back_home"
			>
				← sixtom
			</a>
			<p class="eyebrow mt-12 text-sm">the log</p>
			<h1 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">
				What I'm shipping, in public.
			</h1>
			<p class="text-fg-muted mt-6 text-lg leading-relaxed">
				Posts as they hit LinkedIn. Notes, builds, opinions, the occasional rant.
			</p>
		</header>

		{#if data.posts.length === 0}
			<p class="text-fg-subtle text-base">No posts yet. Check back soon.</p>
		{:else}
			<ul class="m-0 list-none p-0">
				{#each data.posts as post (post.id)}
					<li class="border-border border-t py-10">
						{#if post.linkedinPermalink}
							<a
								href={post.linkedinPermalink}
								target="_blank"
								rel="noopener noreferrer"
								data-umami-event="log_entry_click"
								class="group block"
							>
								{@render entry(post)}
							</a>
						{:else}
							{@render entry(post)}
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

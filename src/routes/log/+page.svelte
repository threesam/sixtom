<script lang="ts">
	import type { PageData } from './$types'
	import { site } from '$lib/content'
	import LogHero from '$lib/components/LogHero.svelte'
	import { LOG_ENTRIES } from '$lib/log'

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

<svelte:head>
	<title>log — sixtom</title>
	<meta
		name="description"
		content="Everything I'm publishing on LinkedIn, mirrored here in one place."
	/>
	<meta property="og:title" content="log — sixtom" />
	<meta
		property="og:description"
		content="Everything I'm publishing on LinkedIn, mirrored here in one place."
	/>
	<meta property="og:url" content={`${site.siteUrl}/log`} />
	<meta property="og:type" content="website" />
	{#if LOG_ENTRIES[0]}
		<link rel="preload" as="image" href={LOG_ENTRIES[0].heroImage} />
	{/if}
</svelte:head>

<!-- case studies -->
<div class="bg-surface">
	{#each LOG_ENTRIES as entry (entry.slug)}
		<article class="mx-auto mb-12 w-full max-w-3xl px-6 pt-12 md:mb-20 md:pt-20">
			<div class="overflow-hidden rounded-lg">
				<LogHero
					id={entry.slug}
					href={`/log/${entry.slug}`}
					title={entry.title}
					eyebrow={entry.eyebrow}
					heroImage={entry.heroImage}
					clickable={true}
					headingLevel={2}
				/>
			</div>
			<div class="py-6 md:py-8">
				<p class="text-fg-muted text-base leading-relaxed md:text-lg">{entry.blurb}</p>
				<a
					href={`/log/${entry.slug}`}
					class="text-fg-subtle hover:text-coin mt-3 inline-block text-xs tracking-widest uppercase transition-colors"
				>
					read →
				</a>
			</div>
		</article>
	{/each}
</div>

<!-- linkedin feed -->
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
			<h2 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">
				What I'm shipping, in public.
			</h2>
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
						<article>
							<div class="flex items-center gap-3">
								{#if post.publishedAt}
									<time
										datetime={post.publishedAt}
										class="text-fg-subtle text-xs tracking-widest uppercase"
									>
										{formatDate(post.publishedAt)}
									</time>
								{/if}
								{#if post.pinned}
									<span class="text-coin text-xs tracking-widest uppercase">pinned</span>
								{/if}
								{#if post.linkedinPermalink}
									<a
										href={post.linkedinPermalink}
										target="_blank"
										rel="noopener noreferrer"
										data-umami-event="log_entry_visit_linkedin"
										aria-label="View on LinkedIn"
										class="text-fg-subtle hover:text-coin -m-2 ml-auto inline-flex p-2 transition-colors"
									>
										<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
											<path
												d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26zM5.34 7.43c-1.14 0-2.07-.93-2.07-2.07s.93-2.07 2.07-2.07 2.07.93 2.07 2.07-.93 2.07-2.07 2.07zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
											/>
										</svg>
									</a>
								{/if}
							</div>
							<p class="text-fg mt-4 text-base leading-relaxed break-words whitespace-pre-wrap">
								{post.text}
							</p>
							{#if post.imageUrl}
								<img
									src={post.imageUrl}
									alt=""
									loading="lazy"
									class="border-border mt-6 rounded-lg border"
								/>
							{/if}
						</article>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

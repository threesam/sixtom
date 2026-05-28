<script lang="ts">
	import type { PageData } from './$types'
	import { site } from '$lib/content'
	import { LOG_ENTRIES, type LogEntry } from '$lib/log'
	import { blogJsonLd, renderJsonLd } from '$lib/seo/jsonld'

	let { data }: { data: PageData } = $props()

	const blogDescription = "Everything I'm publishing on LinkedIn, mirrored here in one place."
	const blogLd = renderJsonLd(blogJsonLd(blogDescription))

	// UTC so a calendar date like "2026-05-18" (parsed as UTC midnight) isn't
	// rolled back a day when formatted in a behind-UTC local timezone.
	const dateFmt = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	})
	function formatDate(iso: string | null): string {
		if (!iso) return ''
		return dateFmt.format(new Date(iso))
	}

	// One timeline: LinkedIn posts + log writeups, pinned first then newest-first.
	// A writeup (e.g. the garden-party case study) slots in on its publish date
	// like any other entry instead of sitting in a separate hero section.
	type PostItem = PageData['posts'][number]
	type FeedItem =
		| { kind: 'post'; date: string | null; pinned: boolean; post: PostItem }
		| { kind: 'writeup'; date: string; pinned: false; entry: LogEntry }
	const feed: FeedItem[] = $derived(
		[
			...data.posts.map(
				(post): FeedItem => ({ kind: 'post', date: post.publishedAt, pinned: post.pinned, post })
			),
			...LOG_ENTRIES.map(
				(entry): FeedItem => ({ kind: 'writeup', date: entry.date, pinned: false, entry })
			)
		].sort((a, b) => {
			if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
			return (b.date ?? '').localeCompare(a.date ?? '')
		})
	)
</script>

<svelte:head>
	<title>log | SIXTOM</title>
	<meta name="description" content={blogDescription} />
	<meta property="og:title" content="log | SIXTOM" />
	<meta property="og:description" content={blogDescription} />
	<meta property="og:url" content={`${site.siteUrl}/log`} />
	<meta property="og:type" content="website" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: JSON.stringify of typed in-repo content -->
	{@html blogLd}
</svelte:head>

<div class="bg-surface min-h-screen">
	<div class="mx-auto w-full max-w-3xl px-6 py-20">
		<header class="mb-20">
			<a
				href="/"
				class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
				data-umami-event="log_back_home"
			>
				sixtom
			</a>
			<p class="eyebrow mt-12 text-sm">the log</p>
			<h2 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">
				What I'm shipping, in public.
			</h2>
			<p class="text-fg-muted mt-6 text-lg leading-relaxed">
				Posts as they hit LinkedIn. Notes, builds, opinions, the occasional rant.
			</p>
		</header>

		{#if feed.length === 0}
			<p class="text-fg-subtle text-base">No posts yet. Check back soon.</p>
		{:else}
			<ul class="m-0 list-none p-0">
				{#each feed as item (item.kind === 'post' ? `p${String(item.post.id)}` : `w-${item.entry.slug}`)}
					<li class="border-border border-t py-10">
						{#if item.kind === 'post'}
							<article>
								<div class="flex items-center gap-3">
									{#if item.post.publishedAt}
										<time
											datetime={item.post.publishedAt}
											class="text-fg-subtle text-xs tracking-widest uppercase"
										>
											{formatDate(item.post.publishedAt)}
										</time>
									{/if}
									{#if item.post.pinned}
										<span class="text-coin text-xs tracking-widest uppercase">pinned</span>
									{/if}
									{#if item.post.linkedinPermalink}
										<a
											href={item.post.linkedinPermalink}
											target="_blank"
											rel="noopener noreferrer"
											data-umami-event="log_entry_visit_linkedin"
											aria-label="View on LinkedIn"
											class="no-link text-fg-subtle hover:text-coin -m-2 ml-auto inline-flex p-2 transition-colors"
										>
											<svg
												class="h-4 w-4"
												viewBox="0 0 24 24"
												fill="currentColor"
												aria-hidden="true"
											>
												<path
													d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26zM5.34 7.43c-1.14 0-2.07-.93-2.07-2.07s.93-2.07 2.07-2.07 2.07.93 2.07 2.07-.93 2.07-2.07 2.07zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
												/>
											</svg>
										</a>
									{/if}
								</div>
								<p class="text-fg mt-4 text-base leading-relaxed break-words whitespace-pre-wrap">
									{item.post.text}
								</p>
								{#if item.post.imageUrl}
									<img
										src={item.post.imageUrl}
										alt=""
										loading="lazy"
										class="border-border mt-6 rounded-lg border"
									/>
								{/if}
							</article>
						{:else if item.kind === 'writeup'}
							<article>
								<div class="flex items-center gap-3">
									<time
										datetime={item.entry.date}
										class="text-fg-subtle text-xs tracking-widest uppercase"
									>
										{formatDate(item.entry.date)}
									</time>
									<span class="text-coin text-xs tracking-widest uppercase">writeup</span>
								</div>
								<a
									href={`/log/${item.entry.slug}`}
									data-umami-event="log_writeup_visit"
									class="no-link text-fg hover:text-coin mt-4 block text-2xl font-bold tracking-tight transition-colors"
								>
									{item.entry.title}
								</a>
								<p class="text-fg-muted mt-3 text-base leading-relaxed">{item.entry.blurb}</p>
								<img
									src={item.entry.heroImage}
									alt=""
									loading="lazy"
									class="border-border mt-6 rounded-lg border"
								/>
								<a
									href={`/log/${item.entry.slug}`}
									data-umami-event="log_writeup_read"
									class="text-fg-subtle hover:text-coin mt-4 inline-block text-xs tracking-widest uppercase transition-colors"
								>
									read
								</a>
							</article>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

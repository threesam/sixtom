<script lang="ts">
	import { site } from '$lib/content'
	import { LOG_ENTRIES } from '$lib/log'
	import { blogJsonLd, renderJsonLd } from '$lib/seo/jsonld'

	const blogDescription =
		'Case studies and build notes from the work — what I shipped, why, and what the numbers showed.'
	const blogLd = renderJsonLd(blogJsonLd(blogDescription))

	// UTC so a calendar date like "2026-05-18" (parsed as UTC midnight) isn't
	// rolled back a day when formatted in a behind-UTC local timezone.
	const dateFmt = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	})
	function formatDate(iso: string): string {
		return dateFmt.format(new Date(iso))
	}

	// Curated writeups only (case studies / build notes), newest first. The raw
	// LinkedIn feed lives on threesam.com/thoughts now — the commercial log is
	// proof-of-work, not a social mirror.
	const entries = [...LOG_ENTRIES].sort((a, b) => b.date.localeCompare(a.date))
</script>

<svelte:head>
	<title>log | SIXTOM</title>
	<meta name="description" content={blogDescription} />
	<meta property="og:title" content="log | SIXTOM" />
	<meta property="og:description" content={blogDescription} />
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
				Case studies and build notes — the decisions, the experiments, the numbers.
			</p>
		</header>

		{#if entries.length === 0}
			<p class="text-fg-subtle text-base">No writeups yet. Check back soon.</p>
		{:else}
			<ul class="m-0 list-none p-0">
				{#each entries as entry (entry.slug)}
					<li class="border-border border-t py-10">
						<article>
							<div class="flex items-center gap-3">
								<time
									datetime={entry.date}
									class="text-fg-subtle text-xs tracking-widest uppercase"
								>
									{formatDate(entry.date)}
								</time>
								<span class="text-coin text-xs tracking-widest uppercase">writeup</span>
							</div>
							<a
								href={`/log/${entry.slug}`}
								data-umami-event="log_writeup_visit"
								class="no-link text-fg hover:text-coin mt-4 block text-2xl font-bold tracking-tight transition-colors"
							>
								{entry.title}
							</a>
							<p class="text-fg-muted mt-3 text-base leading-relaxed">{entry.blurb}</p>
							<img
								src={entry.heroImage}
								alt=""
								loading="lazy"
								class="border-border mt-6 rounded-lg border"
							/>
							<a
								href={`/log/${entry.slug}`}
								data-umami-event="log_writeup_read"
								class="text-fg-subtle hover:text-coin mt-4 inline-block text-xs tracking-widest uppercase transition-colors"
							>
								read
							</a>
						</article>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

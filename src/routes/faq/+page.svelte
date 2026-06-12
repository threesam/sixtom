<script lang="ts">
	import { site, FAQ } from '$lib/content'
	import { faqPageJsonLd, renderJsonLd } from '$lib/seo/jsonld'
	import BookCta from '$lib/components/BookCta.svelte'

	// Visible FAQ + matching FAQPage schema (engines require the answer text be on
	// the page, which it is). Questions/answers live in src/lib/content/faq.ts.
	const faqLd = renderJsonLd(faqPageJsonLd(FAQ, `${site.siteUrl}/faq`))
</script>

<svelte:head>
	<title>faq | SIXTOM</title>
	<meta
		name="description"
		content="what sixtom does, what it costs, how the audit and sprint work, and what happens if it won't ship in two weeks."
	/>
	<meta property="og:title" content="faq | SIXTOM" />
	<meta
		property="og:description"
		content="what sixtom does, what it costs, and how the audit and sprint work."
	/>
	<meta property="og:type" content="website" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: JSON.stringify of typed in-repo content -->
	{@html faqLd}
</svelte:head>

<div class="bg-surface min-h-screen">
	<div class="mx-auto w-full max-w-3xl px-6 py-20">
		<header class="mb-16">
			<a
				href="/"
				class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
				data-umami-event="faq_back_home"
			>
				sixtom
			</a>
			<p class="eyebrow mt-12 text-sm">questions</p>
			<h1 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">faq.</h1>
			<p class="text-fg-muted mt-6 text-lg leading-relaxed">
				the things people ask before they book. straight answers.
			</p>
		</header>

		<dl class="text-fg-muted space-y-10 text-base leading-relaxed">
			{#each FAQ as { question, answer } (question)}
				<div>
					<dt class="text-fg text-xl font-semibold tracking-tight">{question}</dt>
					<dd class="mt-3">{answer}</dd>
				</div>
			{/each}
		</dl>

		<div class="border-border mt-16 border-t pt-12">
			<p class="text-fg text-2xl font-semibold tracking-tight">still have a question?</p>
			<p class="text-fg-muted mt-3 text-base leading-relaxed">
				book the intro call — 30 minutes, no pitch.
			</p>
			<BookCta event="cta_faq_book" class="mt-8" />
		</div>
	</div>
</div>

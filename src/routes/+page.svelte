<script lang="ts">
	import Hero from '$lib/components/Hero.svelte'
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import TeardownReward from '$lib/components/TeardownReward.svelte'
	import { site, grandSlam, LEDGER_TOTAL_USD } from '$lib/content'
	import PageMeta from '$lib/components/PageMeta.svelte'

	const o = grandSlam
	const eyebrowClass = 'eyebrow text-sm'
	const h2Class =
		'text-fg mt-2 text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl'
	const bodyClass = 'text-fg-muted mt-6 max-w-2xl text-base leading-relaxed md:text-lg'
	const usd = (n: number) => `$${n.toLocaleString('en-US')}`

	const description =
		"your team is building with AI and nothing's better. two weeks: one process written down and running by day 10, or the rest is free. $15,000 fixed."
	const pageTitle = `SIXTOM | ${o.headline}`
	// The proof title drops its closing period on screen (content keeps it for the
	// link preview). From md up it sets as two right-aligned lines, split at its last
	// comma: the line break is the comma, so no line ends on a mark.
	const [proofLead = '', proofTail] = o.proof.heading.replace(/\.$/, '').split(/,\s+(?=[^,]*$)/)
	// One shape for a proof square and for the stat laid over it: square, each
	// stepped down from the last by a page gutter on phones, a quarter of a tile
	// from md up.
	const proofSquare =
		'aspect-square min-[360px]:nth-2:translate-y-6 min-[360px]:nth-3:translate-y-12 md:nth-2:translate-y-1/4 md:nth-3:translate-y-1/2'
</script>

<!-- Link previews stay vague on purpose: brand title + a result line, no offer or
     price (the card sits on Sam's LinkedIn). Search keeps the specific title and description. -->
<PageMeta
	title={pageTitle}
	{description}
	socialTitle="SIXTOM"
	socialDescription={o.proof.heading}
/>

<Hero />

<!-- the wall -->
<section class="surface-uv py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>{o.wall.thesis}</h2>
		<p class={bodyClass}>{o.wall.para}</p>
		<!-- A stacked list, not three equal cards: the costs read in order, each
		     term big enough to land on its own. -->
		<dl class="mt-8 space-y-6">
			{#each o.wall.costCards as card (card.title)}
				<div>
					<dt class="text-fg text-2xl font-bold tracking-tight md:text-3xl">{card.title}</dt>
					<dd class="text-fg-muted mt-1 text-base leading-relaxed md:text-lg">{card.sub}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<!-- the ledger -->
<section class="bg-surface py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>{o.ledger.heading}</h2>
		<p class={bodyClass}>{o.ledger.para}</p>

		<!-- Groups collapse to a scannable 5-row bill (title + subtotal); native
		     <details> keeps the page zero-JS. Subtotals gain a "+" when the group
		     holds an unpriced core/included line, mirroring the grand total's "+". -->
		<div class="border-border mt-10 border-t">
			{#each o.ledger.groups as group (group.title)}
				{@const subtotal = group.lines.reduce((sum, l) => sum + (l.valueUSD ?? 0), 0)}
				{@const hasUnpriced = group.lines.some((l) => l.valueUSD === null)}
				<details class="group border-border border-b">
					<summary
						class="focus-visible:outline-accent flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden"
					>
						<span class="flex min-w-0 items-baseline gap-3">
							<span
								aria-hidden="true"
								class="text-fg-subtle inline-block transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
								>+</span
							>
							<span class="text-fg text-base font-semibold md:text-lg">{group.title}</span>
						</span>
						<span class="text-fg-subtle shrink-0 text-sm font-semibold tabular-nums">
							{usd(subtotal)}{hasUnpriced ? '+' : ''}
						</span>
					</summary>
					<ul class="divide-border divide-y pb-2">
						{#each group.lines as item (item.line)}
							<li class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 pl-7">
								<div class="min-w-0">
									<p class="text-fg text-base font-semibold">{item.line}</p>
									<p class="text-fg-muted mt-1 text-sm leading-relaxed">{item.sub}</p>
								</div>
								<p class="text-fg-subtle shrink-0 text-sm font-semibold tabular-nums">
									{item.valueUSD === null ? item.valueLabel : usd(item.valueUSD)}
								</p>
							</li>
						{/each}
					</ul>
					{#if group.note}
						<p class="text-fg-subtle max-w-2xl pb-5 pl-7 text-sm leading-relaxed">{group.note}</p>
					{/if}
				</details>
			{/each}
		</div>

		<div class="mt-8">
			<div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
				<p class="text-fg text-lg font-bold">total value</p>
				<p class="text-fg text-lg font-bold tabular-nums">{usd(LEDGER_TOTAL_USD)}+</p>
			</div>
			<div
				class="mt-3 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6"
			>
				<p class="text-fg-muted text-base">you pay</p>
				<p class="text-fg flex flex-wrap gap-x-1.5 text-base font-semibold md:justify-end">
					{#each o.ledger.payParts as part (part.text)}
						{#if part.struck}<s class="text-fg-subtle">{part.text}</s>{:else}<span>{part.text}</span
							>{/if}
					{/each}
				</p>
			</div>
			<p class="text-fg-subtle mt-8 max-w-2xl text-sm leading-relaxed">{o.ledger.anchorLine}</p>
		</div>
	</div>
</section>

<!-- the guarantee -->
<section class="surface-uv py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2
			class="text-fg mt-2 text-3xl leading-tight font-bold tracking-tight text-balance md:text-[2.5rem]"
		>
			{o.guarantee.headline}
		</h2>
		<p class={bodyClass}>{o.guarantee.body}</p>
	</div>
</section>

<!-- proof -->
<section class="bg-surface py-20 md:py-28">
	<!-- From md up the title shares the stat row's wider container and is
	     right-aligned in two lines, so it ends on the last square's right edge: the
	     squares step down and away from it. Phones keep one flowing left-aligned
	     heading, comma included. -->
	<div class="mx-auto w-full max-w-3xl px-6 md:max-w-5xl md:text-right">
		<p class={eyebrowClass}>{o.proof.eyebrow}</p>
		<h2 class={h2Class}>
			{#if proofTail}
				<span class="md:block">{proofLead}<span class="md:hidden">,</span></span>
				<span class="md:block">{proofTail}</span>
			{:else}
				{proofLead}
			{/if}
		</h2>
	</div>
	<!-- The numbers as three dark squares, each holding its own part of one bubble
	     field (static/bubbles.js drives every [data-bubble] canvas, and samples the
	     field by page position), each stat centered, each square stepped down from
	     the last. A square's field ends on whole circles on all four sides, so
	     nothing clips it. On phones the row is full-bleed
	     (the outer squares touch the screen edges) and the step is one page gutter.
	     From md up the row is centered on the page and wider than the text column
	     (max-w-5xl), so the middle square sits on the centre line and the outer two
	     overhang the column equally, and the step is a quarter of a tile.
	     Under 360px the gaps and the step close and it is one solid band. Phone
	     labels are capped at 13ch so each breaks to two lines; the numbers are
	     capped by their tile's width (cqw) and labels may break mid-word, so at
	     320px / 200% text nothing spills out of a square.
	     e2e/proof-band.spec.ts pins all of it. -->
	<div class="mt-10 md:mx-auto md:mt-14 md:max-w-5xl md:px-6">
		<div class="@container relative min-[360px]:pb-12 md:pb-[calc((100%-3rem)/6)]">
			<div
				class="pointer-events-none absolute inset-0 grid grid-cols-3 content-start min-[360px]:gap-6"
				aria-hidden="true"
			>
				{#each o.proof.tiles as tile (tile.label)}
					<div class="{proofSquare} relative">
						<canvas
							data-bubble="whole-top whole-bottom whole-left whole-right"
							class="absolute inset-0 block h-full w-full"
						></canvas>
						<div class="absolute inset-0 bg-black/60"></div>
					</div>
				{/each}
			</div>
			<dl class="relative grid grid-cols-3 min-[360px]:gap-6">
				{#each o.proof.tiles as tile (tile.label)}
					<div
						class="{proofSquare} @container flex flex-col-reverse items-center justify-center px-2 text-center"
					>
						<dt
							class="text-fg-muted mt-2 max-w-[min(13ch,100%)] text-[11px] leading-snug tracking-wider wrap-anywhere uppercase md:mt-3 md:max-w-full md:text-sm md:tracking-widest"
						>
							{tile.label}
						</dt>
						<dd
							class="text-fg font-display text-[length:min(2.25rem,50cqw)] leading-[1.1] font-bold tracking-tight tabular-nums md:text-[length:min(6rem,32cqw)] md:leading-none"
						>
							{tile.value}
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
	<div class="mx-auto w-full max-w-3xl px-6">
		<h3 class="text-fg mt-16 text-xl font-bold tracking-tight md:mt-20 md:text-2xl">
			{o.proof.broke.heading}
		</h3>
		<ul class="text-fg-muted mt-4 max-w-2xl space-y-3 text-base leading-relaxed md:text-lg">
			{#each o.proof.broke.lines as line (line)}
				<li>{line}</li>
			{/each}
		</ul>
		<p class="text-fg mt-6 max-w-2xl text-base leading-relaxed font-semibold md:text-lg">
			{o.proof.broke.turn}
		</p>
		<p class="text-fg-subtle mt-6 max-w-2xl text-sm leading-relaxed">{o.proof.bridge}</p>
		<blockquote
			class="border-accent text-fg mt-14 max-w-2xl border-l-4 pl-6 text-xl leading-snug font-semibold md:pl-8 md:text-2xl"
		>
			“{site.testimonial.quote}”
			<footer class="text-accent mt-4 text-xs font-normal tracking-widest uppercase">
				{site.testimonial.attribution}
			</footer>
		</blockquote>
	</div>
</section>

<!-- is this you -->
<section class="surface-uv py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>{o.isThisYou.heading}</h2>
		<div class="mt-10 grid gap-10 md:grid-cols-2">
			<div>
				<p class="text-fg text-lg font-semibold">{o.isThisYou.yesLead}</p>
				<ul class="text-fg-muted mt-4 space-y-3 text-base leading-relaxed">
					{#each o.isThisYou.yes as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
			<div>
				<p class="text-fg text-lg font-semibold">{o.isThisYou.noLead}</p>
				<ul class="text-fg-muted mt-4 space-y-3 text-base leading-relaxed">
					{#each o.isThisYou.no as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- the two weeks -->
<section class="bg-surface py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>{o.timeline.heading}</h2>
		<ol class="border-border divide-border mt-10 divide-y border-y">
			{#each site.process as step (step.label)}
				<li class="grid gap-1 py-5 md:grid-cols-[12rem_1fr] md:gap-6">
					<p class="text-fg-subtle text-xs tracking-widest uppercase">{step.label}</p>
					<p class="text-fg-muted text-base leading-relaxed">{step.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- close / waitlist. The hero's bookend: the same bubble field on the dark
     surface, so the page opens and closes on it (the one place two dark sections
     meet; the field is the divider). The copy sits in a card: near-opaque so
     small muted text keeps its contrast over the field, padded, and narrower
     than the screen at every width (a 1rem gutter on phones, capped at max-w-md,
     then max-w-2xl from md up) so the field is lit on all four sides of it.
     e2e/close-card.spec.ts pins the gutter and the padding. -->
<section id="waitlist" class="bg-surface relative px-4 py-20 md:py-32">
	<!-- No line under this section: the footer is the same surface and carries no
	     border, so the field is dimmed by its own opacity (an overlay would darken
	     the section against the footer) and ends on whole circles, not a cut. -->
	<canvas
		data-bubble="whole-top whole-bottom"
		class="pointer-events-none absolute inset-0 block h-full w-full opacity-65"
		aria-hidden="true"
	></canvas>
	<div class="relative mx-auto w-full max-w-md rounded-2xl bg-black/90 p-6 md:max-w-2xl md:p-12">
		<h2 class={h2Class}>{o.close.heading}</h2>

		<!-- csr=false: plain cross-route POST to the /notify action. No JS anywhere
			     on this page — the visitor lands on /notify with the server-rendered
			     result. Honeypot + rate limit + validation still apply server-side. -->
		<form method="post" action="/notify?/notify" class="mt-10 max-w-xl space-y-4">
			<!-- Placeholders only, as on /book: each field says what goes in it, and the
			     labels are for screen readers. No visible label on one field and not the other. -->
			<label class="sr-only" for="waitlist-email">email address</label>
			<input
				id="waitlist-email"
				name="email"
				type="email"
				required
				autocomplete="email"
				placeholder={o.close.emailPlaceholder}
				class="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent block w-full rounded-md border px-4 py-3 text-base focus:ring-2 focus:outline-none"
			/>
			<label class="sr-only" for="waitlist-build">{o.close.buildLabel}</label>
			<textarea
				id="waitlist-build"
				name="message"
				required
				rows="3"
				maxlength="4000"
				placeholder={o.close.buildLabel}
				class="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent block w-full rounded-md border px-4 py-3 text-base focus:ring-2 focus:outline-none"
			></textarea>
			<input type="hidden" name="name" value="Waitlist signup" />
			<input
				type="text"
				name="company"
				tabindex="-1"
				autocomplete="off"
				aria-hidden="true"
				class="absolute top-auto left-[-9999px] h-px w-px overflow-hidden"
			/>
			<button
				type="submit"
				data-umami-event="cta_waitlist_submit"
				class="btn-accent w-full px-8 py-4 text-center text-xl font-bold md:w-auto md:px-12"
			>
				{o.close.button}
			</button>
		</form>

		<TeardownReward class="text-fg-muted mt-8 text-sm leading-relaxed" />
	</div>
</section>

<!-- Page-level, outside the sections, on the root dark surface, same as every
     other route. -->
<SiteFooter />

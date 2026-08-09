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

	// One string, three tags: og and twitter drift apart the moment they are
	// edited separately.
	const socialDescription =
		'live in production on day 10 — and you own every line of it. $10,000 flat, 1 client a month.'
	const pageTitle = `SIXTOM — ${o.headline}`
</script>

<PageMeta
	title={pageTitle}
	description="the production sprint: {socialDescription}"
	{socialDescription}
/>

<Hero />

<!-- the wall -->
<section class="surface-uv py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class={h2Class}>{o.wall.thesis}</h2>
		<p class={bodyClass}>{o.wall.para}</p>
		<p class="text-fg mt-8 max-w-2xl text-base leading-relaxed font-semibold md:text-lg">
			{o.wall.turn}
		</p>
		<ul class="mt-8 grid gap-4 md:grid-cols-3">
			{#each o.wall.costCards as card (card.title)}
				<li class="border-border rounded-lg border p-6">
					<p class="text-fg font-semibold">{card.title}</p>
					<p class="text-fg-muted mt-2 text-sm leading-relaxed">{card.sub}</p>
				</li>
			{/each}
		</ul>
		<p class="text-fg-muted mt-8 text-base leading-relaxed md:text-lg">
			{o.wall.taxLine}
			<a href="/tax" data-umami-event="cta_tax_calc">run yours →</a>
		</p>
	</div>
</section>

<!-- the ledger -->
<section class="bg-surface py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class={eyebrowClass}>{o.ledger.eyebrow}</p>
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
		<!-- Clause-per-line (\n in the content string); sized so each clause
		     holds a single line inside max-w-3xl on desktop. -->
		<h2 class="text-fg mt-2 text-3xl leading-tight font-bold tracking-tight md:text-[2.5rem]">
			{#each o.guarantee.headline.split('\n') as line (line)}
				<span class="block">{line}</span>
			{/each}
		</h2>
		<p class={bodyClass}>{o.guarantee.body}</p>
	</div>
</section>

<!-- proof -->
<section class="bg-surface py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class={eyebrowClass}>{o.proof.eyebrow}</p>
		<h2 class={h2Class}>{o.proof.heading}</h2>
		<p class={bodyClass}>{o.proof.para}</p>
		<ul class="mt-10 grid list-none grid-cols-2 gap-6 p-0 md:grid-cols-4">
			{#each o.proof.tiles as tile (tile.label)}
				<li>
					<p class="text-fg text-2xl font-bold tabular-nums md:text-3xl">{tile.value}</p>
					<p class="text-fg-subtle mt-1 text-xs tracking-widest uppercase">{tile.label}</p>
				</li>
			{/each}
		</ul>
		<p class={bodyClass}>{o.proof.para2}</p>
		<p class="text-fg-subtle mt-6 max-w-2xl text-sm leading-relaxed">{o.proof.bridge}</p>
		<blockquote class="text-fg-muted mt-10 max-w-2xl text-base leading-relaxed italic md:text-lg">
			“{site.testimonial.quote}”
			<footer class="text-fg-subtle mt-2 text-sm not-italic">
				— {site.testimonial.attribution}
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

<!-- close / waitlist -->
<section id="waitlist" class="surface-uv py-20 md:py-28">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class={eyebrowClass}>{o.close.scarcity}</p>
		<h2 class={h2Class}>{o.close.heading}</h2>

		<!-- csr=false: plain cross-route POST to the /notify action. No JS anywhere
		     on this page — the visitor lands on /notify with the server-rendered
		     result. Honeypot + rate limit + validation still apply server-side. -->
		<form method="post" action="/notify?/notify" class="mt-10 max-w-xl space-y-4">
			<label class="sr-only" for="waitlist-email">email address</label>
			<input
				id="waitlist-email"
				name="email"
				type="email"
				required
				autocomplete="email"
				placeholder={o.close.emailPlaceholder}
				class="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent w-full rounded-md border px-4 py-3 text-lg focus:ring-2 focus:outline-none"
			/>
			<label class="text-fg-muted block text-sm" for="waitlist-build">
				{o.close.buildLabel}
				<textarea
					id="waitlist-build"
					name="message"
					required
					rows="3"
					maxlength="4000"
					placeholder={o.close.buildPlaceholder}
					class="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent mt-2 w-full rounded-md border px-4 py-3 text-base focus:ring-2 focus:outline-none"
				></textarea>
			</label>
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

		<TeardownReward class="text-fg-muted mt-8 max-w-xl text-base leading-relaxed" />
	</div>
</section>

<!-- Page-level, outside the UV section, so the footer keeps the root dark
     surface — the page opens dark and closes dark, same as every other route. -->
<SiteFooter />

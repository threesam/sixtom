<script lang="ts">
	import { site } from '$lib/content'
</script>

<section id="offers" class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-4xl px-6 py-16 md:py-20">
		<p class="eyebrow text-sm">two ways in</p>
		<h2 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">start small. or go.</h2>

		<div
			class="-mx-6 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 md:pb-0"
		>
			<article
				class="border-border flex w-[80vw] shrink-0 snap-start flex-col rounded-lg border p-8 md:w-auto"
			>
				<p class="eyebrow text-xs">step 1 — start here</p>
				<h3 class="text-fg mt-2 text-2xl font-bold tracking-tight md:text-3xl">
					the {site.audit.name}.
				</h3>
				<p class="text-fg-muted mt-4 text-base leading-relaxed">
					{site.audit.promise}
				</p>
				<div class="mt-auto pt-8">
					<p class="text-fg text-xl font-semibold">
						${site.audit.priceUSD.toLocaleString()}. {site.audit.cadence}
					</p>
					<a
						href={site.bookingUrl}
						data-umami-event="cta_audit_book"
						class="btn-accent mt-6 px-6 py-3 text-base hover:opacity-90"
						rel="noopener noreferrer"
						target="_blank"
					>
						start the audit →
					</a>
				</div>
			</article>

			<article
				class="border-border-strong ring-border flex w-[80vw] shrink-0 snap-start flex-col rounded-lg border p-8 ring-1 md:w-auto"
			>
				<p class="eyebrow text-xs">step 2 — when you're ready</p>
				<h3 class="text-fg mt-2 text-2xl font-bold tracking-tight md:text-3xl">
					the {site.sprint.name}.
				</h3>
				<p class="text-fg-muted mt-4 text-base leading-relaxed">
					{site.sprint.promise}
				</p>
				<div class="mt-auto pt-8">
					<p class="text-fg text-xl font-semibold">
						${site.sprint.priceUSD.toLocaleString()}. {site.sprint.cadence}
					</p>
					{#if site.sprint.introPriceUSD && site.sprint.introNote}
						<p class="text-fg-subtle mt-1 text-sm">
							intro rate ${site.sprint.introPriceUSD.toLocaleString()} for the {site.sprint
								.introNote}.
						</p>
					{/if}
					{#if site.sprint.paymentPlan}
						<p class="text-fg-subtle mt-1 text-sm">
							or {site.sprint.paymentPlan}.
						</p>
					{/if}
					<a
						href={site.bookingUrl}
						data-umami-event="cta_sprint_book"
						class="btn-accent mt-6 px-6 py-3 text-base hover:opacity-90"
						rel="noopener noreferrer"
						target="_blank"
					>
						book the call →
					</a>
				</div>
			</article>
		</div>
	</div>
</section>

<section class="snap-section surface-uv">
	<div class="mx-auto w-full max-w-4xl px-6">
		<dl class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each site.stats as { value, label } (label)}
				<div>
					<dt class="text-fg text-3xl font-bold tracking-tight md:text-5xl">{value}</dt>
					<dd class="text-fg-subtle mt-2 text-xs tracking-widest uppercase">{label}</dd>
				</div>
			{/each}
		</dl>

		<blockquote
			class="text-fg-muted mt-20 text-base leading-relaxed italic md:text-lg"
		>
			“{site.testimonial.quote}”
			<footer class="text-fg-subtle mt-2 text-sm not-italic">
				— {site.testimonial.attribution}
			</footer>
		</blockquote>
	</div>
</section>

<script lang="ts">
	import { site } from '$lib/content'
</script>

<section id="offers" class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-4xl px-6">
		<p class="eyebrow text-sm">two ways in</p>
		<h2 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">Start small. Or go.</h2>

		<div class="mt-12 grid gap-8 md:grid-cols-2">
			<article class="border-border flex flex-col rounded-lg border p-8">
				<p class="eyebrow text-xs">step 1 — start here</p>
				<h3 class="text-fg mt-2 text-2xl font-bold tracking-tight md:text-3xl">
					The {site.audit.name}.
				</h3>
				<p class="text-coin mt-3 text-xl font-semibold">
					${site.audit.priceUSD}. {site.audit.cadence}
				</p>
				<p class="text-fg-muted mt-4 text-base leading-relaxed">
					{site.audit.promise}
				</p>
				<div class="mt-auto pt-8">
					<a
						href={site.bookingUrl}
						data-umami-event="cta_audit_book"
						class="btn-coin px-6 py-3 text-base hover:opacity-90"
						rel="noopener noreferrer"
						target="_blank"
					>
						Start the audit →
					</a>
				</div>
			</article>

			<article class="border-border-strong ring-border flex flex-col rounded-lg border p-8 ring-1">
				<p class="eyebrow text-xs">step 2 — when you're ready</p>
				<h3 class="text-fg mt-2 text-2xl font-bold tracking-tight md:text-3xl">
					The {site.sprint.name}.
				</h3>
				<p class="text-coin mt-3 text-xl font-semibold">
					${site.sprint.priceUSD.toLocaleString()}. {site.sprint.cadence}
				</p>
				<p class="text-fg-muted mt-4 text-base leading-relaxed">
					{site.sprint.promise}
				</p>
				<div class="mt-auto pt-8">
					<a
						href={site.bookingUrl}
						data-umami-event="cta_sprint_book"
						class="btn-coin px-6 py-3 text-base hover:opacity-90"
						rel="noopener noreferrer"
						target="_blank"
					>
						Book the call →
					</a>
				</div>
			</article>
		</div>

		<dl class="border-border mt-12 grid grid-cols-3 gap-6 border-t pt-10">
			{#each site.stats as { value, label } (label)}
				<div>
					<dt class="text-coin text-2xl font-bold tracking-tight md:text-4xl">{value}</dt>
					<dd class="text-fg-subtle mt-1 text-xs tracking-widest uppercase">{label}</dd>
				</div>
			{/each}
		</dl>

		<blockquote
			class="border-border-strong text-fg-muted mt-12 border-l-2 pl-6 text-base leading-relaxed italic md:text-lg"
		>
			“{site.testimonial.quote}”
			<footer class="text-fg-subtle mt-2 text-sm not-italic">
				— {site.testimonial.attribution}
			</footer>
		</blockquote>
	</div>
</section>

<script lang="ts">
	import { site } from '$lib/content'
</script>

<section id="offers" class="snap-section bg-neutral-900">
	<div class="mx-auto w-full max-w-4xl px-6">
		<p class="text-coin text-sm tracking-widest uppercase">two ways in</p>
		<h2 class="mt-2 text-4xl font-bold tracking-tight text-neutral-100 md:text-6xl">
			Start small. Or go.
		</h2>

		<div class="mt-12 grid gap-8 md:grid-cols-2">
			<article class="flex flex-col rounded-lg border border-neutral-800 bg-neutral-950 p-8">
				<p class="text-coin text-xs tracking-widest uppercase">start here</p>
				<h3 class="mt-2 text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">
					The {site.audit.name}.
				</h3>
				<p class="text-coin mt-3 text-xl font-semibold">
					${site.audit.priceUSD}. {site.audit.cadence}
				</p>
				<p class="mt-4 text-base leading-relaxed text-neutral-300">
					{site.audit.promise}
				</p>
				<div class="mt-auto pt-8">
					<a
						href={site.bookingUrl}
						data-umami-event="cta_audit_book"
						class="bg-coin inline-block rounded-md px-6 py-3 text-base font-medium text-neutral-950 transition-opacity hover:opacity-90"
						rel="noopener noreferrer"
						target="_blank"
					>
						Start the audit →
					</a>
				</div>
			</article>

			<article class="flex flex-col rounded-lg border border-neutral-800 bg-neutral-950 p-8">
				<p class="text-coin text-xs tracking-widest uppercase">when you're ready</p>
				<h3 class="mt-2 text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">
					The {site.sprint.name}.
				</h3>
				<p class="text-coin mt-3 text-xl font-semibold">
					${site.sprint.priceUSD.toLocaleString()}. {site.sprint.cadence}
				</p>
				<p class="mt-4 text-base leading-relaxed text-neutral-300">
					{site.sprint.promise}
				</p>
				<div class="mt-auto pt-8">
					<a
						href={site.bookingUrl}
						data-umami-event="cta_sprint_book"
						class="bg-coin inline-block rounded-md px-6 py-3 text-base font-medium text-neutral-950 transition-opacity hover:opacity-90"
						rel="noopener noreferrer"
						target="_blank"
					>
						Book the call →
					</a>
				</div>
			</article>
		</div>

		<dl class="mt-12 grid grid-cols-3 gap-6 border-t border-neutral-800 pt-10">
			{#each site.stats as { value, label } (label)}
				<div>
					<dt class="text-coin text-2xl font-bold tracking-tight md:text-4xl">{value}</dt>
					<dd class="mt-1 text-xs tracking-widest text-neutral-500 uppercase">{label}</dd>
				</div>
			{/each}
		</dl>

		<blockquote
			class="mt-12 border-l-2 border-neutral-700 pl-6 text-base leading-relaxed text-neutral-300 italic md:text-lg"
		>
			“{site.testimonial.quote}”
			<footer class="mt-2 text-sm text-neutral-500 not-italic">
				— {site.testimonial.attribution}
			</footer>
		</blockquote>
	</div>
</section>

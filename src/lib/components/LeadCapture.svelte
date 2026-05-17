<script lang="ts">
	import { site } from '$lib/content'
	import type { FormResult } from '$lib/types'

	let { form }: { form: FormResult | null } = $props()

	// Enough copies that the seamless-loop tile covers wide viewports (4K still works).
	const MARQUEE_COPIES = 6
</script>

<section class="snap-section bg-surface relative !justify-between">
	<div class="flex w-full flex-1 items-center px-6 py-16">
		<div class="mx-auto w-full max-w-2xl">
			<p class="eyebrow text-sm">Not ready yet?</p>
			<h2 class="text-fg mt-2 text-3xl font-bold tracking-tight md:text-5xl">
				Heads-up when the next slot opens.
			</h2>
			<p class="text-fg-muted mt-6 text-lg leading-relaxed">
				One client a month. Drop your email and I'll let you know when I'm taking the next one.
			</p>

			<form
				method="post"
				action="?/notify"
				data-enhance-form
				class="mt-10 flex flex-col gap-3 sm:flex-row"
			>
				<label class="sr-only" for="email">Email address</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					autocomplete="email"
					placeholder="you@yourdomain.com"
					class="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-coin focus:ring-coin flex-1 rounded-md border px-4 py-3 text-lg focus:ring-2 focus:outline-none disabled:opacity-60"
				/>
				<input type="hidden" name="name" value="Notify list signup" />
				<input
					type="hidden"
					name="message"
					value="Wants notification when next sprint slot opens."
				/>
				<input type="hidden" name="formStartedAt" value="" data-form-started-at />
				<input type="hidden" name="enhanced" value="" data-form-enhanced />
				<input
					type="text"
					name="company"
					tabindex="-1"
					autocomplete="off"
					class="absolute top-auto left-[-9999px] h-px w-px overflow-hidden"
					aria-hidden="true"
				/>
				<button
					type="submit"
					data-umami-event="cta_notify_submit"
					data-enhance-submit
					class="btn-coin px-6 py-3 text-lg hover:opacity-90 disabled:opacity-60"
				>
					{site.hero.ctaSecondary}
				</button>
			</form>

			<div data-enhance-result aria-live="polite">
				{#if form?.status === 'success'}
					<p class="text-coin mt-4 text-base">{form.message}</p>
				{:else if form?.status === 'error'}
					<p class="text-error mt-4 text-base">{form.message}</p>
				{/if}
			</div>
		</div>
	</div>

	<div
		class="border-border bg-surface w-full overflow-hidden border-t py-6"
		aria-label="Mission marquee"
	>
		<div
			class="marquee-track flex w-max items-center text-lg whitespace-nowrap"
			style="--marquee-copies: {MARQUEE_COPIES}"
		>
			{#each Array(MARQUEE_COPIES), i (i)}
				<div data-marquee-copy class="flex items-center gap-12 pr-12" aria-hidden={i !== 0}>
					<span class="text-fg font-semibold">we just want to build cool shit</span>
					<span class="text-coin">★</span>
					<a
						href={site.gardenUrl}
						data-umami-event={i === 0 ? 'cta_garden_link' : undefined}
						tabindex={i === 0 ? undefined : -1}
						class="text-fg hover:text-coin font-semibold transition-colors"
						rel="noopener noreferrer"
						target="_blank">more at the garden →</a
					>
					<span class="text-coin">★</span>
				</div>
			{/each}
		</div>
	</div>
</section>

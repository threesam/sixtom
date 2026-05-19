<script lang="ts">
	import { site } from '$lib/content'
	import type { FormResult } from '$lib/types'

	let { form }: { form: FormResult | null } = $props()

	const year = new Date().getFullYear()
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
					placeholder="email you actually check"
					class="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent flex-1 rounded-md border px-4 py-3 text-lg focus:ring-2 focus:outline-none disabled:opacity-60"
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
					class="btn-accent px-6 py-3 text-lg hover:opacity-90 disabled:opacity-60"
				>
					{site.hero.ctaSecondary}
				</button>
			</form>

			<div data-enhance-result aria-live="polite">
				{#if form?.status === 'success'}
					<p class="text-accent mt-4 text-base">{form.message}</p>
				{:else if form?.status === 'error'}
					<p class="text-error mt-4 text-base">{form.message}</p>
				{/if}
			</div>
		</div>
	</div>

	<footer class="border-border text-fg-subtle w-full border-t px-6 py-4 text-xs">
		<div
			class="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-2 sm:flex-row"
		>
			<div class="flex items-center gap-4">
				<span>© {year} sixtom</span>
				<a href="/privacy" class="hover:text-fg transition-colors">privacy</a>
				<a href="/terms" class="hover:text-fg transition-colors">terms</a>
			</div>
			<a
				href={site.gardenUrl}
				target="_blank"
				rel="noopener noreferrer"
				data-umami-event="cta_garden_link"
				class="hover:text-coin transition-colors"
			>
				threesam.com →
			</a>
		</div>
	</footer>
</section>

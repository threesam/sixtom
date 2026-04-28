<script lang="ts">
	import { site } from '$lib/content'

	let email = $state('')
	let company = $state('') // honeypot — never display, never submit non-empty
	let formStartedAt = $state(Date.now())
	let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle')
	let message = $state('')

	async function onSubmit(event: SubmitEvent) {
		event.preventDefault()
		if (status === 'submitting') return
		status = 'submitting'
		message = ''

		try {
			const res = await fetch('/api/send-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: 'Notify list signup',
					email: email.trim(),
					message: 'Wants notification when next sprint slot opens.',
					company,
					formStartedAt
				})
			})
			const data = (await res.json()) as { status?: string }
			if (res.ok) {
				status = 'success'
				message = data.status ?? "You're on the list."
				email = ''
			} else {
				status = 'error'
				message = data.status ?? 'Something went wrong. Try again in a moment.'
			}
		} catch {
			status = 'error'
			message = 'Something went wrong. Try again in a moment.'
		}
	}
</script>

<section class="snap-section relative !justify-between bg-neutral-950">
	<div class="flex w-full flex-1 items-center px-6 py-16">
		<div class="mx-auto w-full max-w-2xl">
			<p class="text-coin text-sm tracking-widest uppercase">Not ready yet?</p>
			<h2 class="mt-2 text-3xl font-bold tracking-tight text-neutral-100 md:text-5xl">
				Heads-up when the next slot opens.
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-neutral-400">
				One client a month. Drop your email and I'll let you know when I'm taking the next one.
			</p>

			<form onsubmit={onSubmit} class="mt-10 flex flex-col gap-3 sm:flex-row">
				<label class="sr-only" for="email">Email address</label>
				<input
					id="email"
					type="email"
					required
					autocomplete="email"
					placeholder="you@yourdomain.com"
					bind:value={email}
					disabled={status === 'submitting'}
					class="focus:border-coin focus:ring-coin flex-1 rounded-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg text-neutral-100 placeholder:text-neutral-600 focus:ring-2 focus:outline-none disabled:opacity-60"
				/>
				<!-- honeypot, hidden from humans + assistive tech -->
				<input
					type="text"
					name="company"
					tabindex="-1"
					autocomplete="off"
					bind:value={company}
					class="absolute top-auto left-[-9999px] h-px w-px overflow-hidden"
					aria-hidden="true"
				/>
				<button
					type="submit"
					disabled={status === 'submitting'}
					class="bg-coin rounded-md px-6 py-3 text-lg font-medium text-neutral-950 transition-opacity hover:opacity-90 disabled:opacity-60"
				>
					{status === 'submitting' ? 'Sending…' : site.hero.ctaSecondary}
				</button>
			</form>

			{#if status === 'success'}
				<p class="text-coin mt-4 text-base">{message}</p>
			{:else if status === 'error'}
				<p class="mt-4 text-base text-rose-400">{message}</p>
			{/if}
		</div>
	</div>

	<div
		class="w-full overflow-hidden border-t border-neutral-800 bg-black py-6"
		aria-label="Mission marquee"
	>
		<div class="marquee-track flex w-max items-center gap-12 text-lg whitespace-nowrap">
			<span class="font-semibold text-neutral-100">we just want to build cool shit</span>
			<span class="text-coin" aria-hidden="true">★</span>
			<a
				href={site.gardenUrl}
				class="hover:text-coin font-semibold text-neutral-100 transition-colors"
				rel="noopener noreferrer"
				target="_blank">more at the garden →</a
			>
			<span class="text-coin" aria-hidden="true">★</span>
			<span class="font-semibold text-neutral-100" aria-hidden="true"
				>we just want to build cool shit</span
			>
			<span class="text-coin" aria-hidden="true">★</span>
			<a
				href={site.gardenUrl}
				class="hover:text-coin font-semibold text-neutral-100 transition-colors"
				aria-hidden="true"
				tabindex="-1"
				rel="noopener noreferrer"
				target="_blank">more at the garden →</a
			>
			<span class="text-coin" aria-hidden="true">★</span>
		</div>
	</div>
</section>

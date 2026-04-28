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

<section class="snap-section bg-neutral-950">
	<div class="mx-auto w-full max-w-2xl px-6">
		<p class="text-sm tracking-wider text-neutral-500 uppercase">Not ready yet?</p>
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
				class="flex-1 rounded-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-lg text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none disabled:opacity-60"
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
				class="rounded-md bg-neutral-100 px-6 py-3 text-lg font-medium text-neutral-950 transition-colors hover:bg-white disabled:opacity-60"
			>
				{status === 'submitting' ? 'Sending…' : site.hero.ctaSecondary}
			</button>
		</form>

		{#if status === 'success'}
			<p class="mt-4 text-base text-emerald-400">{message}</p>
		{:else if status === 'error'}
			<p class="mt-4 text-base text-rose-400">{message}</p>
		{/if}
	</div>
</section>

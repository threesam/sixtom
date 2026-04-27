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

<section class="border-t border-neutral-200 bg-neutral-50 py-24">
	<div class="mx-auto max-w-2xl px-6">
		<h2 class="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
			Want a heads-up when the next slot opens?
		</h2>
		<p class="mt-4 text-lg text-neutral-600">
			One client a month. If you're not ready to book today, drop your email and I'll let you know
			when I'm taking the next one.
		</p>

		<form onsubmit={onSubmit} class="mt-8 flex flex-col gap-3 sm:flex-row">
			<label class="sr-only" for="email">Email address</label>
			<input
				id="email"
				type="email"
				required
				autocomplete="email"
				placeholder="you@yourdomain.com"
				bind:value={email}
				disabled={status === 'submitting'}
				class="flex-1 rounded-md border border-neutral-300 px-4 py-3 text-lg focus:ring-2 focus:ring-neutral-900 focus:outline-none disabled:opacity-60"
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
				class="rounded-md bg-neutral-900 px-6 py-3 text-lg text-white transition-colors hover:bg-neutral-700 disabled:opacity-60"
			>
				{status === 'submitting' ? 'Sending…' : site.hero.ctaSecondary}
			</button>
		</form>

		{#if status === 'success'}
			<p class="mt-4 text-base text-emerald-700">{message}</p>
		{:else if status === 'error'}
			<p class="mt-4 text-base text-red-700">{message}</p>
		{/if}
	</div>
</section>

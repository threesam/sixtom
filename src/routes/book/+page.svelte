<script lang="ts">
	import { enhance } from '$app/forms'
	import { site } from '$lib/content'
	import type { ActionData } from './$types'
	import { STAGE_OPTIONS, BUDGET_OPTIONS, AUTHORITY_OPTIONS } from './options'

	let { form }: { form: ActionData } = $props()

	let formStartedAt = $state('')
	let enhanced = $state('')
	let submitting = $state(false)
	$effect(() => {
		formStartedAt = String(Date.now())
		enhanced = '1'
	})

	const inputClass =
		'border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent w-full rounded-md border px-4 py-3 text-base focus:ring-2 focus:outline-none disabled:opacity-60'
	const labelClass = 'block text-fg text-sm'
	const hintClass = 'text-fg-subtle mt-1 text-xs'
</script>

<svelte:head>
	<title>book — sixtom</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta
		name="description"
		content="qualify for an audit or sprint with sixtom. a few questions, then the booking link."
	/>
	<link rel="canonical" href={`${site.siteUrl}/book`} />
</svelte:head>

<div class="bg-surface min-h-screen">
	<div class="mx-auto w-full max-w-2xl px-6 py-20">
		<header class="mb-12">
			<a
				href="/"
				class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
				data-umami-event="book_back_home"
			>
				← sixtom
			</a>
			<p class="eyebrow mt-12 text-sm">step 0 — qualify</p>
			<h1 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-5xl">
				let's see if we're a fit.
			</h1>
			<p class="text-fg-muted mt-6 text-lg leading-relaxed">
				a few questions, takes 60 seconds. if it's a match, you get the booking link with your
				answers pre-filled on the call form.
			</p>
		</header>

		{#if form?.status === 'success'}
			{#if form.disqualified}
				<div class="border-border rounded-lg border p-8">
					<p class="eyebrow text-sm">not a fit, yet</p>
					<p class="text-fg mt-4 text-lg leading-relaxed">{form.message}</p>
					<a
						href="/book"
						data-sveltekit-reload
						data-umami-event="book_disqualified_restart"
						class="text-fg-subtle hover:text-coin mt-6 inline-block text-xs tracking-widest uppercase transition-colors"
					>
						start over →
					</a>
				</div>
			{:else}
				<div class="border-border-strong ring-border rounded-lg border p-8 ring-1">
					<p class="eyebrow text-sm">qualified</p>
					<p class="text-fg mt-4 text-lg leading-relaxed">{form.message}</p>
					{#if form.bookingUrl}
						<a
							href={form.bookingUrl}
							data-umami-event="book_qualified_booking_click"
							rel="noopener noreferrer"
							target="_blank"
							class="btn-accent mt-8 inline-block px-6 py-3 text-base hover:opacity-90"
						>
							book the call →
						</a>
					{/if}
				</div>
			{/if}
		{:else}
			<form
				method="post"
				use:enhance={() => {
					submitting = true
					return async ({ update }) => {
						await update()
						submitting = false
					}
				}}
				class="space-y-8"
			>
				<div>
					<label for="name" class={labelClass}>your name</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						maxlength="120"
						autocomplete="name"
						class="{inputClass} mt-2"
					/>
				</div>

				<div>
					<label for="email" class={labelClass}>work email</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						maxlength="254"
						autocomplete="email"
						class="{inputClass} mt-2"
					/>
					<p class={hintClass}>personal Gmail counts; just expect a slower reply.</p>
				</div>

				<div>
					<label for="company_url" class={labelClass}>company URL</label>
					<input
						id="company_url"
						name="company_url"
						type="url"
						required
						maxlength="500"
						placeholder="https://"
						autocomplete="url"
						class="{inputClass} mt-2"
					/>
				</div>

				<div>
					<label for="built" class={labelClass}>what have you built? drop a link</label>
					<input
						id="built"
						name="built"
						type="text"
						required
						maxlength="500"
						placeholder="live URL, repo, Loom, or screenshot link"
						class="{inputClass} mt-2"
					/>
				</div>

				<div>
					<label for="stage" class={labelClass}>where are you?</label>
					<select id="stage" name="stage" required class="{inputClass} mt-2">
						<option value="">—</option>
						{#each STAGE_OPTIONS as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="deliverable" class={labelClass}>
						what has to be true in 30 days for this to be worth your money?
					</label>
					<textarea
						id="deliverable"
						name="deliverable"
						required
						rows="4"
						maxlength="4000"
						placeholder="scale to X users, pass SOC2 review, stop the 3am pages…"
						class="{inputClass} mt-2"
					></textarea>
				</div>

				<div>
					<label for="budget" class={labelClass}>budget set aside for fixing this</label>
					<select id="budget" name="budget" required class="{inputClass} mt-2">
						<option value="">—</option>
						{#each BUDGET_OPTIONS as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="authority" class={labelClass}>are you the one who signs off?</label>
					<select id="authority" name="authority" required class="{inputClass} mt-2">
						<option value="">—</option>
						{#each AUTHORITY_OPTIONS as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<input type="hidden" name="message" value="" />
				<input type="hidden" name="formStartedAt" bind:value={formStartedAt} />
				<input type="hidden" name="enhanced" bind:value={enhanced} />
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
					data-umami-event="book_submit"
					disabled={submitting}
					class="btn-accent w-full px-6 py-3 text-base hover:opacity-90 disabled:opacity-60"
				>
					{submitting ? 'sending…' : 'send it →'}
				</button>

				<div role="alert" aria-live="polite">
					{#if form?.status === 'error'}
						<p class="text-error text-sm">{form.message}</p>
					{/if}
				</div>
			</form>
		{/if}
	</div>
</div>

<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'
	import { STAGE_OPTIONS, BUDGET_OPTIONS, DISQUALIFY_STAGE } from './options'

	let { form }: { form: ActionData } = $props()

	const TOTAL_STEPS = 3
	let step = $state(1)

	let stage = $state('')
	let built = $state('')
	let deliverable = $state('')
	let budget = $state('')

	let formStartedAt = $state('')
	let enhanced = $state('')
	let submitting = $state(false)
	$effect(() => {
		formStartedAt = String(Date.now())
		enhanced = '1'
	})

	const isPreBuild = $derived(stage === DISQUALIFY_STAGE)

	function canAdvance(): boolean {
		if (step === 1) return stage !== '' && !isPreBuild
		if (step === 2) return built.trim() !== '' && deliverable.trim() !== '' && budget !== ''
		return true
	}

	function next() {
		if (!canAdvance()) return
		step += 1
	}

	function back() {
		if (step > 1) step -= 1
	}

	const budgetQuestion = 'how much have you set aside?'

	const inputClass =
		'border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent w-full rounded-md border px-4 py-3 text-base focus:ring-2 focus:outline-none disabled:opacity-60'
	const labelClass = 'sr-only'
	const hintClass = 'text-fg-subtle mt-1 text-xs'
	const stepEyebrowClass = 'eyebrow text-fg-subtle text-xs'
	const stepHeadClass = 'text-fg mt-2 text-2xl font-semibold tracking-tight md:text-3xl'
</script>

<svelte:head>
	<title>book | SIXTOM</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta
		name="description"
		content="qualify for an audit or sprint with sixtom. 3 quick steps, then the booking link."
	/>
</svelte:head>

<div class="bg-surface min-h-screen">
	<div class="mx-auto w-full max-w-xl px-6 py-20">
		<header class="mb-12">
			<a
				href="/"
				class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
				data-umami-event="book_back_home"
			>
				sixtom
			</a>
			<h1 class="text-fg mt-12 text-4xl font-bold tracking-tight md:text-5xl">
				let's see if we're a fit.
			</h1>
			<p class="text-fg-muted mt-6 text-base leading-relaxed">
				3 quick steps. ~60 seconds. you'll get the booking link with your context pre-filled.
			</p>
		</header>

		{#if form?.status === 'success'}
			{#if form.disqualified}
				<div class="border-border rounded-lg border p-8">
					<p class="eyebrow text-sm">not yet</p>
					<p class="text-fg mt-4 text-lg leading-relaxed">{form.message}</p>
					<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-6">
						<a
							href="/notify"
							data-umami-event="book_disqualified_notify"
							class="text-fg-subtle hover:text-coin text-xs tracking-widest uppercase transition-colors"
						>
							get notified when ready
						</a>
						<a
							href="/book"
							data-sveltekit-reload
							data-umami-event="book_disqualified_restart"
							class="text-fg-subtle hover:text-coin text-xs tracking-widest uppercase transition-colors"
						>
							start over
						</a>
					</div>
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
							book the call
						</a>
					{/if}
				</div>
			{/if}
		{:else if step === 1 && isPreBuild}
			<!-- Pre-build disqualify is purely client-side: no email captured, no server hit. -->
			<div class="border-border rounded-lg border p-8">
				<p class="eyebrow text-sm">not yet</p>
				<p class="text-fg mt-4 text-lg leading-relaxed">
					sixtom is for things you've already built. come back when you have a working demo — i'll
					be here.
				</p>
				<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-6">
					<a
						href="/notify"
						data-umami-event="book_pre_build_notify"
						class="text-fg-subtle hover:text-coin text-xs tracking-widest uppercase transition-colors"
					>
						get notified when ready
					</a>
					<button
						type="button"
						onclick={() => (stage = '')}
						data-umami-event="book_pre_build_restart"
						class="text-fg-subtle hover:text-coin text-left text-xs tracking-widest uppercase transition-colors"
					>
						i picked the wrong one
					</button>
				</div>
			</div>
		{:else}
			<form
				method="post"
				novalidate
				use:enhance={() => {
					submitting = true
					return async ({ update }) => {
						await update()
						submitting = false
					}
				}}
			>
				<div class:hidden={step !== 1}>
					<p class={stepEyebrowClass}>step 1 of {TOTAL_STEPS} — fit</p>
					<h2 class={stepHeadClass}>where are you with this thing?</h2>
					<fieldset class="mt-8 space-y-3">
						<legend class="sr-only">stage</legend>
						{#each STAGE_OPTIONS as opt (opt.value)}
							<label
								class="border-border bg-surface hover:border-fg-subtle flex cursor-pointer items-center gap-3 rounded-full border px-6 py-4 transition-colors {stage ===
								opt.value
									? 'border-accent ring-accent ring-1'
									: ''}"
							>
								<input
									type="radio"
									name="stage"
									value={opt.value}
									bind:group={stage}
									required
									class="accent-accent"
								/>
								<span class="text-fg text-base">{opt.label}</span>
							</label>
						{/each}
					</fieldset>
				</div>

				<div class:hidden={step !== 2} class="space-y-8">
					<div>
						<p class={stepEyebrowClass}>step 2 of {TOTAL_STEPS} — the work</p>
						<h2 class={stepHeadClass}>what does done look like?</h2>
					</div>
					<div>
						<label for="built" class={labelClass}>where can I see what you've made?</label>
						<input
							id="built"
							name="built"
							type="text"
							required
							maxlength="500"
							bind:value={built}
							placeholder="where can I see it? paste a link"
							class="{inputClass} mt-2"
						/>
					</div>
					<div>
						<label for="deliverable" class={labelClass}>
							what would make this worth it for you?
						</label>
						<textarea
							id="deliverable"
							name="deliverable"
							required
							rows="4"
							maxlength="4000"
							bind:value={deliverable}
							placeholder="in 30 days, what has to be true for this to feel worth it?"
							class="{inputClass} mt-2"
						></textarea>
					</div>
					<div>
						<label for="budget" class={labelClass}>{budgetQuestion}</label>
						<select
							id="budget"
							name="budget"
							required
							bind:value={budget}
							class="{inputClass} mt-2"
						>
							<option value="" disabled>{budgetQuestion}</option>
							{#each BUDGET_OPTIONS as opt (opt.value)}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class:hidden={step !== 3} class="space-y-8">
					<div>
						<p class={stepEyebrowClass}>step 3 of {TOTAL_STEPS} — last bit</p>
						<h2 class={stepHeadClass}>how do i reach you?</h2>
						<p class="text-fg-muted mt-3 text-sm leading-relaxed">
							goes straight to my phone. i reply within a business day.
						</p>
					</div>
					<div>
						<label for="name" class={labelClass}>what's your name?</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							maxlength="120"
							autocomplete="name"
							placeholder="your name"
							class="{inputClass} mt-2"
						/>
					</div>
					<div>
						<label for="email" class={labelClass}>what's the best email to reach you?</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							maxlength="254"
							autocomplete="email"
							placeholder="the best email to reach you"
							class="{inputClass} mt-2"
						/>
						<p class={hintClass}>a personal email's fine — just expect a slower reply.</p>
					</div>
					<div>
						<label for="company_url" class={labelClass}>what's your company's website?</label>
						<input
							id="company_url"
							name="company_url"
							type="url"
							required
							maxlength="500"
							placeholder="your company's website (https://…)"
							autocomplete="url"
							class="{inputClass} mt-2"
						/>
					</div>
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

				<div class="mt-10 flex items-center gap-4">
					{#if step > 1}
						<button
							type="button"
							onclick={back}
							data-umami-event="book_step_back"
							class="text-fg-subtle hover:text-fg text-sm tracking-widest uppercase transition-colors"
						>
							← back
						</button>
					{/if}
					{#if step < TOTAL_STEPS}
						<button
							type="button"
							onclick={next}
							disabled={!canAdvance()}
							data-umami-event="book_step_next"
							class="btn-accent ml-auto px-6 py-3 text-base hover:opacity-90 disabled:opacity-60"
						>
							next →
						</button>
					{:else}
						<button
							type="submit"
							data-umami-event="book_submit"
							disabled={submitting}
							class="btn-accent ml-auto px-6 py-3 text-base hover:opacity-90 disabled:opacity-60"
						>
							{submitting ? 'sending…' : 'send it →'}
						</button>
					{/if}
				</div>

				<div role="alert" aria-live="polite" class="mt-4">
					{#if form?.status === 'error'}
						<p class="text-error text-sm">{form.message}</p>
					{/if}
				</div>
			</form>
		{/if}
	</div>
</div>

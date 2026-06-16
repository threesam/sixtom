<script lang="ts">
	type Goal = 'stop' | '10x' | '100x' | 'enterprise'

	const SLOWDOWN: Record<Goal, number> = {
		stop: 1.5,
		'10x': 2,
		'100x': 5,
		enterprise: 3
	}
	const WEEKS_UNTIL_BLOCKED: Record<Goal, number> = {
		stop: 4,
		'10x': 12,
		'100x': 6,
		enterprise: 8
	}
	const GOAL_OPTIONS: { value: Goal; label: string }[] = [
		{ value: 'stop', label: 'just stop breaking' },
		{ value: '10x', label: '10× the users' },
		{ value: '100x', label: '100× the users' },
		{ value: 'enterprise', label: 'enterprise-ready (SOC2 / SSO)' }
	]

	let mau = $state<number | null>(1000)
	let goal = $state<Goal>('stop')
	let firefightingHours = $state<number | null>(10)
	let hourlyCost = $state<number | null>(150)

	// Clamp non-negative; cleared <input type="number"> binds to null in Svelte 5.
	const safeHours = $derived(Math.max(0, firefightingHours ?? 0))
	const safeCost = $derived(Math.max(0, hourlyCost ?? 0))
	const slowdown = $derived(SLOWDOWN[goal])
	const weeksUntilBlocked = $derived(WEEKS_UNTIL_BLOCKED[goal])
	const hoursPerYear = $derived(safeHours * 52)
	const annualTax = $derived(Math.round(hoursPerYear * safeCost * slowdown))

	const usd = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	})

	// Shared with the /book form for a consistent look.
	const inputClass =
		'border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent w-full rounded-md border px-4 py-3 text-base focus:ring-2 focus:outline-none disabled:opacity-60'
	// Pre-filled fields can't rely on placeholders (a value hides them), so the
	// question stays visible — plain, matching the book form's tone.
	const labelClass = 'text-fg-muted mb-2 block text-sm'
	const radioCardClass =
		'border-border bg-surface hover:border-fg-subtle flex cursor-pointer items-center gap-3 rounded-full border px-6 py-4 transition-colors'
</script>

<section class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-3xl px-6 py-16 md:py-20">
		<p class="eyebrow text-sm">your vibe-code tax</p>
		<h1 class="text-fg mt-2 text-3xl font-bold tracking-tight md:text-5xl">
			what's it costing you?
		</h1>
		<p class="text-fg-muted mt-4 text-base leading-relaxed">
			4 questions. instant number. no email.
		</p>

		<div class="mt-10 space-y-6">
			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<label for="vt-mau" class={labelClass}>monthly active users today</label>
					<input
						id="vt-mau"
						type="number"
						min="0"
						step="100"
						bind:value={mau}
						placeholder="e.g. 1,000"
						class={inputClass}
					/>
				</div>

				<div>
					<label for="vt-cost" class={labelClass}>your hourly rate (yours, or your team's)</label>
					<input
						id="vt-cost"
						type="number"
						min="0"
						step="25"
						bind:value={hourlyCost}
						placeholder="e.g. 150"
						class={inputClass}
					/>
				</div>
			</div>

			<div>
				<label for="vt-hours" class={labelClass}>
					hours/week firefighting instead of building new things
				</label>
				<input
					id="vt-hours"
					type="range"
					min="0"
					max="40"
					step="1"
					bind:value={firefightingHours}
					aria-describedby="vt-hours-readout"
					class="accent-accent w-full"
				/>
				<p id="vt-hours-readout" class="text-fg-subtle mt-1 text-xs tabular-nums">
					{safeHours} h/week
				</p>
			</div>

			<fieldset class="space-y-3">
				<legend class={labelClass}>where do you want to be in 90 days?</legend>
				{#each GOAL_OPTIONS as opt (opt.value)}
					<label
						class="{radioCardClass} {goal === opt.value ? 'border-accent ring-accent ring-1' : ''}"
					>
						<input
							type="radio"
							name="goal"
							value={opt.value}
							bind:group={goal}
							class="accent-accent"
						/>
						<span class="text-fg text-base">{opt.label}</span>
					</label>
				{/each}
			</fieldset>
		</div>

		<div class="border-border mt-12 border-t pt-10">
			<p class="eyebrow text-xs">annual vibe-code tax</p>
			<p
				class="text-fg mt-3 text-5xl font-bold tracking-tight tabular-nums md:text-7xl"
				aria-live="polite"
			>
				{usd.format(annualTax)}
			</p>
			<ul class="text-fg-muted mt-6 space-y-2 text-base leading-relaxed">
				<li>
					<span class="text-fg font-semibold tabular-nums">{hoursPerYear.toLocaleString()}</span>
					hours/year lost to firefighting
				</li>
				<li>
					<span class="text-fg font-semibold tabular-nums">{slowdown}×</span>
					slower than it should be
				</li>
				<li>
					<span class="text-fg font-semibold tabular-nums">{weeksUntilBlocked}</span>
					weeks until you'd have to start over
				</li>
			</ul>

			<a
				href="/book"
				data-umami-event="cta_calc_book"
				class="btn-accent mt-10 w-full px-8 py-4 text-center text-xl font-bold md:w-auto md:px-12 md:py-5 md:text-2xl"
			>
				see if a sprint can fix this
			</a>
		</div>
	</div>
</section>

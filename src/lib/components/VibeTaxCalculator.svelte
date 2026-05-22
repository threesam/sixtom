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

	const inputClass =
		'border-border bg-surface text-fg focus:border-accent focus:ring-accent w-full rounded-md border px-4 py-3 text-base focus:ring-2 focus:outline-none'
	const labelClass = 'text-fg-muted block text-xs tracking-widest uppercase'
</script>

<section class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-3xl px-6 py-16 md:py-20">
		<p class="eyebrow text-sm">your vibe-code tax</p>
		<h2 class="text-fg mt-2 text-3xl font-bold tracking-tight md:text-5xl">
			what's it costing you?
		</h2>
		<p class="text-fg-muted mt-4 text-base leading-relaxed">
			4 questions. instant number. no email.
		</p>

		<div class="mt-10 grid gap-6 md:grid-cols-2">
			<div>
				<label for="vt-mau" class={labelClass}>monthly active users today</label>
				<input
					id="vt-mau"
					type="number"
					min="0"
					step="100"
					bind:value={mau}
					class="{inputClass} mt-2"
				/>
			</div>

			<div>
				<label for="vt-goal" class={labelClass}>where do you want to be in 90 days?</label>
				<select id="vt-goal" bind:value={goal} class="{inputClass} mt-2">
					{#each GOAL_OPTIONS as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
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
					class="mt-2 w-full accent-current"
					style="color: var(--color-accent);"
				/>
				<p id="vt-hours-readout" class="text-fg-subtle mt-1 text-xs tabular-nums">
					{safeHours} h/week
				</p>
			</div>

			<div>
				<label for="vt-cost" class={labelClass}>your hourly rate (yours, or your team's)</label>
				<input
					id="vt-cost"
					type="number"
					min="0"
					step="25"
					bind:value={hourlyCost}
					class="{inputClass} mt-2"
				/>
			</div>
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
				class="btn-accent mt-10 inline-block px-6 py-3 text-base hover:opacity-90"
			>
				see if a sprint can fix this →
			</a>
		</div>
	</div>
</section>

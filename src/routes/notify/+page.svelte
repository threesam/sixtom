<script lang="ts">
	import { enhance } from '$app/forms'
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import TeardownReward from '$lib/components/TeardownReward.svelte'
	import { grandSlam } from '$lib/content'
	import type { ActionData } from './$types'

	let { form }: { form: ActionData } = $props()

	const close = grandSlam.close

	let formStartedAt = $state('')
	let enhanced = $state('')
	let submitting = $state(false)
	$effect(() => {
		formStartedAt = String(Date.now())
		enhanced = '1'
	})
</script>

<svelte:head>
	<title>waitlist | SIXTOM</title>
	<meta
		name="description"
		content="one client a month. join the waitlist — or start with a paid teardown and move now."
	/>
</svelte:head>

<div class="bg-surface flex min-h-screen flex-col">
	<div class="mx-auto w-full max-w-2xl px-6 pt-12">
		<a
			href="/"
			class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
			data-umami-event="notify_back_home"
		>
			sixtom
		</a>
	</div>

	<section class="flex flex-1 items-center px-6 py-16">
		<div class="mx-auto w-full max-w-2xl">
			<p class="eyebrow text-sm">{close.scarcity}</p>
			<h1 class="text-fg mt-2 text-3xl font-bold tracking-tight md:text-5xl">{close.heading}</h1>
			<TeardownReward class="text-fg-muted mt-6 text-lg leading-relaxed" />

			<form
				method="post"
				action="?/notify"
				use:enhance={() => {
					submitting = true
					return async ({ update }) => {
						await update()
						submitting = false
					}
				}}
				class="mt-10 space-y-4"
			>
				<label class="sr-only" for="email">email address</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					autocomplete="email"
					placeholder={close.emailPlaceholder}
					class="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent w-full rounded-md border px-4 py-3 text-lg focus:ring-2 focus:outline-none disabled:opacity-60"
				/>
				<label class="text-fg-muted block text-sm" for="build">
					{close.buildLabel}
					<textarea
						id="build"
						name="message"
						required
						rows="3"
						maxlength="4000"
						placeholder={close.buildPlaceholder}
						class="border-border bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent mt-2 w-full rounded-md border px-4 py-3 text-base focus:ring-2 focus:outline-none disabled:opacity-60"
					></textarea>
				</label>
				<input type="hidden" name="name" value="Waitlist signup" />
				<input type="hidden" name="formStartedAt" bind:value={formStartedAt} />
				<input type="hidden" name="enhanced" bind:value={enhanced} />
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
					disabled={submitting}
					class="btn-accent px-6 py-3 text-lg hover:opacity-90 disabled:opacity-60"
				>
					{submitting ? 'sending…' : close.button}
				</button>
			</form>

			<div aria-live="polite">
				{#if form?.status === 'success'}
					<p class="text-accent mt-4 text-base">{form.message}</p>
				{:else if form?.status === 'error'}
					<p class="text-error mt-4 text-base">{form.message}</p>
				{/if}
			</div>
		</div>
	</section>

	<SiteFooter />
</div>

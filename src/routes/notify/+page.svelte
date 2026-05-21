<script lang="ts">
	import { enhance } from '$app/forms'
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import { site } from '$lib/content'
	import type { ActionData } from './$types'

	let { form }: { form: ActionData } = $props()

	let formStartedAt = $state('')
	let enhanced = $state('')
	let submitting = $state(false)
	$effect(() => {
		formStartedAt = String(Date.now())
		enhanced = '1'
	})
</script>

<svelte:head>
	<title>notify — sixtom</title>
	<meta
		name="description"
		content="one client a month. drop your email to hear when the next sprint slot opens."
	/>
	<link rel="canonical" href={`${site.siteUrl}/notify`} />
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="bg-surface flex min-h-screen flex-col">
	<div class="mx-auto w-full max-w-2xl px-6 pt-12">
		<a
			href="/"
			class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
			data-umami-event="notify_back_home"
		>
			← sixtom
		</a>
	</div>

	<section class="flex flex-1 items-center px-6 py-16">
		<div class="mx-auto w-full max-w-2xl">
			<p class="eyebrow text-sm">not ready yet?</p>
			<h1 class="text-fg mt-2 text-3xl font-bold tracking-tight md:text-5xl">
				heads-up when the next slot opens.
			</h1>
			<p class="text-fg-muted mt-6 text-lg leading-relaxed">
				one client a month. drop your email and i'll let you know when i'm taking the next one.
			</p>

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
				class="mt-10 flex flex-col gap-3 sm:flex-row"
			>
				<label class="sr-only" for="email">email address</label>
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
					{submitting ? 'sending…' : 'notify me →'}
				</button>
			</form>

			<div role="alert" aria-live="polite">
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

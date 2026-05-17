<script lang="ts">
	import Hero from '$lib/components/Hero.svelte'
	import OfferSection from '$lib/components/OfferSection.svelte'
	import LeadCapture from '$lib/components/LeadCapture.svelte'
	import { site } from '$lib/content'
	import type { FormResult } from '$lib/types'

	let { form }: { form: FormResult | null } = $props()
</script>

<Hero />

<section class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-4xl px-6">
		<p class="eyebrow text-sm">— the thesis</p>
		<p
			class="text-fg mt-4 text-3xl leading-tight font-semibold tracking-tight italic md:text-5xl lg:text-6xl"
		>
			{site.thesis}
		</p>
		<p class="text-fg-muted mt-12 max-w-2xl text-lg leading-relaxed md:text-xl">
			{site.thesisBody}
		</p>
	</div>
</section>

<OfferSection />
<LeadCapture {form} />

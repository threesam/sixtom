<script lang="ts">
	import Hero from '$lib/components/Hero.svelte'
	import OfferSection from '$lib/components/OfferSection.svelte'
	import LeadCapture from '$lib/components/LeadCapture.svelte'
	import { site } from '$lib/content'

	interface FormResult {
		status: 'success' | 'error'
		message: string
	}

	let { form }: { form: FormResult | null } = $props()
</script>

<Hero />

<section class="snap-section bg-neutral-950">
	<div class="mx-auto w-full max-w-4xl px-6">
		<p class="text-coin text-sm tracking-widest uppercase">— the thesis</p>
		<p
			class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-neutral-100 italic md:text-5xl lg:text-6xl"
		>
			{site.thesis}
		</p>
		<p class="mt-12 max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">
			{site.thesisBody}
		</p>
	</div>
</section>

<OfferSection />
<LeadCapture {form} />

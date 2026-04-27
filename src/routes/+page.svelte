<script lang="ts">
	import Hero from '$lib/components/Hero.svelte'
	import Corollaries from '$lib/components/Corollaries.svelte'
	import SprintSection from '$lib/components/SprintSection.svelte'
	import ProofSlot from '$lib/components/ProofSlot.svelte'
	import LeadCapture from '$lib/components/LeadCapture.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import { site } from '$lib/content'
</script>

<Hero />

<section class="border-t border-neutral-200 py-6">
	<div class="mx-auto max-w-3xl px-6">
		<p class="text-base text-neutral-600">{site.operator.credentialsChip}</p>
	</div>
</section>

<section class="border-t border-neutral-200 py-24">
	<div class="mx-auto max-w-3xl px-6">
		<p
			class="text-3xl leading-snug font-semibold tracking-tight text-neutral-900 italic md:text-4xl"
		>
			{site.thesis}
		</p>
	</div>
</section>

<Corollaries />
<SprintSection />
<ProofSlot />
<LeadCapture />
<Footer />

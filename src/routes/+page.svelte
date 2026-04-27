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

<section class="py-6 border-t border-neutral-200">
	<div class="max-w-3xl mx-auto px-6">
		<p class="text-base text-neutral-600">{site.operator.credentialsChip}</p>
	</div>
</section>

<section class="py-24 border-t border-neutral-200">
	<div class="max-w-3xl mx-auto px-6">
		<p class="text-3xl md:text-4xl font-semibold tracking-tight italic text-neutral-900 leading-snug">
			{site.thesis}
		</p>
	</div>
</section>

<Corollaries />
<SprintSection />
<ProofSlot />
<LeadCapture />
<Footer />

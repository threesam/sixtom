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

<section class="snap-section bg-neutral-950">
	<div class="mx-auto w-full max-w-4xl px-6">
		<p
			class="text-3xl leading-tight font-semibold tracking-tight text-neutral-100 italic md:text-5xl lg:text-6xl"
		>
			{site.thesis}
		</p>
		<p class="mt-6 text-sm tracking-wider text-neutral-500 uppercase">— the thesis</p>
	</div>
</section>

<Corollaries />
<SprintSection />
<ProofSlot />
<LeadCapture />
<Footer />

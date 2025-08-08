<script lang="ts">
	import type { CaseStudy } from '$lib/types/case-study'
	import CaseStudyHero from '$lib/components/CaseStudyHero.svelte'
	import RichContent from '$lib/components/RichContent.svelte'
	let { data } = $props()
	let study = $derived(data.study as CaseStudy | null)
</script>

{#if study}
	<CaseStudyHero {study} />
	<section class="bg-gray-900 py-16 text-white">
		<div class="container mx-auto grid gap-12 px-4 md:grid-cols-3">
			<div class="md:col-span-2 space-y-12">
				{#if study.problem}
					<article>
						<h2 class="mb-4 text-2xl font-bold">Problem</h2>
						<RichContent value={study.problem} />
					</article>
				{/if}
				{#if study.solution}
					<article>
						<h2 class="mb-4 text-2xl font-bold">Solution</h2>
						<RichContent value={study.solution} />
					</article>
				{/if}
				{#if study.results}
					<article>
						<h2 class="mb-4 text-2xl font-bold">Results</h2>
						<RichContent value={study.results} />
					</article>
				{/if}
			</div>
			<aside class="space-y-4 rounded-lg bg-black/40 p-4">
				<h3 class="text-lg font-semibold">Considering similar results?</h3>
				<p class="text-gray-300">Download our checklist and schedule a free discovery call.</p>
				<a href="/assets/checklist.pdf" class="block rounded bg-white px-4 py-2 text-center font-semibold text-black">Download checklist</a>
				<a href="/contact" class="block rounded border border-white px-4 py-2 text-center font-semibold text-white">Book a call</a>
			</aside>
		</div>
	</section>
{:else}
	<section class="container mx-auto px-4 py-16">
		<p>Case study not found.</p>
	</section>
{/if}
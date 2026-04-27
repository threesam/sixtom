<script lang="ts">
	import { sprintQA, site } from '$lib/content'

	function isList(answer: string): boolean {
		return answer.includes('\n')
	}

	function lines(answer: string): string[] {
		return answer.split('\n').filter((l) => l.trim().length > 0)
	}
</script>

<section id="sprint" class="py-24 border-t border-neutral-200 bg-neutral-50">
	<div class="max-w-3xl mx-auto px-6">
		<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
			The {site.offer.name}
		</h2>
		<p class="mt-4 text-lg text-neutral-600">{site.offer.promise}</p>

		<dl class="mt-16 space-y-12">
			{#each sprintQA as { question, answer }}
				<div>
					<dt class="text-2xl font-semibold text-neutral-900">{question}</dt>
					<dd class="mt-3 text-lg leading-relaxed text-neutral-700">
						{#if isList(answer)}
							<ul class="list-disc list-outside pl-6 space-y-2">
								{#each lines(answer) as line}
									<li>{line}</li>
								{/each}
							</ul>
						{:else}
							{answer}
						{/if}
					</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

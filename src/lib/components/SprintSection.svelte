<script lang="ts">
	import { sprintQA, site } from '$lib/content'

	function isList(answer: string): boolean {
		return answer.includes('\n')
	}

	function lines(answer: string): string[] {
		return answer.split('\n').filter((l) => l.trim().length > 0)
	}
</script>

<section id="sprint" class="border-t border-neutral-200 bg-neutral-50 py-24">
	<div class="mx-auto max-w-3xl px-6">
		<h2 class="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
			The {site.offer.name}
		</h2>
		<p class="mt-4 text-lg text-neutral-600">{site.offer.promise}</p>

		<dl class="mt-16 space-y-12">
			{#each sprintQA as { question, answer } (question)}
				<div>
					<dt class="text-2xl font-semibold text-neutral-900">{question}</dt>
					<dd class="mt-3 text-lg leading-relaxed text-neutral-700">
						{#if isList(answer)}
							<ul class="list-outside list-disc space-y-2 pl-6">
								{#each lines(answer) as line (line)}
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

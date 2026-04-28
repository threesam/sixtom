<script lang="ts">
	import { sprintQA, site } from '$lib/content'

	function isList(answer: string): boolean {
		return answer.includes('\n')
	}

	function lines(answer: string): string[] {
		return answer.split('\n').filter((l) => l.trim().length > 0)
	}
</script>

<section id="sprint" class="snap-section bg-neutral-950">
	<div class="mx-auto w-full max-w-3xl px-6">
		<p class="text-sm tracking-wider text-neutral-500 uppercase">The offer</p>
		<h2 class="mt-2 text-3xl font-bold tracking-tight text-neutral-100 md:text-5xl">
			The {site.offer.name}.
		</h2>
		<p class="mt-6 text-lg leading-relaxed text-neutral-400 md:text-xl">{site.offer.promise}</p>

		<div class="mt-12 divide-y divide-neutral-800 border-y border-neutral-800">
			{#each sprintQA as { question, answer } (question)}
				<details class="group">
					<summary
						class="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold text-neutral-100 transition-colors group-open:text-emerald-400 md:text-xl"
					>
						<span>{question}</span>
						<span
							class="text-2xl text-neutral-500 transition-transform group-open:rotate-45 group-open:text-emerald-400"
							aria-hidden="true">+</span
						>
					</summary>
					<div class="pb-6 text-base leading-relaxed text-neutral-400 md:text-lg">
						{#if isList(answer)}
							<ul class="list-outside list-disc space-y-2 pl-6">
								{#each lines(answer) as line (line)}
									<li>{line}</li>
								{/each}
							</ul>
						{:else}
							<p>{answer}</p>
						{/if}
					</div>
				</details>
			{/each}
		</div>
	</div>
</section>

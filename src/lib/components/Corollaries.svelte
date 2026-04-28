<script lang="ts">
	import { corollaries } from '$lib/content'
</script>

<section class="snap-section bg-neutral-900">
	<div class="mx-auto w-full max-w-3xl px-6">
		<h2 class="mb-12 text-3xl font-bold tracking-tight text-neutral-100 md:text-5xl">
			Quick answers.
		</h2>
		<div class="divide-y divide-neutral-800 border-y border-neutral-800">
			{#each corollaries as { question, answer } (question)}
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
					<p class="pb-6 text-base leading-relaxed text-neutral-400 md:text-lg">
						{answer}
					</p>
				</details>
			{/each}
		</div>
	</div>
</section>

<script lang="ts">
	import { corollaries } from '$lib/content'
</script>

<section class="border-t border-neutral-200 py-24">
	<div class="mx-auto max-w-5xl px-6">
		<dl class="grid grid-cols-1 gap-12 md:grid-cols-2">
			{#each corollaries as { question, answer } (question)}
				<div>
					<dt class="text-2xl font-semibold text-neutral-900 md:text-3xl">
						{question}
					</dt>
					<dd class="mt-4 text-lg leading-relaxed text-neutral-700">
						{answer}
					</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

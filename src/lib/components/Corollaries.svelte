<script lang="ts">
	import { corollaries } from '$lib/content'
</script>

<section class="py-24 border-t border-neutral-200">
	<div class="max-w-5xl mx-auto px-6">
		<dl class="grid grid-cols-1 md:grid-cols-2 gap-12">
			{#each corollaries as { question, answer }}
				<div>
					<dt class="text-2xl md:text-3xl font-semibold text-neutral-900">
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

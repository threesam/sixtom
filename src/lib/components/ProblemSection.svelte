<script>
	import { problem } from '$lib/copy'
</script>

<section id="problem" class="snap-section relative bg-gray-100 px-4">
	<div class="mx-auto max-w-2xl">
		<h2 class="mb-10 text-3xl font-bold text-black sm:text-4xl xl:text-5xl">
			{problem.heading}
		</h2>

		<div class="space-y-8 text-lg text-gray-600 sm:text-xl">
			{#each problem.body as { bold, rest }}
				<p>
					<span class="font-bold text-black">{bold}</span>{rest}
				</p>
			{/each}
		</div>

		<div class="mt-12 border-l-4 border-yellow-400 pl-6">
			<p class="text-2xl font-bold text-black sm:text-3xl">{problem.pullQuote}</p>
		</div>
	</div>
</section>

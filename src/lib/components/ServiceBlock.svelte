<script lang="ts">
	type ServiceProps = {
		index: string
		question: string
		answer: string
		bullets: string[]
		dark?: boolean
	}

	let { index, question, answer, bullets, dark = false }: ServiceProps = $props()
</script>

<section
	id="service-{index}"
	class="snap-section relative px-4 {dark ? 'bg-black text-gray-100' : 'bg-gray-100 text-black'}"
>
	<div class="mx-auto max-w-2xl">
		<span
			class="mb-6 block text-sm font-bold tracking-widest uppercase {dark ? 'text-yellow-400' : 'text-gray-400'}"
		>
			{index}
		</span>
		<h2 class="mb-6 text-3xl font-bold sm:text-4xl xl:text-5xl">
			{question}
		</h2>
		<p class="mb-8 text-lg {dark ? 'text-gray-400' : 'text-gray-600'} sm:text-xl">
			{answer}
		</p>
		<ul class="space-y-3">
			{#each bullets as bullet}
				<li class="flex items-start gap-3 text-base sm:text-lg">
					<span class="mt-1 block h-2 w-2 shrink-0 bg-yellow-400"></span>
					<span class={dark ? 'text-gray-300' : 'text-gray-700'}>{bullet}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

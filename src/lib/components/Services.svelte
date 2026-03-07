<script>
	const services = [
		{
			question: 'What do we fix first?',
			answer: 'The highest-impact bottleneck hurting speed or conversion.'
		},
		{
			question: 'What do we build?',
			answer: 'One production AI workflow your team can use this month.'
		},
		{
			question: 'What changes?',
			answer: 'Faster output, cleaner operations, and clearer CRO decisions.'
		}
	]
</script>

<section id="services" class="bg-gray-100 py-20">
	<div class="relative container mx-auto">
		<h2
			class="mb-4 px-4 text-2xl font-bold text-black max-xl:border-b-2 max-xl:border-yellow-400 xl:mb-12 xl:px-6 xl:text-4xl"
		>
			What We Do
		</h2>
		<div class="grid grid-cols-1 xl:grid-cols-3 xl:gap-6 xl:px-6">
			{#each services as { question, answer }}
				<article
					class="flex min-h-screen flex-col justify-center border-b-2 border-black px-4 py-8 xl:min-h-[28rem] xl:border-2 xl:p-8"
				>
					<p class="mb-4 text-xs font-semibold tracking-widest text-gray-500 uppercase">Q</p>
					<h3 class="mb-6 text-3xl font-bold text-black xl:text-4xl">{question}</h3>
					<p class="text-lg text-gray-700 xl:text-xl">{answer}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

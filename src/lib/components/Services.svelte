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
		<div
			class="grid grid-cols-1 max-xl:h-screen max-xl:snap-y max-xl:snap-mandatory max-xl:overflow-y-auto xl:grid-cols-3 xl:gap-6 xl:px-6"
		>
			{#each services as { question, answer }}
				<article
					class="flex min-h-screen snap-start flex-col justify-center border-b-2 border-black px-4 py-8 xl:min-h-[28rem] xl:border-2 xl:p-8"
				>
					<h3 class="mb-6 text-4xl font-bold text-black xl:text-4xl">{question}</h3>
					<p class="text-xl text-gray-700 xl:text-xl">{answer}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

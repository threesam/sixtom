<script lang="ts">
	let { testimonial }: { testimonial?: { text: string; person: { name: string }; subtitle: string } } = $props()

	const stats = [
		{ value: '< 7 days', label: 'Average delivery' },
		{ value: '0', label: 'Committees consulted' },
		{ value: '100%', label: 'Shipped, not shelved' }
	]

	const capabilities = [
		'SvelteKit',
		'Next.js',
		'Shopify',
		'Vercel',
		'Cloudflare',
		'Sanity',
		'OpenAI',
		'Claude',
		'Tailwind',
		'n8n',
		'Postgres'
	]
</script>

<section id="credibility" class="snap-section relative bg-black px-4 py-12">
	<div class="mx-auto max-w-3xl">
		<h2 class="mb-8 text-center text-2xl font-bold text-gray-100 sm:text-3xl xl:text-4xl">
			Speed is the strategy.
		</h2>

		<div class="mb-8 grid grid-cols-3 gap-4">
			{#each stats as stat}
				<div class="text-center">
					<p class="mb-1 text-2xl font-bold text-yellow-400 sm:text-3xl xl:text-4xl">{stat.value}</p>
					<p class="text-[10px] tracking-widest uppercase text-gray-500 sm:text-xs">{stat.label}</p>
				</div>
			{/each}
		</div>

		{#if testimonial}
			<div class="mx-auto mb-8 max-w-xl">
				<div class="relative border-l-4 border-yellow-400 pl-4">
					<blockquote class="mb-2 text-sm text-gray-300 italic sm:text-base">
						"{testimonial.text}"
					</blockquote>
					<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
						<span class="text-sm font-bold text-gray-100">{testimonial.person.name}</span>
						{#if testimonial.subtitle}
							<span class="text-xs text-gray-500">&mdash; {testimonial.subtitle}</span>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<div class="text-center">
			<p class="mb-4 text-xs tracking-widest uppercase text-gray-500">Some of the technologies we use</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each capabilities as tech}
					<span class="rounded border border-gray-700 px-2 py-1 text-xs text-gray-400 transition-colors duration-200 hover:border-yellow-400 hover:text-yellow-400">
						{tech}
					</span>
				{/each}
			</div>
		</div>
	</div>
</section>

<script lang="ts">
	import { site } from '$lib/content'
</script>

<section class="snap-section bg-neutral-950">
	<div class="mx-auto w-full max-w-4xl px-6">
		<h1
			class="text-5xl leading-[1.02] font-bold tracking-tight text-neutral-100 md:text-7xl lg:text-8xl"
		>
			{site.hero.h1}
		</h1>
		<p class="mt-8 max-w-2xl text-xl leading-relaxed text-neutral-400 md:text-2xl">
			{site.hero.subhead}
		</p>
		<p class="mt-6 text-sm tracking-wide text-neutral-500 uppercase">
			{site.operator.credentialsChip}
		</p>
		<div class="mt-12">
			<a
				href={site.bookingUrl}
				class="inline-block rounded-md bg-neutral-100 px-8 py-4 text-lg font-medium text-neutral-950 transition-colors hover:bg-white"
				rel="noopener noreferrer"
				target="_blank"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
</section>

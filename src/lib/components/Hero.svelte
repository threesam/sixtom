<script lang="ts">
	import { site } from '$lib/content'
</script>

<section class="py-24 md:py-32">
	<div class="max-w-3xl mx-auto px-6">
		<h1 class="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-neutral-900">
			{site.hero.h1}
		</h1>
		<p class="mt-8 text-xl md:text-2xl text-neutral-600 leading-relaxed">
			{site.hero.subhead}
		</p>
		<div class="mt-10">
			<a
				href={site.bookingUrl}
				class="inline-block bg-neutral-900 text-white px-6 py-3 rounded-md hover:bg-neutral-700 transition-colors text-lg"
				rel="noopener noreferrer"
				target="_blank"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
</section>

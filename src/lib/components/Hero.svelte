<script lang="ts">
	import { site } from '$lib/content'
</script>

<section class="py-24 md:py-32">
	<div class="mx-auto max-w-3xl px-6">
		<h1 class="text-5xl leading-[1.1] font-bold tracking-tight text-neutral-900 md:text-6xl">
			{site.hero.h1}
		</h1>
		<p class="mt-8 text-xl leading-relaxed text-neutral-600 md:text-2xl">
			{site.hero.subhead}
		</p>
		<div class="mt-10">
			<a
				href={site.bookingUrl}
				class="inline-block rounded-md bg-neutral-900 px-6 py-3 text-lg text-white transition-colors hover:bg-neutral-700"
				rel="noopener noreferrer"
				target="_blank"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
</section>

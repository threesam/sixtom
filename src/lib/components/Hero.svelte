<script lang="ts">
	import { site } from '$lib/content'
</script>

<section class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-4xl px-6">
		<h1 class="text-fg">
			<span class="eyebrow block text-sm">AI built</span>
			<span
				class="mt-2 block text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl lg:text-7xl"
			>
				your demo.
			</span>
			<span class="eyebrow mt-10 block text-sm">i build</span>
			<span
				class="mt-2 block text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl lg:text-7xl"
			>
				your solution.
			</span>
		</h1>
		<p class="text-fg-muted mt-8 max-w-2xl text-base leading-relaxed md:text-xl">
			what's the <span class="text-accent">X</span> between you and peace of mind?
		</p>
		<div class="mt-12">
			<a
				href="/book"
				data-umami-event="cta_hero_book"
				class="btn-accent px-8 py-4 text-lg hover:opacity-90"
			>
				{site.hero.ctaPrimary} →
			</a>
		</div>
	</div>
</section>

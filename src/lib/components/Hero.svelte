<script lang="ts">
	import { site } from '$lib/content'
</script>

<section class="snap-section bg-surface">
	<div class="mx-auto w-full max-w-4xl px-6">
		<h1 class="text-fg text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl lg:text-7xl">
			<span class="block">AI built your demo.</span>
			<span class="block">i build <span class="text-accent">your solution</span>.</span>
		</h1>
		<p class="text-fg-muted mt-8 max-w-2xl text-base leading-relaxed md:text-xl">
			what's the <span class="text-fg">X</span> between you and peace of mind?
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

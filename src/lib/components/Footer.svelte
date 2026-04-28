<script lang="ts">
	import { site } from '$lib/content'
</script>

<footer class="border-t border-neutral-800 bg-black px-6 py-16">
	<div class="mx-auto max-w-5xl">
		<p class="text-2xl leading-tight font-semibold tracking-tight text-neutral-100 md:text-4xl">
			sixtom — {site.tagline}
		</p>
		<div
			class="mt-10 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>Designed and built by {site.operator.name}.</p>
			<a
				href={site.gardenUrl}
				class="underline underline-offset-4 transition-colors hover:text-emerald-400"
				rel="noopener noreferrer"
				target="_blank"
			>
				more at the garden →
			</a>
		</div>
	</div>
</footer>

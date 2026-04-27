<script lang="ts">
	import { site } from '$lib/content'
</script>

<footer class="border-t border-neutral-200 bg-neutral-900 py-16 text-neutral-100">
	<div class="mx-auto max-w-5xl px-6">
		<p class="text-2xl font-semibold tracking-tight md:text-3xl">
			sixtom — {site.tagline}
		</p>
		<div
			class="mt-8 flex flex-col gap-3 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>
				Designed and built by {site.operator.name}.
			</p>
			<a
				href={site.gardenUrl}
				class="underline underline-offset-4 hover:text-white"
				rel="noopener noreferrer"
				target="_blank"
			>
				more at the garden →
			</a>
		</div>
	</div>
</footer>

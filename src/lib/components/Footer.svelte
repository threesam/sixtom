<script lang="ts">
	import { site } from '$lib/content'
</script>

<footer class="py-16 border-t border-neutral-200 bg-neutral-900 text-neutral-100">
	<div class="max-w-5xl mx-auto px-6">
		<p class="text-2xl md:text-3xl font-semibold tracking-tight">
			sixtom — {site.tagline}
		</p>
		<div class="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-neutral-400">
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

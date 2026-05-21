<script lang="ts">
	import { site } from '$lib/content'
	const year = new Date().getFullYear()
</script>

<footer class="border-border bg-surface text-fg-subtle w-full border-t px-6 py-4 text-xs">
	<div
		class="mx-auto flex w-full max-w-2xl flex-col items-center justify-between gap-2 sm:flex-row"
	>
		<div class="flex items-center gap-4">
			<span>© {year} sixtom</span>
			<a href="/log" class="hover:text-fg transition-colors">log</a>
			<a href="/notify" class="hover:text-fg transition-colors">notify</a>
			<a href="/privacy" class="hover:text-fg transition-colors">privacy</a>
			<a href="/terms" class="hover:text-fg transition-colors">terms</a>
		</div>
		<a
			href={site.gardenUrl}
			target="_blank"
			rel="noopener noreferrer"
			data-umami-event="cta_garden_link"
			class="hover:text-coin transition-colors"
		>
			threesam.com →
		</a>
	</div>
</footer>

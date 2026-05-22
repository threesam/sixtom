<script lang="ts">
	import { site } from '$lib/content'
	const year = new Date().getFullYear()
</script>

<footer class="border-border bg-surface w-full border-t px-6 py-8">
	<div
		class="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
	>
		<a
			href="/"
			aria-label="sixtom home"
			data-umami-event="footer_home"
			class="text-fg inline-flex items-center text-2xl leading-none font-bold tracking-tight uppercase"
		>
			<span>six</span><span class="bg-fg text-surface mx-2 px-2 py-1">to</span><span>m</span>
		</a>
		<div
			class="text-fg-subtle flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs"
		>
			<span>© {year}</span>
			<a href="/log" class="hover:text-fg transition-colors">log</a>
			<a href="/notify" class="hover:text-fg transition-colors">notify</a>
			<a href="/privacy" class="hover:text-fg transition-colors">privacy</a>
			<a href="/terms" class="hover:text-fg transition-colors">terms</a>
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
	</div>
</footer>

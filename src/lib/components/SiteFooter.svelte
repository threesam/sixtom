<script lang="ts">
	import { site } from '$lib/content'
	const year = new Date().getFullYear()
</script>

<footer class="border-border bg-surface w-full border-t px-6 py-8">
	<div
		class="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-4"
	>
		<a
			href="/"
			aria-label="sixtom home"
			data-umami-event="footer_home"
			class="no-link text-fg inline-flex items-baseline text-2xl leading-none font-bold tracking-tight uppercase"
		>
			<span class="pr-0.5">six</span><span class="bg-fg text-surface px-px pt-0.5 pb-px">to</span
			><span class="pl-px">m</span>
		</a>
		<div class="text-fg-subtle flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
			<span>© {year}</span>
			<a href="/log" data-umami-event="footer_log" class="hover:text-fg transition-colors">log</a>
			<a href="/faq" data-umami-event="footer_faq" class="hover:text-fg transition-colors">faq</a>
			<a href="/notify" data-umami-event="footer_notify" class="hover:text-fg transition-colors"
				>waitlist</a
			>
			<a href="/privacy" data-umami-event="footer_privacy" class="hover:text-fg transition-colors"
				>privacy</a
			>
			<a href="/terms" data-umami-event="footer_terms" class="hover:text-fg transition-colors"
				>terms</a
			>
			<a
				href={site.gardenUrl}
				target="_blank"
				rel="noopener noreferrer"
				data-umami-event="cta_garden_link"
				class="text-fg link-coin"
			>
				threesam.com
			</a>
		</div>
	</div>
</footer>

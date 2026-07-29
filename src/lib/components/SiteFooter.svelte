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
			<a href="/log" data-umami-event="footer_log" class="no-link hover:text-fg transition-colors"
				>log</a
			>
			<a href="/faq" data-umami-event="footer_faq" class="no-link hover:text-fg transition-colors"
				>faq</a
			>
			<a
				href="/notify"
				data-umami-event="footer_notify"
				class="no-link hover:text-fg transition-colors">waitlist</a
			>
			<a
				href="/privacy"
				data-umami-event="footer_privacy"
				class="no-link hover:text-fg transition-colors">privacy</a
			>
			<a
				href="/terms"
				data-umami-event="footer_terms"
				class="no-link hover:text-fg transition-colors">terms</a
			>
			<!-- the garden's guide coin, 1:1 at inline scale — CSS-only flip so the
			     zero-JS home keeps it -->
			<a
				href={site.gardenUrl}
				target="_blank"
				rel="noopener noreferrer"
				data-umami-event="cta_garden_link"
				aria-label="threesam.com"
				class="no-link coin-link inline-block"
			>
				<span class="coin relative block size-6 rounded-full">
					<span class="coin-face coin-front">
						<span class="coin-bar" style="transform: translateY(-2px)"></span>
						<span class="coin-bar" style="transform: translateY(2px)"></span>
					</span>
					<span class="coin-face coin-back">
						<span class="coin-bar"></span>
						<span class="coin-bar-v"></span>
					</span>
				</span>
			</a>
		</div>
	</div>
</footer>

<style>
	.coin-link {
		perspective: 400px;
	}
	.coin {
		background-color: var(--color-coin);
		box-shadow:
			inset 0 0 0 1.5px var(--color-surface),
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		transition:
			transform 300ms ease-in-out,
			box-shadow 300ms ease-in-out;
		transform-style: preserve-3d;
	}
	.coin-link:hover .coin,
	.coin-link:focus-visible .coin {
		transform: rotateY(180deg) rotate(-7deg);
		box-shadow:
			inset 0 0 0 1.5px var(--color-surface),
			0 20px 25px -5px rgb(0 0 0 / 0.1),
			0 8px 10px -6px rgb(0 0 0 / 0.1);
	}
	.coin-face {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 9px;
		display: block;
		transform: translate(-50%, -50%);
		backface-visibility: hidden;
	}
	.coin-back {
		transform: translate(-50%, -50%) rotateY(180deg);
	}
	.coin-bar {
		display: block;
		height: 1.5px;
		width: 100%;
		background-color: var(--color-surface);
	}
	.coin-bar-v {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 9px;
		width: 1.5px;
		background-color: var(--color-surface);
		transform: translate(-50%, -50%);
	}
	@media (prefers-reduced-motion: reduce) {
		.coin-link:hover .coin,
		.coin-link:focus-visible .coin {
			transform: none;
		}
	}
</style>

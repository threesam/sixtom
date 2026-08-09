<script lang="ts">
	import SiteFooter from '$lib/components/SiteFooter.svelte'
	import { site } from '$lib/content'
	import PageMeta from '$lib/components/PageMeta.svelte'
</script>

<PageMeta
	title="accessibility | SIXTOM"
	description="what sixtom does to stay usable for everyone, how it's checked, and how to report a problem."
/>

<div class="bg-surface flex min-h-svh flex-col">
	<div class="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
		<header class="mb-16">
			<a
				href="/"
				class="eyebrow text-fg-subtle hover:text-coin text-xs transition-colors"
				data-umami-event="legal_back_home"
			>
				sixtom
			</a>
			<p class="eyebrow mt-12 text-sm">access</p>
			<h1 class="text-fg mt-2 text-4xl font-bold tracking-tight md:text-6xl">accessibility.</h1>
			<p class="text-fg-muted mt-6 text-lg leading-relaxed">
				this site should work for everyone. if it doesn't work for you, that's a bug.
			</p>
		</header>

		<div class="text-fg-muted space-y-10 text-base leading-relaxed">
			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">the target</h2>
				<p class="mt-3">
					WCAG 2.2 level AA. built to it, not retrofitted: semantic landmarks, one heading per job,
					real buttons and links, a label on every input.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">what's in place</h2>
				<p class="mt-3">
					everything interactive is reachable by keyboard, with a visible focus ring. text contrast
					holds AA or better on the dark surface and the light sections alike.
				</p>
				<p class="mt-3">
					reduced motion is honored. the few animations here collapse to static when your system
					asks. the moving background is decorative, hidden from assistive tech, and never carries
					information.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">how it's checked</h2>
				<p class="mt-3">
					automated audits run clean and every release gets a keyboard pass. automated tools only
					catch about two-thirds of the standard, so the judgment calls get human review. i don't
					claim a clean bill i can't verify.
				</p>
			</section>

			<section>
				<h2 class="text-fg text-xl font-semibold tracking-tight">found a problem</h2>
				<p class="mt-3">
					tell me through the <a href="/notify" data-umami-event="a11y_report_notify"
						>waitlist form</a
					>
					(mention accessibility), or on
					<a href={site.operator.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
					or <a href={site.operator.xUrl} target="_blank" rel="noopener noreferrer">X</a>.
					accessibility bugs get fixed first.
				</p>
			</section>

			<p class="text-fg-subtle mt-16 text-xs tracking-widest uppercase">
				last updated: august 2026
			</p>
		</div>
	</div>
	<SiteFooter />
</div>

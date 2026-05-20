<script lang="ts">
	import LogHero from '$lib/components/LogHero.svelte'
</script>

<svelte:head>
	<title>garden party — SIXTOM log</title>
	<meta
		name="description"
		content="why we ported threesam.com from Next.js to SvelteKit: the impulse, the experiment, and what the numbers showed."
	/>
	<link rel="canonical" href="https://sixtom.com/log/garden-party" />
	<meta property="og:title" content="garden party" />
	<meta
		property="og:description"
		content="why we ported threesam.com from Next.js to SvelteKit: the impulse, the experiment, and what the numbers showed."
	/>
	<meta property="og:url" content="https://sixtom.com/log/garden-party" />
	<meta name="twitter:card" content="summary" />
	<link rel="preload" as="image" href="/assets/clouds.webp" />
</svelte:head>

<LogHero
	href="/log/garden-party"
	title="garden party"
	eyebrow="— log / 2026-05-18"
	heroImage="/assets/clouds.webp"
	clickable={false}
	headingLevel={1}
/>

<!-- READ BOX -->
<article class="mx-auto w-full max-w-2xl px-6 py-16 md:py-24">
	<div class="text-fg-muted prose-log space-y-8 text-base leading-relaxed">
		<p class="text-fg-muted text-lg leading-relaxed">
			my wife offered me tea. i picked 'garden party.' that's how i ended up porting <a href="https://threesam.com" class="text-accent hover:underline">threesam.com</a> from Next.js to SvelteKit — same routes, same design, same everything. a 1:1 swap. here's what happened.
		</p>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">why</h2>
			<p>
				threesam.com was draft-factoried. started as a draft, kept getting built on, never revisited
				the foundation. Next.js + React because that's what was already there. not because i chose
				it. that's how defaults work — you reach for them once and then they're just the thing you're
				using.
			</p>
			<p class="mt-4">
				i'd wanted SvelteKit for a while. the mental model fits better for the kind of sites i build.
				but it sat in the eventually pile the way things do when the cost of switching feels bigger
				than the benefit of fixing.
			</p>
			<p class="mt-4">
				with LLM tooling where it is now, that assumption felt worth testing. so we tested it.
			</p>
		</section>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">purpose</h2>
			<p>
				two questions. is a 1:1 port across frameworks even possible? not "mostly done" — a complete
				transfer, same routes, same sketches, same visual output, zero regressions. and if it's
				possible, how good can it get? visual parity? performance parity? better?
			</p>
			<p class="mt-4">
				we wanted a real measurement against a live production baseline. not a toy project. not a
				greenfield rewrite.
			</p>
			<p class="mt-4">
				threesam.com made it a good test. canvas-heavy and imperative by nature: 31 generative
				sketches, WebGL cloud shaders, voronoi images, metaball simulations, particle-text effects,
				a three.js scene. things that touch the DOM frame-by-frame. React's value is diffing a tree
				and batching updates. canvas and WebGL bypass the DOM entirely. the component tree was
				already mostly <code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">useEffect</code> hooks
				pretending to be declarative — React's mental model fighting the actual code shape. which
				made it a clean test case: does the better-fit framework actually show up in the numbers?
			</p>
		</section>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">findings</h2>
			<p>
				it's possible. and it landed higher than the baseline.
			</p>

			<div class="border-border mt-6 overflow-x-auto rounded-lg border">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-border border-b">
							<th class="text-fg px-4 py-3 text-left font-medium">route</th>
							<th class="text-fg px-4 py-3 text-left font-medium"
								>perf<br /><span class="text-fg-subtle text-xs font-normal">next → svelte</span></th
							>
							<th class="text-fg px-4 py-3 text-left font-medium">a11y</th>
							<th class="text-fg px-4 py-3 text-left font-medium">best practices</th>
							<th class="text-fg px-4 py-3 text-left font-medium">seo</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">50 → 85</span>
								<span class="text-fg-subtle ml-1 text-xs">(+35)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/deana</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">67 → 95</span>
								<span class="text-fg-subtle ml-1 text-xs">(+28)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/sounds</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">70 → 96</span>
								<span class="text-fg-subtle ml-1 text-xs">(+26)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/anything-but-analog</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">72 → 95</span>
								<span class="text-fg-subtle ml-1 text-xs">(+23)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/shelf</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">75 → 90</span>
								<span class="text-fg-subtle ml-1 text-xs">(+15)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">99.6 / 99.6</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/dad</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">76 → 90</span>
								<span class="text-fg-subtle ml-1 text-xs">(+14)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/canvas/self</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">62 → 70</span>
								<span class="text-fg-subtle ml-1 text-xs">(+8)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/thoughts</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">91 → 96</span>
								<span class="text-fg-subtle ml-1 text-xs">(+5)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/benny</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">88 → 90</span>
								<span class="text-fg-subtle ml-1 text-xs">(+2)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
					</tbody>
				</table>
			</div>

			<p class="text-fg-subtle mt-4 text-sm leading-relaxed">
				Next.js live-production baseline vs SvelteKit with perf work applied. all 9 routes measured.
			</p>

			<div class="border-border mt-6 rounded-lg border p-5">
				<p class="text-fg mb-1 font-medium">net</p>
				<ul class="text-fg-muted mt-2 space-y-1.5 text-sm">
					<li>perf: avg +17.3 pts. best gain +35 on /. 8 of 9 routes now at 90+.</li>
					<li>
						/canvas/self is the outlier at 70 — that's a WebGL-canvas ceiling, not a framework
						issue.
					</li>
					<li>a11y / best practices / seo: 100 / 99.6 / 100 — held everywhere, both before and after.</li>
					<li>/canvas/self payload: 6.3 MB → ~1.5 MB (album-art WebP conversion).</li>
					<li
						>/deana initial JS: 220 KB → 5.5 KB (−97.5%; canvas + message components
						dynamic-imported).</li
					>
					<li>/shelf TTFB: 2.6s → ~0 (prerendered; Goodreads RSS fetch moved to build time).</li>
				</ul>
			</div>

			<p class="mt-8">
				the port was a pruning pass too. one commit deleted 5,557 lines: a dead audio system, orphan
				hero canvas components, deprecated case-study route stubs, duplicate lib files shadowing
				each other between the Next.js root and the SvelteKit <code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">src/</code> tree.
			</p>
			<p class="mt-4">
				the component shape got simpler. canvas logic that had been jammed into
				<code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">useEffect</code> cleanup cycles
				— stale refs, double-mounts in strict mode, cleanup ordering — moved into Svelte actions. an
				action is: here's a node, do something to it, here's how to undo it. that's the exact shape
				the sketches were already written in. the friction disappeared.
			</p>
			<p class="mt-4">
				Svelte 5 runes made reactivity explicit. <code
					class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">$state</code
				>,
				<code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">$derived</code>,
				<code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">$effect</code> — you read a component
				and you know exactly what's reactive and why. no implicit dependency arrays to audit.
			</p>
			<p class="mt-4">
				we could have shipped the port faster. lift-and-shift, leave the dead code alone, move on.
				instead we paused to prune — and that pass took days, not hours. the agent reads every file
				during a port anyway, so orphan code surfaces naturally. the cost of <em>noticing</em> it is
				essentially zero. the cost is deciding to stop and remove it. worth making. the audio-reactive
				subsystem was setting state nothing read; the <code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">/api/counters</code> endpoint
				had zero callers; the deprecated case-study routes weren't linked from anywhere. none of it
				was doing anything — it just looked like it might be.
			</p>
			<p class="mt-4">
				every change since has been faster. less surface area. prototyping a new section is hours,
				not a day. tinkering with an interaction doesn't start with "wait, does this audio system
				still matter?" a smaller codebase is a faster codebase to think in. for a long-lived
				personal site, the time spent pruning during a re-platform pays back the next time you sit
				down to build something. when we do this for a client, the cleanup pass isn't scope creep —
				it's the part that makes the next year of changes cheap.
			</p>

			<p class="mt-8">
				this port was driven by an AI agent — 78 commits, multi-day execution, granular and
				reviewable. total LLM cost was roughly tens of dollars in API tokens. closer to a single
				consulting hour than a sprint. the 1:1 visual fidelity was verified by automated screenshot
				diffs against the live production site, route by route.
			</p>
			<p class="mt-4">
				that changes the math on framework choice. the old argument for staying on Next.js + React —
				even when the fit was bad — was cost. re-platforming meant weeks of refactor work, regression
				risk, team retraining. studios and teams reached for the defaults and stayed there. when that
				work compresses to a few days and a small API bill, the constraint melts. framework choice
				becomes a tactical bet with measurable payback — not a multi-year commitment you're locked
				into.
			</p>
			<p class="mt-4">
				this isn't a svelte-beats-react take. the point is: you can read what an app actually does,
				pick accordingly, and know whether it paid off. sometimes that answer is Next.js. here it
				wasn't.
			</p>
		</section>

		<footer class="border-border mt-12 border-t pt-8">
			<p class="text-fg-muted text-sm">
				live at <a href="https://threesam.com" class="text-accent hover:underline">threesam.com</a>.
				if your stack has been sitting in the eventually pile — <a href="/" class="text-accent hover:underline">let's talk</a>.
			</p>
		</footer>
	</div>
</article>

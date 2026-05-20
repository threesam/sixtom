<svelte:head>
	<title>garden port — SIXTOM log</title>
	<meta
		name="description"
		content="why we ported threesam.com from Next.js to SvelteKit: the impulse, the experiment, and what the numbers showed."
	/>
	<link rel="canonical" href="https://sixtom.com/log/garden-porty" />
	<meta property="og:title" content="garden port" />
	<meta
		property="og:description"
		content="why we ported threesam.com from Next.js to SvelteKit: the impulse, the experiment, and what the numbers showed."
	/>
	<meta property="og:url" content="https://sixtom.com/log/garden-porty" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<article class="mx-auto w-full max-w-2xl px-6 py-16 md:py-24">
	<header class="mb-12">
		<p class="eyebrow mb-4 text-sm">— log / 2026-05-18</p>
		<h1
			class="text-fg mb-2 text-3xl leading-tight font-semibold tracking-tight md:text-4xl lg:text-5xl"
		>
			garden port
		</h1>
		<p class="mb-6 text-xl font-semibold md:text-2xl" style="color: var(--color-coin)">y?</p>
		<p class="text-fg-muted text-lg leading-relaxed">
			a 1:1 port of <a href="https://threesam.com" class="text-accent hover:underline">threesam.com</a> from Next.js to SvelteKit. here's the impulse, what we were trying to find out, and what we actually learned.
		</p>
	</header>

	<div class="text-fg-muted prose-log space-y-8 text-base leading-relaxed">
		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">why</h2>
			<p>
				threesam.com was draft-factoried — started as a draft, kept getting built on, never revisited
				the foundation. the framework was Next.js + React because that's what was already there, not
				because it was chosen. that's how it goes: reach for the default, start building, accumulate.
			</p>
			<p class="mt-4">
				Sam had wanted to move to SvelteKit for a while. personally prefers it; the mental model fits
				better for the kind of sites he builds. but it stayed in the "eventually" pile the way things
				do when the cost of moving feels large relative to the benefit.
			</p>
			<p class="mt-4">
				the impulse was simple: why not actually try, rather than just stay on the default? the cost
				of migrating a medium-sized personal site had always been the blocker. with LLM tooling where
				it is now, that assumption felt worth testing. so we tested it.
			</p>
		</section>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">purpose</h2>
			<p>
				two questions we wanted answered:
			</p>
			<p class="mt-4">
				first, the existence question: is a 1:1 port across frameworks even possible with current LLM
				tooling? not "mostly done" or "good enough" — a complete transfer, same routes, same
				sketches, same visual output, zero feature regressions.
			</p>
			<p class="mt-4">
				second, the degree question: if the port is possible, what level of quality can it reach?
				visual parity with the original? performance parity? better? we wanted a real measurement
				against a live production baseline — not a toy project, not a greenfield rewrite.
			</p>
			<p class="mt-4">
				threesam.com is canvas-heavy and imperative by nature: 31 generative sketches, WebGL cloud
				shaders, voronoi images, metaball simulations, particle-text effects, a three.js scene.
				things that directly touch the DOM frame-by-frame. React's value is diffing a tree and
				batching updates. canvas and WebGL bypass the DOM entirely. the component tree was already
				mostly <code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">useEffect</code> hooks
				pretending to be declarative. React's mental model was fighting the actual code shape — which
				made it a good test case for whether the better-fit framework actually shows up in the numbers.
			</p>
		</section>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">findings</h2>
			<p>
				the port is possible, and the quality landed higher than the baseline. here's what we found.
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
				the port was also a forcing function for cleanup that was overdue. one commit deleted 5,557
				lines: a dead audio system, orphan hero canvas components, deprecated case-study route
				stubs, and duplicate lib files that had been shadowing each other between the Next.js root
				and the SvelteKit <code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">src/</code
				> tree.
			</p>
			<p class="mt-4">
				the component shape got simpler too. canvas logic that had been jammed into
				<code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">useEffect</code> cleanup cycles
				— with the usual footguns around stale refs, double-mounts in strict mode, and cleanup ordering
				— moved into Svelte actions. an action is: here's a node, do something to it, here's how to undo
				it. that's the exact shape the sketches were already written in. the friction disappeared.
			</p>
			<p class="mt-4">
				Svelte 5 runes also made reactivity more explicit. <code
					class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">$state</code
				>,
				<code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">$derived</code>,
				<code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">$effect</code> — you read a component
				and you know exactly what's reactive and why. no implicit dependency arrays to audit.
			</p>
			<p class="mt-4">
				honest aside: we could have shipped the port faster. lift-and-shift, leave the dead code
				alone, move on. instead we paused to prune — and that pass took days, not hours. the agent
				reads every file during a port anyway, so orphan code surfaces naturally. the cost of
				<em>noticing</em> it is essentially zero. the cost is the decision to stop and remove it.
				that decision is worth making. the audio-reactive subsystem was setting state nothing read;
				the <code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">/api/counters</code> endpoint
				had zero callers; the deprecated case-study routes weren't linked from anywhere. none of it
				was doing anything — it just looked like it might be.
			</p>
			<p class="mt-4">
				the payoff compounds. every change since has been faster because there's less surface area to
				navigate. prototyping a new section is hours, not a day. tinkering with an interaction
				doesn't start with "wait, does this audio system still matter?" a smaller codebase is a
				faster codebase to think in. for a long-lived personal site, the time you spend pruning
				during a re-platform pays back the next time you sit down to build something. when we do
				this kind of work for a client, the cleanup pass isn't scope creep — it's the part that
				makes the next year of changes cheap.
			</p>

			<p class="mt-8">
				what we found about the cost equation: this port was driven by an AI agent — 78 commits,
				multi-day execution, granular and reviewable. total LLM cost was roughly tens of dollars in
				API tokens — closer to a single consulting hour than a sprint. the 1:1 visual fidelity was
				verified by automated screenshot diffs against the live production site, route by route.
			</p>
			<p class="mt-4">
				that changes the math on framework choice. the older argument for staying with Next.js + React
				— even when the fit wasn't great — was cost. re-platforming was a major engineering project.
				weeks of refactor work, regression risk, testing burden, team retraining. so studios and teams
				reached for the defaults and stayed there. when the grunt work compresses from an engineering
				quarter to a few days and a small API bill, that constraint melts. framework choice becomes a
				tactical perf bet with measurable payback — not a strategic multi-year commitment.
			</p>
			<p class="mt-4">
				this isn't a svelte-beats-react take. it's a meta-point: pick the tool that fits your app's
				actual shape. you can read what an app actually does, pick accordingly, measure the win, and
				know whether it was worth it. sometimes that answer is Next.js. here it wasn't.
			</p>
		</section>

		<footer class="border-border mt-12 border-t pt-8">
			<p class="text-fg-muted text-sm">
				the result is live at <a href="https://threesam.com" class="text-accent hover:underline"
					>threesam.com</a
				>. if you've been side-eyeing your stack because the cost of moving felt too high — that
				math has changed. <a href="/" class="text-accent hover:underline">happy to talk</a>.
			</p>
		</footer>
	</div>
</article>

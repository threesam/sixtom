<svelte:head>
	<title>we ported threesam.com to SvelteKit. here's what changed. — SIXTOM log</title>
	<meta
		name="description"
		content="a 1:1 port from Next.js to SvelteKit on a canvas-heavy personal site. Lighthouse numbers, code deleted, and why framework choice should follow what the app actually does."
	/>
	<link rel="canonical" href="https://sixtom.com/log/threesam-sveltekit-port" />
	<meta property="og:title" content="we ported threesam.com to SvelteKit. here's what changed." />
	<meta
		property="og:description"
		content="a 1:1 port from Next.js to SvelteKit. Lighthouse numbers, 5,557 lines deleted, and why the non-standard choice is sometimes the boring measured one."
	/>
	<meta property="og:url" content="https://sixtom.com/log/threesam-sveltekit-port" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<article class="mx-auto w-full max-w-2xl px-6 py-16 md:py-24">
	<header class="mb-12">
		<p class="eyebrow mb-4 text-sm">— log / 2026-05-18</p>
		<h1
			class="text-fg mb-6 text-3xl leading-tight font-semibold tracking-tight md:text-4xl lg:text-5xl"
		>
			we ported threesam.com to SvelteKit.<br />here's what changed.
		</h1>
		<p class="text-fg-muted text-lg leading-relaxed">
			a 1:1 framework swap on a canvas-heavy personal site — plus a focused perf sprint after the
			port landed. no design changes. no feature changes. the numbers are interesting.
		</p>
	</header>

	<div class="text-fg-muted prose-log space-y-8 text-base leading-relaxed">
		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">the reflex</h2>
			<p>
				most projects reach for Next.js + React without asking the question. it's the default vibe.
				big ecosystem, lots of examples, every AI coding tool knows it cold. that's a real reason to
				use it — especially when you're building quickly and don't want to fight your tooling.
			</p>
			<p class="mt-4">
				but it's worth asking the question anyway: does this app actually benefit from a virtual
				DOM? for <a href="https://threesam.com" class="text-accent hover:underline">threesam.com</a
				>, the honest answer was no.
			</p>
		</section>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">what threesam.com actually is</h2>
			<p>
				31 generative sketches. WebGL cloud shaders. voronoi images, metaball simulations,
				particle-text effects, a three.js scene. the site is canvas-heavy and imperative by nature —
				things that directly touch the DOM frame-by-frame and respond to pointer events in real
				time.
			</p>
			<p class="mt-4">
				React's value is diffing a tree and batching DOM updates. canvas and WebGL bypass the DOM
				entirely. the component tree was already mostly <code
					class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">useEffect</code
				>
				hooks pretending to be declarative — mount, get a canvas ref, run an imperative animation loop,
				clean up on unmount. React's mental model was fighting the actual code shape.
			</p>
			<p class="mt-4">
				Svelte's compile-time approach has no runtime vdom overhead. Svelte actions map cleanly onto
				exactly this pattern: attach imperative behavior to a DOM node, return a destroy function.
				it's the same code, minus the apologetic wrapping.
			</p>
		</section>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">the port</h2>
			<p>
				1:1. no design changes, no feature changes, no content changes. SvelteKit (Svelte 5 runes) +
				Vercel adapter replacing Next.js 15 + React 19. same routes, same sketches, same copy, same
				visual output. the goal was an apples-to-apples measurement, not a redesign.
			</p>
			<p class="mt-4">
				the Lighthouse comparison is end-to-end: the Next.js baseline (live production) against
				SvelteKit with all perf work applied — WebP image conversions, dynamic imports, prerendered
				routes where possible. the baseline has CDN caching and edge delivery on its side. SvelteKit
				still came out ahead across the board.
			</p>
		</section>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">the numbers</h2>

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
								<span class="text-accent font-semibold">50 → 88</span>
								<span class="text-fg-subtle ml-1 text-xs">(+38)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/sounds</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">70 → 99</span>
								<span class="text-fg-subtle ml-1 text-xs">(+29)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/dad</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">76 → 97</span>
								<span class="text-fg-subtle ml-1 text-xs">(+21)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/canvas/self</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">62 → 82</span>
								<span class="text-fg-subtle ml-1 text-xs">(+20)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/deana</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">67 → 83</span>
								<span class="text-fg-subtle ml-1 text-xs">(+16)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/anything-but-analog</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">72 → 85</span>
								<span class="text-fg-subtle ml-1 text-xs">(+13)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/benny</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">88 → 97</span>
								<span class="text-fg-subtle ml-1 text-xs">(+9)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="border-border border-b hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/thoughts</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">91 → 99</span>
								<span class="text-fg-subtle ml-1 text-xs">(+8)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
						</tr>
						<tr class="hover:bg-white/5">
							<td class="text-fg-muted px-4 py-3 font-mono text-xs">/shelf</td>
							<td class="px-4 py-3">
								<span class="text-accent font-semibold">75 → 82</span>
								<span class="text-fg-subtle ml-1 text-xs">(+7)</span>
							</td>
							<td class="text-fg-muted px-4 py-3">100 / 100</td>
							<td class="text-fg-muted px-4 py-3">96 / 96</td>
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
					<li>perf: green on all 9 routes. avg +17.9 pts. best gain +38 on /.</li>
					<li>a11y + best practices + seo: 100/100 across the board. /shelf BP stays tied at 96.</li>
					<li>/canvas/self payload: 6.3 MB → ~1.5 MB (album-art WebP conversion).</li>
					<li>/deana initial JS: 220 KB → 5.5 KB (−97.5%; canvas + message components dynamic-imported).</li>
					<li>/shelf TTFB: 2.6s → ~0 (prerendered; Goodreads RSS fetch moved to build time).</li>
				</ul>
			</div>
		</section>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">what else got cleaner</h2>
			<p>
				the port was a forcing function for cleanup that was overdue. one commit deleted 5,557
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
		</section>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">the takeaway</h2>
			<p>
				framework choice should follow what the app actually does. threesam.com imperatively touches
				the DOM at 60fps — it was always paying for vdom overhead without getting anything back.
			</p>
			<p class="mt-4">
				picking the non-standard tool isn't always the bold move. sometimes it's just the measured
				one. when the math works, it works. the numbers above compare Next.js live-production —
				CDN, edge delivery, the works — against SvelteKit with perf work applied. SvelteKit wins
				on all 9 perf scores.
			</p>
			<p class="mt-4">
				this is what the audit + sprint model is actually for. not reaching for whatever the default
				vibe is, but reading what an app actually does and picking the tool that fits. sometimes
				that's Next.js. here it wasn't.
			</p>
		</section>

		<footer class="border-border mt-12 border-t pt-8">
			<p class="text-fg-muted text-sm">
				the result is live at <a href="https://threesam.com" class="text-accent hover:underline"
					>threesam.com</a
				>. if you want this kind of measured technical decision-making on your stack,
				<a href="/" class="text-accent hover:underline">we can talk</a>.
			</p>
		</footer>
	</div>
</article>

<script lang="ts">
	import LogHero from '$lib/components/LogHero.svelte';
	import MediaSlider from '$lib/components/MediaSlider.svelte';

	const SCREENSHOTS = [
		{
			src: '/log/garden-party/home.webp',
			alt: 'threesam.com home page — clouds background with gallery strip below',
			caption: '/ — clouds + the gallery strip. virtualized canvas tiles.',
		},
		{
			src: '/log/garden-party/self.webp',
			alt: 'threesam.com /self page — voronoi-treated portrait and essay',
			caption: '/self — voronoi-treated portrait, essay underneath.',
		},
		{
			src: '/log/garden-party/analog.webp',
			alt: 'threesam.com /anything-but-analog page — particle text hero and sketch index',
			caption: '/anything-but-analog — particle text hero, 31 sketches behind it.',
		},
		{
			src: '/log/garden-party/deana.webp',
			alt: 'threesam.com /deana page — D-ANA hero with message timeline',
			caption: '/deana — D-ANA hero, message timeline, word cloud.',
		},
		{
			src: '/log/garden-party/shelf.webp',
			alt: 'threesam.com /shelf page — book grid from Goodreads',
			caption: '/shelf — book grid via Goodreads.',
		},
		{
			src: '/log/garden-party/benny.webp',
			alt: 'threesam.com /benny page — 102 Jackson Street tribute with video hero',
			caption: '/benny — 102 jackson street tribute, podcast video, playlists.',
		},
	];

	const ROWS = [
		{ route: '/', next: 50, svk: 85 },
		{ route: '/deana', next: 67, svk: 95 },
		{ route: '/sounds', next: 70, svk: 96 },
		{ route: '/anything-but-analog', next: 72, svk: 95 },
		{ route: '/shelf', next: 75, svk: 90 },
		{ route: '/dad', next: 76, svk: 90 },
		{ route: '/canvas/self', next: 62, svk: 70 },
		{ route: '/thoughts', next: 91, svk: 96 },
		{ route: '/benny', next: 88, svk: 90 },
	].map((r) => ({ ...r, delta: r.svk - r.next }));

	// sorted by delta descending so the largest wins read first
	const CHART_ROWS = [...ROWS].sort((a, b) => b.delta - a.delta);

	// SVG layout constants
	const LEFT = 175;
	const TRACK_W = 390;
	const ROW_H = 34;
	const TOP = 28;
	const GRID = [0, 25, 50, 75, 100];

	function xOf(score: number) {
		return LEFT + (score / 100) * TRACK_W;
	}
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
			my wife offered me tea. i picked 'garden party.' that's how i ended up porting <a
				href="https://threesam.com"
				class="text-accent hover:underline">threesam.com</a
			> from Next.js to SvelteKit — same routes, same design, same everything. a 1:1 swap. here's what
			happened.
		</p>

		<!-- STAT BAND -->
		<dl class="my-10 grid grid-cols-2 gap-4 md:my-12 md:grid-cols-4">
			<div class="border-l-2 pl-4" style="border-color: var(--color-accent);">
				<dt class="text-xs uppercase tracking-wider" style="color: var(--color-fg-muted);">avg perf gain</dt>
				<dd class="mt-1 text-2xl font-bold tabular-nums md:text-3xl" style="color: var(--color-fg);">+17.3</dd>
			</div>
			<div class="border-l-2 pl-4" style="border-color: var(--color-accent);">
				<dt class="text-xs uppercase tracking-wider" style="color: var(--color-fg-muted);">routes ≥ 90</dt>
				<dd class="mt-1 text-2xl font-bold tabular-nums md:text-3xl" style="color: var(--color-fg);">8 / 9</dd>
			</div>
			<div class="border-l-2 pl-4" style="border-color: var(--color-accent);">
				<dt class="text-xs uppercase tracking-wider" style="color: var(--color-fg-muted);">code deleted</dt>
				<dd class="mt-1 text-2xl font-bold tabular-nums md:text-3xl" style="color: var(--color-fg);">5,557 loc</dd>
			</div>
			<div class="border-l-2 pl-4" style="border-color: var(--color-accent);">
				<dt class="text-xs uppercase tracking-wider" style="color: var(--color-fg-muted);">api spend</dt>
				<dd class="mt-1 text-2xl font-bold tabular-nums md:text-3xl" style="color: var(--color-fg);">~$30</dd>
			</div>
		</dl>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">why</h2>
			<p>
				threesam.com started as a throwaway. a portfolio AI was going to make for me — ramble at
				the model, stash what came back, ship it. low effort by design. and the original build
				showed it: Next.js + React because that's what the model defaulted to, canvas sketches
				stuffed into <code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">useEffect</code>
				cleanups, a dead audio system, deprecated routes nobody hit. vibe-coded.
			</p>
			<p class="mt-4">
				but i kept opening it. and the more time i actually spent — shaping what i wanted, reading
				diffs, deleting what wasn't pulling weight — the better it got. garbage in, garbage out.
				the inverse holds too: care in, care out. the law runs both directions.
			</p>
			<p class="mt-4">
				at some point the framework itself started showing as friction — React was the inherited
				default i'd never re-examined. SvelteKit had been in the eventually pile for that exact
				reason; the cost of switching always felt bigger than the benefit of fixing. with LLM
				tooling where it is now, that assumption felt worth testing. so we tested it.
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

		<!-- IMAGE SLIDER -->
		<MediaSlider items={SCREENSHOTS} />

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">findings</h2>
			<p>
				it's possible. and it landed higher than the baseline.
			</p>

			<!-- LOLLIPOP CHART -->
			<figure class="my-12 md:my-16">
				<figcaption class="mb-5 text-xs uppercase tracking-wider" style="color: var(--color-fg-muted);">
					lighthouse perf, per route — next.js → sveltekit
				</figcaption>

				<svg
					viewBox="0 0 {LEFT + TRACK_W + 60} {TOP + CHART_ROWS.length * ROW_H + 26}"
					class="w-full"
					role="img"
					aria-label="lighthouse performance score per route, before and after the sveltekit port"
				>
					<!-- grid lines -->
					{#each GRID as v (v)}
						{@const x = xOf(v)}
						<line
							x1={x}
							y1={TOP - 12}
							x2={x}
							y2={TOP + CHART_ROWS.length * ROW_H - 6}
							stroke="var(--color-border)"
							stroke-width="1"
							stroke-dasharray="2 4"
						/>
						<text
							x={x}
							y={TOP + CHART_ROWS.length * ROW_H + 16}
							text-anchor="middle"
							font-size="9"
							fill="var(--color-fg-subtle)"
							font-family="var(--font-sans)"
							letter-spacing="0.05em">{v}</text
						>
					{/each}

					<!-- rows -->
					{#each CHART_ROWS as row, i (row.route)}
						{@const y = TOP + i * ROW_H}
						{@const xNext = xOf(row.next)}
						{@const xSvk = xOf(row.svk)}

						<!-- route label -->
						<text
							x={LEFT - 8}
							y={y + 4}
							text-anchor="end"
							font-size="11"
							font-family="var(--font-sans)"
							fill="var(--color-fg)">{row.route}</text
						>

						<!-- connecting line -->
						<line
							x1={xNext}
							y1={y}
							x2={xSvk}
							y2={y}
							stroke="var(--color-accent)"
							stroke-width="2"
							stroke-opacity="0.35"
						/>

						<!-- Next.js dot -->
						<circle cx={xNext} cy={y} r="4" fill="var(--color-fg-subtle)" />

						<!-- SvelteKit dot -->
						<circle cx={xSvk} cy={y} r="5.5" fill="var(--color-accent)" />

						<!-- delta label -->
						<text
							x={xSvk + 10}
							y={y + 4}
							font-size="11"
							font-family="var(--font-sans)"
							fill="var(--color-accent)"
							font-weight="600">+{row.delta}</text
						>
					{/each}
				</svg>

				<!-- legend -->
				<div class="mt-2 flex items-center justify-center gap-6 text-xs" style="color: var(--color-fg-muted);">
					<span class="flex items-center gap-2">
						<span
							class="inline-block h-2 w-2 rounded-full"
							style="background: var(--color-fg-subtle);"
						></span>
						next.js
					</span>
					<span class="flex items-center gap-2">
						<span
							class="inline-block h-2 w-2 rounded-full"
							style="background: var(--color-accent);"
						></span>
						sveltekit
					</span>
				</div>

				<!-- accessible fallback -->
				<details class="mt-4 text-xs" style="color: var(--color-fg-muted);">
					<summary class="cursor-pointer">see the numbers</summary>
					<table class="mt-3 w-full text-left tabular-nums">
						<thead style="color: var(--color-fg-subtle);">
							<tr>
								<th class="py-1 pr-3 font-semibold">route</th>
								<th class="py-1 pr-3 font-semibold">next</th>
								<th class="py-1 pr-3 font-semibold">sveltekit</th>
								<th class="py-1 font-semibold">Δ</th>
							</tr>
						</thead>
						<tbody>
							{#each CHART_ROWS as row (row.route)}
								<tr>
									<td class="py-1 pr-3 font-mono">{row.route}</td>
									<td class="py-1 pr-3">{row.next}</td>
									<td class="py-1 pr-3">{row.svk}</td>
									<td class="py-1" style="color: var(--color-accent);">+{row.delta}</td>
								</tr>
							{/each}
							<tr class="border-t" style="border-color: var(--color-border);">
								<td class="py-1 pr-3 font-semibold uppercase tracking-wider">avg</td>
								<td class="py-1 pr-3">72.3</td>
								<td class="py-1 pr-3 font-semibold">89.7</td>
								<td class="py-1 font-semibold" style="color: var(--color-accent);">+17.3</td>
							</tr>
						</tbody>
					</table>
				</details>

				<p class="mt-3 text-xs leading-relaxed" style="color: var(--color-fg-subtle);">
					next.js live-production baseline vs sveltekit with perf work applied. a11y / best practices / seo: 100 / 99.6 / 100 — held across both.
				</p>
			</figure>

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

			<!-- CODE SNIPPET: React → Svelte -->
			<div class="my-12 grid gap-6 md:grid-cols-2 md:gap-8">
				<figure>
					<figcaption class="mb-2 text-xs uppercase tracking-wider" style="color: var(--color-fg-muted);">Next.js — React component</figcaption>
					<pre class="overflow-x-auto rounded-md border p-4 text-xs leading-relaxed md:text-sm" style="border-color: var(--color-border); background-color: var(--color-surface);"><code>{`function CloudCanvas({ mirror }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext("webgl");
    const cleanup = setupShader(gl);
    let raf = requestAnimationFrame(loop);
    function loop() {
      /* draw */
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className={mirror ? "..." : "..."}
    />
  );
}`}</code></pre>
				</figure>
				<figure>
					<figcaption class="mb-2 text-xs uppercase tracking-wider" style="color: var(--color-fg-muted);">SvelteKit — action</figcaption>
					<pre class="overflow-x-auto rounded-md border p-4 text-xs leading-relaxed md:text-sm" style="border-color: var(--color-border); background-color: var(--color-surface);"><code>{`<!-- CloudCanvas.svelte -->
<canvas use:cloudShader={{ mirror }} />

// cloud-shader.ts
export function cloudShader(node, params) {
  const gl = node.getContext("webgl");
  const cleanup = setupShader(gl);
  let raf = requestAnimationFrame(loop);
  function loop() {
    /* draw */
    raf = requestAnimationFrame(loop);
  }
  return {
    destroy() {
      cancelAnimationFrame(raf);
      cleanup();
    },
  };
}`}</code></pre>
				</figure>
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
				consulting hour than a sprint. the loop: spec → plan → fresh agent per task → two-stage
				review → visual regression against prod → lighthouse re-measure. the 1:1 visual fidelity was
				verified by automated screenshot diffs against the live production site, route by route.
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
			<p class="text-fg-subtle mt-3 text-xs">
				the work is public:
				<a href="https://github.com/threesam/garden/pull/29" class="text-accent hover:underline">#29</a> (port),
				<a href="https://github.com/threesam/garden/pull/30" class="text-accent hover:underline">#30</a> (perf),
				<a href="https://github.com/threesam/garden/pull/31" class="text-accent hover:underline">#31</a> (content-prerender hotfix),
				<a href="https://github.com/threesam/garden/pull/33" class="text-accent hover:underline">#33</a> (route rename).
			</p>
		</footer>
	</div>
</article>

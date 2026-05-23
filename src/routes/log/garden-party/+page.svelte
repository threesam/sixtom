<script lang="ts">
	import LogHero from '$lib/components/LogHero.svelte'
	import MediaSlider from '$lib/components/MediaSlider.svelte'

	const SCREENSHOTS = [
		{
			src: '/log/garden-party/home.webp',
			alt: 'threesam.com home page — clouds background with gallery strip below',
			caption: '/ — clouds + the gallery strip. virtualized canvas tiles.'
		},
		{
			src: '/log/garden-party/self.webp',
			alt: 'threesam.com /self page — voronoi-treated portrait and essay',
			caption: '/self — voronoi-treated portrait, essay underneath.'
		},
		{
			src: '/log/garden-party/analog.webp',
			alt: 'threesam.com /anything-but-analog page — particle text hero and sketch index',
			caption: '/anything-but-analog — particle text hero, 31 sketches behind it.'
		},
		{
			src: '/log/garden-party/deana.webp',
			alt: 'threesam.com /deana page — D-ANA hero with message timeline',
			caption: '/deana — D-ANA hero, message timeline, word cloud.'
		},
		{
			src: '/log/garden-party/shelf.webp',
			alt: 'threesam.com /shelf page — book grid from Goodreads',
			caption: '/shelf — book grid via Goodreads.'
		},
		{
			src: '/log/garden-party/benny.webp',
			alt: 'threesam.com /benny page — 102 Jackson Street tribute with video hero',
			caption: '/benny — 102 jackson street tribute, podcast video, playlists.'
		}
	]

	const ROWS = [
		{ route: '/', next: 50, svk: 85 },
		{ route: '/deana', next: 67, svk: 95 },
		{ route: '/sounds', next: 70, svk: 96 },
		{ route: '/anything-but-analog', next: 72, svk: 95 },
		{ route: '/shelf', next: 75, svk: 90 },
		{ route: '/dad', next: 76, svk: 90 },
		{ route: '/canvas/self', next: 62, svk: 70 },
		{ route: '/thoughts', next: 91, svk: 96 },
		{ route: '/benny', next: 88, svk: 90 }
	].map((r) => ({ ...r, delta: r.svk - r.next }))

	// sorted by delta descending so the largest wins read first
	const CHART_ROWS = [...ROWS].sort((a, b) => b.delta - a.delta)

	// SVG layout constants
	const LEFT = 175
	const TRACK_W = 390
	const ROW_H = 34
	const TOP = 28
	const GRID = [0, 25, 50, 75, 100]

	function xOf(score: number) {
		return LEFT + (score / 100) * TRACK_W
	}
</script>

<svelte:head>
	<title>garden party — SIXTOM log</title>
	<meta
		name="description"
		content="why we ported threesam.com from Next.js to SvelteKit: the impulse, the experiment, and what the numbers showed."
	/>
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
			my wife offered me tea. i picked 'garden party.' that's how i ended up porting my garden —
			<a href="https://threesam.com" class="text-accent hover:underline">threesam.com</a> — from Next.js
			to SvelteKit. same routes, same design, same everything. a 1:1 swap. here's what happened.
		</p>

		<!-- STAT BAND -->
		<dl class="my-10 grid grid-cols-2 gap-4 md:my-12 md:grid-cols-4">
			<div class="border-l-2 pl-4" style="border-color: var(--color-accent);">
				<dt class="text-xs tracking-wider uppercase" style="color: var(--color-fg-muted);">
					avg perf gain
				</dt>
				<dd
					class="mt-1 text-2xl font-bold tabular-nums md:text-3xl"
					style="color: var(--color-fg);"
				>
					+17.3
				</dd>
			</div>
			<div class="border-l-2 pl-4" style="border-color: var(--color-accent);">
				<dt class="text-xs tracking-wider uppercase" style="color: var(--color-fg-muted);">
					routes ≥ 90
				</dt>
				<dd
					class="mt-1 text-2xl font-bold tabular-nums md:text-3xl"
					style="color: var(--color-fg);"
				>
					8 / 9
				</dd>
			</div>
			<div class="border-l-2 pl-4" style="border-color: var(--color-accent);">
				<dt class="text-xs tracking-wider uppercase" style="color: var(--color-fg-muted);">
					code deleted
				</dt>
				<dd
					class="mt-1 text-2xl font-bold tabular-nums md:text-3xl"
					style="color: var(--color-fg);"
				>
					5,557 loc
				</dd>
			</div>
			<div class="border-l-2 pl-4" style="border-color: var(--color-accent);">
				<dt class="text-xs tracking-wider uppercase" style="color: var(--color-fg-muted);">
					api spend
				</dt>
				<dd
					class="mt-1 text-2xl font-bold tabular-nums md:text-3xl"
					style="color: var(--color-fg);"
				>
					~$30
				</dd>
			</div>
		</dl>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">why</h2>
			<p>
				the Garden started as a throwaway. AI was going to make a portfolio for me — ramble at the
				model, stash what came back, ship it. low effort by design. the original build showed it:
				Next.js + React because that's what the model defaulted to, canvas sketches stuffed into
				<code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">useEffect</code> cleanups, dead
				code everywhere. vibe-coded.
			</p>
			<p class="mt-4">
				but i kept opening it. the more time i spent — shaping what i wanted, reading diffs,
				deleting what wasn't pulling weight — the better it got. garbage in, garbage out. care in,
				care out. the law runs both directions.
			</p>
			<p class="mt-4">
				by port time it was past the wall — ~30,000 lines. any model that touched it had to swallow
				the whole tree before it could help. the assists were getting noisier, not better. the
				framework had also become a default i'd never re-examined. time to test both in the same
				pass.
			</p>
		</section>

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">purpose</h2>
			<p>
				two questions. is a 1:1 port across frameworks even possible — same routes, same sketches,
				same visual output, zero regressions? and if it is, how good can it get?
			</p>
			<p class="mt-4">
				the Garden made a clean test: canvas-heavy and imperative by nature. 31 generative sketches,
				WebGL cloud shaders, voronoi images, metaball simulations, particle-text effects, a three.js
				scene. React's value is diffing a tree and batching updates; canvas and WebGL bypass the DOM
				entirely. the component tree was already mostly <code
					class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">useEffect</code
				>
				hooks pretending to be declarative. clean test for whether a better-fit framework shows up in
				the numbers.
			</p>
		</section>

		<!-- IMAGE SLIDER -->
		<MediaSlider items={SCREENSHOTS} />

		<section>
			<h2 class="text-fg mb-3 text-xl font-semibold">findings</h2>
			<p>it's possible. and it landed higher than the baseline.</p>

			<!-- LOLLIPOP CHART -->
			<figure class="my-12 md:my-16">
				<figcaption
					class="mb-5 text-xs tracking-wider uppercase"
					style="color: var(--color-fg-muted);"
				>
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
							{x}
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
				<div
					class="mt-2 flex items-center justify-center gap-6 text-xs"
					style="color: var(--color-fg-muted);"
				>
					<span class="flex items-center gap-2">
						<span
							class="inline-block h-2 w-2 rounded-full"
							style="background: var(--color-fg-subtle);"
						></span>
						next.js
					</span>
					<span class="flex items-center gap-2">
						<span class="inline-block h-2 w-2 rounded-full" style="background: var(--color-accent);"
						></span>
						sveltekit
					</span>
				</div>

				<p class="mt-3 text-xs leading-relaxed" style="color: var(--color-fg-subtle);">
					next.js live-production baseline vs sveltekit with perf work applied. a11y / best
					practices / seo: 100 / 99.6 / 100 — held across both. /canvas/self is the outlier at 70 —
					a WebGL-canvas ceiling, not a framework issue.
				</p>
			</figure>

			<p class="mt-8">
				the port was a pruning pass too. one commit deleted 5,557 lines: dead audio code, orphan
				canvases, deprecated route stubs, duplicate libs shadowing each other across the old and new <code
					class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">src/</code
				> trees. the codebase landed at ~60% of its original size — back below the wall. the model can
				hold the whole thing in its head again.
			</p>
			<p class="mt-4">
				the component shape got simpler too. canvas logic that had been jammed into
				<code class="bg-border rounded px-1.5 py-0.5 font-mono text-sm">useEffect</code> cleanup cycles
				— stale refs, double-mounts in strict mode, cleanup ordering — moved into Svelte actions. an action
				is just: here's a node, do something to it, here's how to undo it. that's the exact shape the
				sketches were already written in. the friction disappeared.
			</p>

			<p class="mt-8">
				driven by an AI agent. 78 commits, multi-day window, ~5–6 hours of active code
				transformation; the rest was spec, plan, visual diff, perf work — the human judgment loop.
				total LLM cost: tens of dollars.
			</p>
			<p class="mt-4">
				at peak, 37 sub-agents ran in parallel. each one got one tiny, scoped chunk — small enough
				to spec and review independently. i call it the review train: small offshoot, heavy review,
				merge, next chunk. no chunk was ever the whole codebase, so no agent ever hit the wall.
			</p>
			<p class="mt-4">
				guardrails are why it worked — right docs piped in (Svelte MCP for the new framework, the
				existing repo as the source of truth for the old), methodology spec'd up front, tight
				per-chunk reviews. agents handed loose instructions vibe-code. agents handed scoped chunks
				under heavy review ship code you can defend.
			</p>
			<p class="mt-4">
				framework MCP servers killed the old "Next.js wins because the model knows it best"
				argument. the model can read any framework's source of truth on demand. defaults that
				compounded for years are just defaults now.
			</p>
			<p class="mt-4">
				this isn't a svelte-beats-react take. you can read what an app actually does and pick
				accordingly. sometimes the answer is Next.js. here it wasn't.
			</p>
		</section>

		<footer class="border-border mt-12 border-t pt-8">
			<p class="text-fg-subtle text-xs">
				the work is public:
				<a href="https://github.com/threesam/garden/pull/29" class="text-accent hover:underline"
					>#29</a
				>
				(port),
				<a href="https://github.com/threesam/garden/pull/30" class="text-accent hover:underline"
					>#30</a
				>
				(perf),
				<a href="https://github.com/threesam/garden/pull/31" class="text-accent hover:underline"
					>#31</a
				>
				(content-prerender hotfix),
				<a href="https://github.com/threesam/garden/pull/33" class="text-accent hover:underline"
					>#33</a
				> (route rename).
			</p>
		</footer>
	</div>
</article>

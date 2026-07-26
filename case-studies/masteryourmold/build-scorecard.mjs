// Builds baseline.json (single source of truth for the writeup) and scorecard.html
// (the before/after artifact: site screenshots left, Lighthouse gauges right).
// Re-run after the rebuild with OUT=after to produce the matching "after" panel.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'

const HERE = new URL('.', import.meta.url).pathname
const LABEL = process.env.LABEL ?? 'before'
const OUT = process.env.OUT ?? 'scorecard'

const median = (a) => {
	const s = [...a].sort((x, y) => x - y)
	return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2
}

const CATS = ['performance', 'accessibility', 'best-practices', 'seo', 'agentic-browsing']
const METRICS = {
	LCP: 'largest-contentful-paint',
	TBT: 'total-blocking-time',
	CLS: 'cumulative-layout-shift',
	FCP: 'first-contentful-paint',
	SI: 'speed-index',
	TTI: 'interactive'
}

const runsDir = HERE + 'lighthouse/' + (process.env.RUNS ?? 'runs')
const lh = {}
for (const form of ['desktop', 'mobile']) {
	const files = readdirSync(runsDir).filter((f) => f.startsWith(form + '-') && f.endsWith('.json'))
	const data = files.map((f) => JSON.parse(readFileSync(`${runsDir}/${f}`, 'utf8')))
	const scores = {},
		raw = {}
	for (const c of CATS) {
		const v = data.map((d) => Math.round((d.categories[c]?.score ?? 0) * 100)).filter(Boolean)
		if (v.length) {
			scores[c] = Math.round(median(v))
			raw[c] = v
		}
	}
	const metrics = {}
	for (const [k, id] of Object.entries(METRICS)) {
		const v = data.map((d) => d.audits[id]?.numericValue).filter((x) => typeof x === 'number')
		if (v.length) metrics[k] = { median: median(v), min: Math.min(...v), max: Math.max(...v) }
	}
	const w = data.map((d) => d.audits['total-byte-weight']?.numericValue).filter(Boolean)
	const r = data.map((d) => d.audits['network-requests']?.details?.items?.length ?? 0).filter(Boolean)
	lh[form] = {
		runs: data.length,
		scores,
		raw,
		metrics,
		weightKiB: w.length ? Math.round(median(w) / 1024) : null,
		requests: r.length ? Math.round(median(r)) : null
	}
}

const seo = JSON.parse(readFileSync(HERE + 'raw/seo-profile.json', 'utf8'))
const text = existsSync(HERE + 'raw/page-text.json')
	? JSON.parse(readFileSync(HERE + 'raw/page-text.json', 'utf8'))
	: []

const baseline = {
	site: 'https://www.masteryourmold.com/',
	business: 'Mold Master Remediation',
	platform: 'Wix',
	capturedAt: process.env.CAPTURED_AT ?? new Date().toISOString().slice(0, 10),
	label: LABEL,
	lighthouse: lh,
	pages: seo.length,
	totalWords: text.reduce((a, r) => a + r.words, 0),
	images: { total: text.reduce((a, r) => a + r.alt_total, 0), meaningfulAlt: text.reduce((a, r) => a + r.alt_meaningful, 0) },
	pagesMissingMetaDescription: seo.filter((p) => !p.desc_len).map((p) => p.slug),
	pagesWrongH1: seo.filter((p) => p.h1_count !== 1).map((p) => ({ slug: p.slug, h1: p.h1_count })),
	jsonldTypes: [...new Set(seo.flatMap((p) => p.jsonld_types))]
}
writeFileSync(HERE + `${LABEL}.json`, JSON.stringify(baseline, null, 2))

// ── scorecard.html ───────────────────────────────────────────────────────────
const b64 = (p) => (existsSync(p) ? readFileSync(p).toString('base64') : null)
const desk = b64(HERE + 'shots/home-desktop-fold.png')
const mob = b64(HERE + 'shots/home-mobile-fold.png')

const color = (n) => (n >= 90 ? '#00cc66' : n >= 50 ? '#ffaa33' : '#ff3333')
const CIRC = 2 * Math.PI * 46

const gauge = (label, n) => `
  <div class="g">
    <svg viewBox="0 0 110 110" role="img" aria-label="${label}: ${n} out of 100">
      <circle cx="55" cy="55" r="46" fill="none" stroke="#2a2a2a" stroke-width="9"/>
      <circle cx="55" cy="55" r="46" fill="none" stroke="${color(n)}" stroke-width="9"
        stroke-linecap="round" stroke-dasharray="${(n / 100) * CIRC} ${CIRC}"
        transform="rotate(-90 55 55)"/>
      <text x="55" y="55" text-anchor="middle" dominant-baseline="central"
        fill="${color(n)}" font-size="34" font-family="'Space Grotesk',sans-serif" font-weight="600">${n}</text>
    </svg>
    <span>${label}</span>
  </div>`

const ms = (v) => (v >= 1000 ? (v / 1000).toFixed(1) + 's' : Math.round(v) + 'ms')
const vitals = (f) => {
	const m = lh[f].metrics
	const rows = [
		['LCP', ms(m.LCP.median), m.LCP.median <= 2500 ? 'ok' : m.LCP.median <= 4000 ? 'mid' : 'bad'],
		['TBT', ms(m.TBT.median), m.TBT.median <= 200 ? 'ok' : m.TBT.median <= 600 ? 'mid' : 'bad'],
		['CLS', m.CLS.median.toFixed(3), m.CLS.median <= 0.1 ? 'ok' : 'mid'],
		['TTI', ms(m.TTI.median), m.TTI.median <= 3800 ? 'ok' : m.TTI.median <= 7300 ? 'mid' : 'bad'],
		['Weight', lh[f].weightKiB + ' KiB', lh[f].weightKiB <= 800 ? 'ok' : 'mid'],
		['Requests', String(lh[f].requests), lh[f].requests <= 60 ? 'ok' : 'bad']
	]
	return rows.map(([k, v, s]) => `<div class="v ${s}"><span>${k}</span><b>${v}</b></div>`).join('')
}

const panel = (form) => `
  <section class="panel">
    <h3>${form}<em>median of ${lh[form].runs} runs</em></h3>
    <div class="gauges">${CATS.filter((c) => lh[form].scores[c] != null)
			.map((c) => gauge(c === 'best-practices' ? 'best practices' : c === 'agentic-browsing' ? 'agent-ready' : c, lh[form].scores[c]))
			.join('')}</div>
    <div class="vitals">${vitals(form)}</div>
  </section>`

const html = `<!doctype html>
<meta charset="utf-8">
<title>${baseline.business} — baseline</title>
<style>
  @font-face{font-family:'Space Grotesk';src:url('${HERE}../../static/fonts/space-grotesk.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Recursive';src:url('${HERE}../../static/fonts/recursive.woff2') format('woff2')}
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:oklch(14.5% 0 0);color:oklch(97% 0 0);font-family:'Recursive',ui-monospace,monospace;
       width:1600px;padding:44px 48px}
  header{display:flex;align-items:baseline;gap:16px;margin-bottom:8px}
  h1{font-family:'Space Grotesk',sans-serif;font-size:34px;font-weight:600;letter-spacing:-.02em}
  .chip{font-size:12px;text-transform:uppercase;letter-spacing:.14em;padding:5px 12px;border-radius:999px;
        background:oklch(71.2% 0.194 13.428);color:oklch(14.5% 0 0);font-weight:600}
  .sub{color:oklch(66% 0 0);font-size:14px;margin-bottom:30px}
  .sub b{color:oklch(70% 0.15 195);font-weight:400}
  .grid{display:grid;grid-template-columns:1fr 620px;gap:40px;align-items:start}
  .shots{display:grid;grid-template-columns:1fr 260px;gap:20px;align-items:start}
  figure{border:1px solid oklch(26.9% 0 0);border-radius:10px;overflow:hidden;background:#000}
  figcaption{font-size:11px;color:oklch(66% 0 0);padding:8px 11px;border-bottom:1px solid oklch(26.9% 0 0);
             display:flex;justify-content:space-between;text-transform:uppercase;letter-spacing:.1em}
  figure img{display:block;width:100%}
  .panel{border:1px solid oklch(26.9% 0 0);border-radius:10px;padding:20px 22px;margin-bottom:18px}
  .panel h3{font-family:'Space Grotesk',sans-serif;font-size:15px;text-transform:uppercase;letter-spacing:.14em;
            margin-bottom:16px;display:flex;justify-content:space-between;align-items:baseline;font-weight:600}
  .panel h3 em{font-style:normal;font-size:11px;color:oklch(66% 0 0);letter-spacing:.06em;text-transform:none}
  .gauges{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:18px}
  .g{text-align:center}
  .g svg{width:100%;max-width:96px}
  .g span{display:block;font-size:10px;color:oklch(75% 0 0);margin-top:5px;text-transform:uppercase;letter-spacing:.06em}
  .vitals{display:grid;grid-template-columns:repeat(6,1fr);gap:7px;border-top:1px solid oklch(26.9% 0 0);padding-top:15px}
  .v{text-align:center;font-size:11px}
  .v span{display:block;color:oklch(66% 0 0);text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px}
  .v b{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:600}
  .v.ok b{color:#00cc66}.v.mid b{color:#ffaa33}.v.bad b{color:#ff3333}
  .foot{margin-top:14px;font-size:11px;color:oklch(66% 0 0);display:flex;gap:22px;flex-wrap:wrap}
  .foot b{color:oklch(97% 0 0);font-weight:400}
</style>
<header>
  <h1>masteryourmold.com</h1>
  <span class="chip">${LABEL}</span>
</header>
<p class="sub">${baseline.business} · Bucks County, PA · built on <b>${baseline.platform}</b> · captured ${baseline.capturedAt}</p>
<div class="grid">
  <div class="shots">
    ${desk ? `<figure><figcaption><span>desktop</span><span>1440×900</span></figcaption><img src="data:image/png;base64,${desk}" alt="Homepage on desktop"></figure>` : ''}
    ${mob ? `<figure><figcaption><span>mobile</span><span>390×844</span></figcaption><img src="data:image/png;base64,${mob}" alt="Homepage on mobile"></figure>` : ''}
  </div>
  <div>
    ${panel('desktop')}
    ${panel('mobile')}
    <div class="foot">
      <span><b>${baseline.pages}</b> pages</span>
      <span><b>${baseline.totalWords.toLocaleString()}</b> words site-wide</span>
      <span><b>${baseline.pagesMissingMetaDescription.length}/${baseline.pages}</b> missing meta description</span>
      <span><b>${baseline.images.meaningfulAlt}/${baseline.images.total}</b> images with real alt text</span>
      <span>schema: <b>${baseline.jsonldTypes.join(', ')}</b></span>
    </div>
  </div>
</div>`

writeFileSync(HERE + `${OUT}.html`, html)
console.log(`wrote ${LABEL}.json + ${OUT}.html`)
console.log(JSON.stringify({ desktop: lh.desktop.scores, mobile: lh.mobile.scores }, null, 2))

# masteryourmold.com — baseline teardown

**Mold Master Remediation** · Bucks County, PA · certified mold inspection & remediation since 2013
Platform: **Wix** · Captured **2026-07-26** · 13 pages, 2 blog posts

This is the _before_ state, captured before any work. Every number here has a stored artifact
(`lighthouse/`, `raw/`, `shots/`) and a re-runnable method, so the _after_ column is produced the
same way and the delta is checkable by anyone.

Structured against the sixtom production-sprint ledger — each section maps to a paid deliverable.

**The after state is in [`02-after.md`](./02-after.md)**, measured the same way. The scope that
connects them is [`01-rebuild-scope.md`](./01-rebuild-scope.md).

> **Captured from outside, before owner access.** No Search Console, analytics, billing, or business
> context at capture time — all expected later, at which point the flagged sections get filled in.
> That bounds what today's numbers claim: **lab data, not field data; a query sample, not tracked
> rankings; observed behaviour, not internals.** Every limit is flagged inline and collected in §11.
> Nothing here requires trusting an unverifiable number.
>
> Capturing this _before_ access is deliberate — it's the same outside-in view a prospective customer
> or a search engine gets, and it means the before-state can't be accused of hindsight.

---

## 0. Method

| What              | How                                                                       | Artifact                 |
| ----------------- | ------------------------------------------------------------------------- | ------------------------ |
| Lighthouse        | v13.4.1 CLI, headless Chrome, **median of 5 runs** per form factor        | `lighthouse/runs/*.json` |
| Screenshots       | Playwright, desktop 1440×900 @2x + iPhone 14, scroll-walked for lazy-load | `shots/`                 |
| SEO profile       | 13 pages fetched raw (no JS), parsed for head/meta/heading/schema         | `raw/seo-profile.json`   |
| Content           | visible text extracted with escaped-markup handling                       | `raw/page-text.json`     |
| Search visibility | live query sample, July 2026                                              | §5                       |
| Network           | real browser request log per page                                         | `raw/network.json`       |

**Single run vs median matters here.** Mobile performance ranged 60–81 across five runs. Any single
number would have been cherry-picking. Medians are reported throughout; ranges are given where the
spread is the finding.

**The tooling lives outside this repo.** It measures other people's sites and belongs to no product,
so it sits in `~/Code/Me/scripts/case-study/` (see its README). This directory holds only the findings
and the data.

**Re-running for the "after" column** — identical method, pointed at this directory:

```sh
cd ~/Code/Me/scripts/case-study
DATA=~/Code/Me/sixtom/case-studies/masteryourmold

node capture.mjs <site-url> "$DATA"                    # screenshots + network log
URL=<site-url> DATA="$DATA" OUT=runs-after ./lh-median.sh
RUNS=runs-after LABEL=after OUT=after node build-scorecard.mjs "$DATA"
OUT=after node render.mjs "$DATA"
```

The comparison is only worth anything if both columns are measured the same way. That's why the
capture is scripted rather than hand-collected.

**What's in git vs. what isn't.** Committed: this writeup, `before.json` (every cited number as
structured data), `scorecard.png`, the parsed `raw/*.json`, and the brand assets. Gitignored: the
underlying blobs, 52 screenshots, 10 Lighthouse runs, 15 raw HTML pages, ~85 MB, because they
regenerate from the tooling above and this repo deploys to production. The reproducible method is the
receipt; stored megabytes aren't.

---

## 1. Performance — ledger line: _performance to 100s_ ($1,500)

**Median of 5 runs each.**

|             | Performance | Accessibility | Best practices | SEO | Agent-ready |
| ----------- | ----------- | ------------- | -------------- | --- | ----------- |
| **Desktop** | **94**      | **91**        | 100            | 100 | **67**      |
| **Mobile**  | **67**      | **95**        | 100            | 100 | **67**      |

Per-run scores, so the spread is visible rather than hidden behind the median:

- Desktop performance: `84, 88, 94, 95, 98`
- Mobile performance: `60, 67, 67, 70, 81`

Core Web Vitals (median, with observed range across the 5 runs):

| Metric              | Desktop   | Mobile                 | Google threshold             |
| ------------------- | --------- | ---------------------- | ---------------------------- |
| LCP                 | 1.63 s    | **4.32 s** (3.6–16.9)  | ≤2.5 s good, >4.0 s **poor** |
| TBT                 | 0 ms      | **448 ms** (61–546)    | ≤200 ms good                 |
| CLS                 | 0.011     | 0.003                  | ≤0.1 good ✅                 |
| FCP                 | 0.48 s    | 2.01 s (2.0–2.8)       | ≤1.8 s good                  |
| Speed Index         | 0.87 s    | **5.23 s** (2.5–9.3)   | ≤3.4 s good                  |
| Time to Interactive | 1.63 s    | **10.80 s** (7.9–22.5) | ≤3.8 s good                  |
| Page weight         | 1,322 KiB | 1,557 KiB              | —                            |
| Requests            | ~172      | ~179                   | —                            |

**Read it straight: desktop is fine.** 94 with a 1.6 s LCP is a perfectly decent desktop experience.
The problem is mobile, and it is not marginal:

- **LCP 4.32 s median lands in Google's "poor" band.** This is a ranking input, not just a UX one.
- **Time to Interactive 10.80 s.** The page looks ready long before it responds. Someone who taps
  "call" during that window gets nothing.
- **~179 requests and 1.5 MB for a 339-word homepage.** The payload is the page builder, not the page.
- **The variance is the real story.** Mobile LCP swung 3.6 s → 16.9 s across five identical runs on a
  stable connection. TTI swung 7.9 s → 22.5 s; performance scored 60 on one run and 81 on another. An
  unpredictable site is worse than a uniformly slow one, because you cannot tell a customer what to
  expect — and Google samples real users, not best cases.

Lighthouse's own attribution: main-thread work and JS execution dominate (≈550–650 ms TBT savings
available), plus 161 KiB unused JS and 62 KiB unused CSS. That is Wix's runtime. **It is not tunable
from inside Wix** — which is precisely why this is a rebuild rather than an optimization.

Context for a mold company: the customer is standing in a damp basement holding a phone. Mobile _is_
the product surface.

---

## 2. Accessibility — ledger line: _accessibility pass_ ($1,500)

Lighthouse a11y: **91 desktop / 95 mobile** — consistent across all 5 runs each, so the gap is real,
not noise. Desktop scores lower because a colour-contrast failure only manifests in the desktop layout.

Failures found:

- **`link-name` — links with no discernible name** (weight 7, fails on both). Icon-only links with no
  accessible name. A screen reader announces "link" with no destination.
- **`color-contrast` — insufficient contrast** (weight 7, desktop only).
- **`heading-order` — non-sequential headings** (weight 3, both).
- **`agent-accessibility-tree` — malformed accessibility tree** (see §4).

Beyond Lighthouse, from the page audit:

- **40 of 84 images (48%) have no meaningful alt text.** Many carry the _filename_ as alt — `new.png`,
  `WINNER-2026-HL-Bucks.png`. That passes an automated "has alt attribute" check and fails a human.
  This is why the alt number here is 44/84 "meaningful", not the 58/84 an attribute-presence check
  reports.
- **Heading structure is broken site-wide** (§3).

Lighthouse only covers roughly a third of WCAG. This is the automated floor, not a WCAG audit.

---

## 3. Technical SEO — ledger line: _technical SEO foundation_ ($2,000)

Lighthouse SEO reports **100/100** on both form factors. That score is close to meaningless here — it
checks crawlability mechanics, not whether the site can compete. Underneath it:

**What's already right:** HTTPS with valid cert; apex → www 301; HTTP → HTTPS; HTTP/2 + h3; sitemap
index present and referenced from robots.txt; self-referencing canonicals on every page; `lang="en"`;
viewport set; CLS effectively zero.

**What's broken:**

| Finding                                                   | Detail                                                                                                                                                    | Impact                                                               |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **11 of 13 pages have no meta description**               | only `/` (117 chars) and `/spring-air-check` (44) have one                                                                                                | Google writes its own snippet — no control over the click decision   |
| **A staging page is live and indexable**                  | `/copy-of-who-we-are`, title **"WHO WE ARE - before editing"**, self-canonical, listed in the sitemap                                                     | duplicate of `/who-we-are`; an internal draft invited into the index |
| **Broken H1 structure site-wide**                         | `/blog` and `/our-services` have **zero** H1s; `/` has 4; `/free-mold-guide` has 3; `/home-health-consults` has 6                                         | no page states its own topic                                         |
| **Service pages have no subheadings**                     | 6 of 7 service pages have **zero H2s**                                                                                                                    | no scannable structure for readers, crawlers, or answer engines      |
| **Homepage title is 23 chars: "Mold Master Remediation"** | no service, no geography                                                                                                                                  | the highest-value title tag on the site targets only the brand name  |
| **Brand name has 4 variants**                             | "Mold Master Remediation", "Mold Master Rem" (truncated, in titles _and_ schema), "Master Your Mold" (domain), site named "Mold Master Rem" in `llms.txt` | entity confusion for both search and answer engines                  |
| **Thin content**                                          | **4,954 words across the entire 13-page site**; homepage 339 words; thinnest pages 105 and 118                                                            | see §5 for what this costs                                           |
| **Blog abandoned**                                        | 2 posts, both **2024-01-27** — 2.5 years stale                                                                                                            | no freshness, no long-tail surface                                   |

**The two blog posts, audited:**

| Post                                                                      | Words | H2s | Schema        | Meta description |
| ------------------------------------------------------------------------- | ----- | --- | ------------- | ---------------- |
| "Demystifying Mold: A Comprehensive Guide to Mold Types and Their Impact" | 543   | 5   | `BlogPosting` | ❌ missing       |
| "Unveiling the Culprits: Top Causes of Mold in Your Home"                 | 583   | 1   | `BlogPosting` | ❌ missing       |

Two things stand out. First, **the abandoned blog is better built than the money pages** — both posts
carry `BlogPosting` schema and real H2 structure, while all seven service pages have neither. The
platform did that automatically for blog posts and not for pages; nobody noticed. The pages that are
supposed to convert are the weakest on the site.

Second, both titles are generic explainer phrasing with **no local or commercial intent**. Nobody in
Bucks County searches "demystifying mold". These compete against national content mills for
informational queries while the commercial queries in their own county go unanswered (§5).

**Structured data** — only two site-wide types, both weak:

- `LocalBusiness`: no street address (`addressLocality` is _"Bucks County"_ — a county, not a
  locality), no `geo`, no `openingHours`, no `priceRange`, no `sameAs`, no `aggregateRating`.
- **Two conflicting `WebSite` blocks** — one unnamed, one named "Mold Master Rem".
- **No `Service` schema on any of the 7 service pages.** No `FAQPage`. No `BreadcrumbList`. No
  `Article` on the blog posts. No `Organization`.
- Facebook and Instagram profiles are linked in the footer but **absent from `sameAs`** — the one
  place that would connect them to the business entity.

---

## 4. Answer-engine readiness (AEO/GEO) — ledger line: _AEO/GEO foundation_ ($2,000)

**Lighthouse `agentic-browsing`: 67/100 on both desktop and mobile** (identical across all 10 runs).

| Signal                 | State                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| AI crawler access      | ✅ GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, anthropic-ai, OAI-SearchBot all get HTTP 200 |
| `llms.txt`             | ✅ present, passes Lighthouse's check — Wix auto-generated                                                |
| Content in raw HTML    | ✅ server-rendered; readable without JS                                                                   |
| **Accessibility tree** | ❌ **malformed — the one failing agentic-browsing audit**                                                 |
| Entity consistency     | ❌ four brand-name variants; `llms.txt` calls the business "Mold Master Rem"                              |
| Answerable structure   | ❌ no FAQ schema, no Service schema, 6/7 service pages have no subheadings                                |
| Extractable facts      | ❌ no hours, no service-area list, no pricing, no street address in schema                                |

The site is _reachable_ by agents and _not very useful_ to them. The accessibility tree is the shared
substrate — the same malformed tree that fails screen readers fails the agents parsing the page. One
fix, two wins.

Wix also exposes a **site MCP endpoint** at `/_api/mcp` that responds to `tools/list`. Worth noting
honestly: this is the one genuinely modern thing on the site, and it came free with the platform.
(The endpoint's response embeds agent-directed instructions — treated here as untrusted data, not
followed.)

---

## 5. Search visibility — where the money actually is

**Method: live query sample, July 2026. This is a spot check, not tracked rank data** — no rank-tracker
or Search Console access. Directional, and the direction is unambiguous.

| Query                                              | masteryourmold.com | Who ranks                                                              |
| -------------------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| `mold remediation Bucks County PA`                 | **absent**         | Paul Davis, SERVPRO, EcoTech, Rightway, Mack's, C&J, Right On Time     |
| `mold inspection and testing Bucks County PA ERMI` | **absent**         | findingthemold, ermitestingnow, Mastertech, Certified Mold Removal     |
| `mold remediation Doylestown / Newtown PA`         | **absent**         | SERVPRO, Angi, HomeAdvisor, Environmental Mold Solutions, Bulldog, C&J |
| `Mold Master Remediation Bucks County` (branded)   | **present**        | — but a directory (primebuyersreport.org) outranks them                |

**They rank for their own name and essentially nothing else.** A local service business that is only
findable by people who already know it isn't being found — it's being _remembered_. Every non-branded
search in their own county goes to a competitor, a franchise, or a lead-gen directory that will sell
their name back to them.

**Why — the content gap, measured:**

| Page                                     | Words     | H2s   | Page-level schema            |
| ---------------------------------------- | --------- | ----- | ---------------------------- |
| C&J Environmental — Levittown            | **3,564** | 9     | none                         |
| Mack's Mold Removal — Bucks County       | 1,546     | 2     | FAQPage, BreadcrumbList      |
| Mastertech — Bucks County                | 1,456     | 8     | BreadcrumbList, Organization |
| EcoTech — Bucks County                   | 622       | 6     | WebPage                      |
| **masteryourmold `/mold-remediation`**   | **449**   | **0** | **none**                     |
| **masteryourmold — entire 13-page site** | **4,954** |       |                              |

One competitor page carries **8× the content** of the comparable Mold Master page, and **72% of the
entire site's word count** on its own. Competitors ship FAQ and breadcrumb schema; this site ships
neither. There is no keyword trick that closes a gap this size — it's a content and structure deficit.

---

## 6. Analytics & observability — ledger line: _analytics + observability_ ($1,500)

**Confirmed at runtime**, not just in markup: a real browser loaded all 13 pages on both form factors
(26 loads, `raw/network.json`) and contacted exactly seven hosts:

| Host                         | Requests | What it is                                                           |
| ---------------------------- | -------- | -------------------------------------------------------------------- |
| `static.parastorage.com`     | 2,480    | Wix CDN — the platform runtime                                       |
| `frog.wix.com`               | 322      | **Wix's own telemetry** — feeds the built-in Wix Analytics dashboard |
| `siteassets.parastorage.com` | 260      | Wix assets                                                           |
| `panorama.wixapps.net`       | 202      | Wix error/performance monitoring                                     |
| `static.wixstatic.com`       | 176      | Wix media CDN                                                        |
| `www.masteryourmold.com`     | 108      | the site's own origin                                                |
| `browser.sentry-cdn.com`     | 52       | Sentry — **shipped by Wix**, not the owner's                         |

**Zero Google Analytics, GTM, Meta Pixel, Clarity, Hotjar, or any other third-party analytics.** Gap
closed: the raw-HTML finding holds under hydration.

The accurate reading is not "no data" — it's **no data they own or can act on**:

- Wix's built-in analytics _is_ collecting (that's `frog.wix.com`). The owner likely has a dashboard
  with historical traffic. **That's a genuinely useful input to request** — it may supply the traffic
  baseline this case study needs.
- But there is **no GA4**, so no channel attribution, no Search Console linkage, no custom events, no
  cohorting — and nothing that survives leaving Wix. The measurement is as locked to the platform as
  the site is.
- **No conversion tracking on any CTA.** The phone link, the email links, and the contact form are the
  three things that make money, and none of them fire a measurable event. Nobody can say what the
  site converts at, because nothing counts it.
- Two Sentry requests per page load are Wix's error tracking, on someone else's dashboard. The owner
  carries the payload cost (§1) and gets none of the signal.

**Sequencing consequence.** If the "after" column is to show a traffic or conversion delta, either Wix
Analytics history gets exported first, or GA4 goes in early enough to establish a floor. Deciding that
late is how a rebuild ends up with no provable result.

Google Search Console: a `google-site-verification` TXT record exists, so a property is likely
verified. **Getting that access is the single highest-value input still outstanding** — it converts
§5 from a query sample into real impressions, positions, and click history, and it establishes the
traffic baseline the "after" column needs.

---

## 7. Conversion — ledger line: _CRO-ready pages + A/B scaffold_ ($2,500)

Present: click-to-call `tel:1-267-265-4866`, `mailto:info@masteryourmold.com` (one with a pre-filled
subject line — a nice touch), a Wix contact form, and a **2026 Happening List Bucks County winner**
badge (a real, current trust signal, well placed).

Gaps: no analytics means **no conversion tracking on any of it** (§6). No visible service-area page
listing the towns served. No pricing or "what it costs" guidance. No reviews or testimonials marked up
as `Review`/`aggregateRating`. The homepage's 339 words do a lot of work for a decision this
consequential — a mold problem is a health-and-home-value purchase, and the page is thin on
reassurance at the moment of highest anxiety.

---

## 8. Security — ledger line: _security review on every commit_ ($2,000)

| Header                       | State               |
| ---------------------------- | ------------------- |
| `strict-transport-security`  | ✅ max-age=31556952 |
| `x-content-type-options`     | ✅ nosniff          |
| `content-security-policy`    | ❌ missing          |
| `x-frame-options`            | ❌ missing          |
| `referrer-policy`            | ❌ missing          |
| `permissions-policy`         | ❌ missing          |
| `cross-origin-opener-policy` | ❌ missing          |

TLS: Let's Encrypt, valid to 2026-09-27, auto-renewing. Mail on Google Workspace with SPF (`~all`).
**No DMARC record found** — worth fixing regardless of the web rebuild.

The honest framing: on Wix, **none of these are the owner's to set**. There's no commit to review, no
pipeline to gate, no headers to configure. That's not a criticism of their choices — it's the
structural cost of the platform, and it's the argument for owning the stack.

---

## 9. Platform & cost — ledger line: _infra cost audit_ ($1,000)

Confirmed: Wix (Pepyaka server, `parastorage`/`wixstatic` CDN, Wix DNS, `X-Wix-*` headers), Fastly in
front, Google Workspace mail.

**The actual plan and monthly spend are not observable from outside.** For scale only, Wix's public
2026 pricing: Light $17/mo, Core $29, Business $39, Business Elite $159 (annual billing; monthly runs
$24/$36/$46/$172). The site has a contact form and booking references but no store, so it most likely
sits in the **$17–36/mo** band — roughly **$200–430/yr**. That is an estimate from published rates,
not their invoice.

What the audit covers once billing access lands: the actual plan, paid Wix apps, the domain, and
whether directory listings are being rented — the §5 pattern, where lead-gen directories outrank them
for their own brand, makes that worth checking.

---

## 10. What can't be assessed on this platform

Four ledger lines have no "before" measurement, and their absence is the finding:

- **Automated test suite** — no codebase, no tests, nothing to run.
- **Security review on every commit** — no commits.
- **Architecture** — no architecture to review; the site is a page builder's output.
- **Own the code** — nothing is portable. The content is extractable; the site is not.

You can't test, secure, version, or migrate what you don't own. Everything above is downstream of that.

---

## 11. Open gaps in this capture

Named so nobody mistakes the map for the territory. Owner access is expected — each gap notes what
closes it.

| #   | Gap                                                                                                                                                                                       | What closes it                                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | **CrUX field data unavailable** — keyless PSI quota exhausted at capture; a site this size may have too little traffic to appear in CrUX at all. All perf numbers are **lab, not field**. | PSI/CrUX API key                                       |
| 2   | **Rankings are a query sample, not tracked data** (§5)                                                                                                                                    | Search Console, or a rank tracker for position history |
| 3   | ~~Analytics absence needs runtime confirmation~~ — **closed**, confirmed over 26 loads (§6)                                                                                               | —                                                      |
| 4   | **Hosting cost is an estimate from public rates** (§9)                                                                                                                                    | Wix billing access                                     |
| 5   | **No traffic baseline, lead volume, or seasonality**                                                                                                                                      | Search Console + analytics + owner conversation        |
| 6   | ~~Blog posts not audited individually~~ — **closed**, see §3                                                                                                                              | —                                                      |
| 7   | **Lighthouse a11y covers ≈⅓ of WCAG** — automated floor, not an audit                                                                                                                     | manual WCAG 2.2 AA pass (`/a11y`)                      |

Gaps 1, 2, 4, 5 close with owner access — and #5 partly closes from **Wix Analytics history**, which
the owner already has (§6). **7 is the only remaining work on this side.**

---

## 12. The one-line version

> A well-branded local business with a real award, a real phone number, and real services is
> **invisible for every search that isn't its own name** — sitting on 4,954 words, a broken heading
> structure, no analytics, a live "before editing" draft page, and a mobile experience that takes
> 10 seconds to become usable and swings to 22 on a bad run. Desktop is fine. Nobody's mold emergency
> happens on desktop.

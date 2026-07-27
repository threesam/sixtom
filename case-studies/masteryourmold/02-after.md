# masteryourmold.com — after state

**Mold Master Remediation** · Bucks County, PA
Rebuilt on **SvelteKit**, fully prerendered, **zero client JavaScript** · Measured **2026-07-27**

Companion to [`00-baseline.md`](./00-baseline.md) (what was wrong) and
[`01-rebuild-scope.md`](./01-rebuild-scope.md) (what we said we'd do). This is what shipped.

Code: `threesam/moldmaster` · Live: `moldmaster.vercel.app`

> **Read the status honestly.** This is deployed to a staging URL, not to the client's domain. The
> DNS cutover has not happened, so the old Wix site is still what the public sees. Everything below is
> measured on the real thing over a real network; none of it is a projection.

---

## 0. Method, and what changed about it

Same pipeline as the baseline (`~/Code/Me/scripts/case-study`), same median-of-5, same form factors.
Both columns are now measured **over the network against a real CDN** (Wix on Fastly, the rebuild on
Vercel), which closes the caveat flagged in the baseline: the earlier after-numbers came from a
locally served build and were honest about structure but optimistic about latency.

**One measurement artifact, stated up front.** The staging URL carries a deliberate
`X-Robots-Tag: noindex, nofollow`, because every page canonicalises to `www.masteryourmold.com` and an
indexed staging copy would compete with the client's live site. Lighthouse reads that as a failure of
the `is-crawlable` audit and drops SEO from 100 to **69**.

That is scaffolding, not the product:

- The **only** failing SEO audit is `is-crawlable`, and its reported source is literally
  `x-robots-tag: noindex, nofollow`.
- Every other SEO audit passes: `document-title`, `meta-description`, `http-status-code`, `link-text`,
  `crawlable-anchors`, `robots-txt`, `image-alt`, `hreflang`, `canonical`.
- The same build measured without that header scores **SEO 100 on all five runs, both form factors**
  (`lighthouse/runs-local/`).
- The guard is host-conditional on `*.vercel.app` and lifts the moment a production domain is
  attached.

Both measurements are kept in the repo rather than the flattering one being reported alone.

| Run set | What it is |
|---|---|
| `lighthouse/runs/` | before, `www.masteryourmold.com`, network |
| `lighthouse/runs-after/` | after, `moldmaster.vercel.app`, network, **with** the staging noindex |
| `lighthouse/runs-local/` | after, identical build served without the staging header |

---

## 1. Scores

Median of 5 runs per form factor.

### Desktop

| | Performance | Accessibility | Best practices | SEO | Agent-ready |
|---|---|---|---|---|---|
| Before | 94 | 91 | 100 | 100 | **67** |
| After | **99** | **100** | 100 | 69 *(100 without the staging guard)* | **100** |

### Mobile

| | Performance | Accessibility | Best practices | SEO | Agent-ready |
|---|---|---|---|---|---|
| Before | **67** | 95 | 100 | 100 | **67** |
| After | **99** | **100** | 100 | 69 *(100 without the staging guard)* | **100** |

Per-run after scores, so the spread is visible: desktop performance `97, 98, 99, 99, 100`; mobile
performance `99, 99, 99, 99, 100`. Accessibility, best practices and agent-ready were 100 on every
single run.

---

## 2. Core Web Vitals

| Metric | Desktop before | Desktop after | Mobile before | Mobile after |
|---|---|---|---|---|
| LCP | 1.63 s | **0.57 s** | **4.32 s** | **1.08 s** |
| TBT | 0 ms | 0 ms | 448 ms | **61 ms** |
| CLS | 0.011 | **0.000** | 0.003 | **0.000** |
| Time to Interactive | 1.63 s | **0.57 s** | **10.80 s** | **1.08 s** |
| Page weight | 1,322 KiB | **74 KiB** | 1,557 KiB | **103 KiB** |
| Requests | ~172 | **13** | ~179 | **13** |

**The mobile numbers are the ones that matter.** LCP moved out of Google's "poor" band (>4 s) to
comfortably inside "good" (≤2.5 s). Time to interactive went from 10.8 s to 1.08 s, a **10× change**:
the old page looked ready for nine seconds before it could respond to a tap. Page weight is **15×
lighter** and there are **13.8× fewer requests**.

**The variance is gone, and that was half the problem.** The old site's mobile LCP ranged 3.6 s to
16.9 s across five identical runs, and TTI ranged 7.9 s to 22.5 s. The rebuild's mobile LCP ranges
1.07 s to 1.30 s. An unpredictable site is worse than a uniformly slow one, because you cannot tell a
customer what to expect.

**Honest note on desktop Speed Index:** it went *up*, 0.87 s to 1.22 s. The old page had no meaningful
hero image; this one loads a real photograph at full strength. That is a deliberate trade of a
fractional metric for the image that makes the page read as a real trade rather than a brochure.
Desktop performance still scores 99.

---

## 3. Agent-ready: 67 → 100

The baseline's single failing `agentic-browsing` audit was `agent-accessibility-tree`: a malformed
accessibility tree. That is fixed, and it is the same fix that serves screen readers, which is why
accessibility moved 91/95 → 100 in the same pass.

| Signal | Before | After |
|---|---|---|
| AI crawler access | ✅ 200 | ✅ 200 (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, OAI-SearchBot) |
| Accessibility tree | ❌ malformed | ✅ well-formed |
| `llms.txt` | Wix auto-generated, names the business "Mold Master Rem" | hand-shaped, generated from the same content the pages render |
| Entity consistency | ❌ four brand-name variants | ✅ one name, sourced from `site.ts` |
| Answerable structure | ❌ no FAQ schema, 6/7 service pages with zero H2s | ✅ FAQPage on every service page, real H2 hierarchy |
| Extractable facts | ❌ no service area, hours, or process | ✅ service area, process, credentials, review text |

---

## 4. Structure and SEO fundamentals

| | Before | After |
|---|---|---|
| Pages missing a meta description | **11 of 13** | **0 of 12** |
| Pages with exactly one H1 | 8 of 13 | **all** |
| Service pages with zero H2s | 6 of 7 | **0** |
| Schema types | 2 (`WebSite`, `LocalBusiness`) | **5** (`+ Service`, `FAQPage`, `BreadcrumbList`) |
| Conflicting `WebSite` blocks | 2 | 1 |
| Live staging page in the index | `/copy-of-who-we-are`, titled "WHO WE ARE - before editing" | gone, 301 to `/who-we-are` |
| Brand-name variants | 4 | 1 |
| Sitemap | Wix-generated, listed the draft page | generated from content, 14 URLs |

**URLs preserved.** Every existing path still resolves: the seven service pages, `/our-services`,
`/who-we-are`, `/free-mold-guide`, `/blog`, and `/post/[slug]`. The migration has **exactly one
redirect**, and it is the page that should never have existed. Nothing with index history was traded
for a tidier structure.

Meta descriptions can't regress: `description` is a required prop on the SEO component, so a page
physically cannot ship without one.

---

## 5. Content

| | Before | After |
|---|---|---|
| Words across the page set | 4,954 (13 pages) | **11,003** (12 pages) |
| Blog posts | 543 + 583 words | 888 + 925 words |
| Service pages with FAQs | 0 | 7 |

**Caveat on those totals:** both counts include navigation and footer chrome, and the rebuild has a
fuller footer, so some of the increase is furniture rather than content. The cleaner figure is the
service copy measured from source: **5,162 words across the seven service pages**, which on its own
exceeds the old site's entire 4,954-word total. Each service page carries 650–850 words plus 5–6 FAQs.

For scale, the competitor benchmark from baseline §5: one C&J page carried **3,564 words**, more than
seven times the old `/mold-remediation` page. That specific gap is closed.

**What has not changed, and cannot yet:** rankings. Baseline §5 found the site absent from every
non-branded query in its own county. Search takes months and compounds with what gets published, and
per the sixtom SEO/AEO hedge rule the rebuild sells the foundation, never the outcome. The honest
claim today is that the structural reasons for the absence are fixed.

---

## 6. Security

| Header | Before | After |
|---|---|---|
| `content-security-policy` | ❌ | ✅ |
| `x-frame-options` | ❌ | ✅ `DENY` |
| `referrer-policy` | ❌ | ✅ |
| `permissions-policy` | ❌ | ✅ |
| `x-content-type-options` | ❌ | ✅ `nosniff` |
| `strict-transport-security` | ✅ | ✅ |

All verified with `curl -I` against the deployment, not read from source. That distinction earned its
keep: the first deployment shipped **none** of these. They were set in `hooks.server.ts`, and because
every page is prerendered the hook never runs for a page request, so the whole block was dead code
that read like a deliverable. Moved to `vercel.json`, which applies to static responses. Reading the
source would never have caught it.

DMARC is still absent on the domain. That is a DNS record, unrelated to the rebuild, and worth fixing.

---

## 7. What the rebuild also fixed that nobody asked about

- **Trust signals were on their own site and unused.** Two real reviews with attribution (Elizabeth M.
  of Washington Crossing, Jake S. of Jamison) plus the Google reviews link, migrated from their Wix
  homepage. Jake's is the positioning in a customer's own words: cold-like symptoms for months, found
  mold, no problems since.
- **Their service area was published in the Wix footer** and is now on-page and in schema: Bucks,
  Montgomery, Delaware, Chester, Philadelphia, New Jersey.
- **Six certification marks were buried.** IICRC, ASHI, and three MICRO certifications plus the
  Happening List 2026 award now have a dedicated block and `hasCredential` markup.
- **The brand font wasn't loading.** 151 elements on the live Wix site render in Arial because Poppins
  arrives via a third-party stylesheet. Self-hosted now, 16 KB for both weights.
- **Positioning.** Holistic and health-led was one service among seven; it is now the page's thesis.
  Every competitor ranking for "mold remediation Bucks County" is a water/fire/storm restoration firm.
  None of them position on health.

---

## 8. Verification

- **`/drive` 5 of 5 journeys, 26 steps**, against the deployment: landing to contact, service page and
  FAQ, blog and Portable Text rendering, all preserved URLs plus the single redirect, and the contact
  form failing loudly. Zero console errors, which is a meaningful assertion on a site that ships no
  JavaScript.
- **37 unit tests**, pinning the baseline findings so they cannot regress: URLs unchanged, every page
  has a meta description, no fabricated star ratings, brand name never truncated, schema omits
  unverified fields.
- **Lint, type-check and build clean.**

---

## 9. Still open

Nothing here blocks the work; all of it is honesty about scope.

1. **Not on the production domain.** The DNS cutover has not happened, so the public still sees the
   Wix site and none of this is live for customers.
2. **No traffic baseline.** Baseline §6 confirmed zero third-party analytics over 26 page loads.
   Umami event hooks are wired but no analytics account is connected, and no pre-rebuild traffic data
   exists to compare against. **Wix Analytics history should be exported before the cutover** or it is
   gone.
3. **The contact form is not live.** `/api/contact` validates, rate-limits and honeypots correctly,
   then returns 503 with a readable page pointing at the phone number, because no SMTP credentials
   have been supplied. It fails loudly rather than accepting a lead it cannot deliver.
4. **Facts still marked `NEEDS_CLIENT`**: street address, opening hours, pricing. The schema omits
   them rather than guessing. The live site's schema puts a *county* in `addressLocality`, which is
   wrong; we would rather emit nothing than a second wrong fact.
5. **Rankings unchanged and will be for months** (§5).
6. **Copy is written from the outside.** Accurate about the service category, not yet specific about
   *their* process, products, or what "holistic" means in their practice. That comes from the intro
   call and slots into `services.ts` without touching a component.
7. **CrUX field data still unavailable.** All performance numbers here are lab, not field.

---

## 10. The one-line version

> A business that was invisible for every search except its own name, on a page that took 10.8 seconds
> to become usable on a phone, now loads in **1.08 seconds**, weighs **15× less**, scores **100 for
> accessibility and answer-engine readiness**, and says the one true thing about itself that none of
> its competitors can say. The rankings will take months. Everything that was structurally stopping
> them is fixed.

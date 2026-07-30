# masteryourmold.com — after state

**Mold Master Remediation** · Bucks County, PA
Rebuilt on **SvelteKit**, fully prerendered, **zero client JavaScript** · Measured **2026-07-30**

Companion to [`00-baseline.md`](./00-baseline.md) (what was wrong) and
[`01-rebuild-scope.md`](./01-rebuild-scope.md) (what we said we'd do). This is what shipped.

Code: `threesam/moldmaster` · Live: `moldmaster.vercel.app`

> **Read the status honestly.** This is deployed to a staging URL, not to the client's domain. The
> DNS cutover has not happened, so the old Wix site is still what the public sees. Everything below is
> measured on the real thing over a real network; none of it is a projection.

**The one artifact to send:** [`deltas.png`](./deltas.png) — portrait before/after card, sized to be
screenshotted into a text thread rather than read as a report. Regenerate with
`node build-deltas.mjs <dir> && OUT=deltas node render.mjs <dir>`.

---

## 0. Method, and what changed about it

Same pipeline as the baseline (`~/Code/Me/scripts/case-study`), same median-of-5, same form factors.
Both columns are measured **over the network against a real CDN** (Wix on Fastly, the rebuild on
Vercel), which closes the caveat flagged in the baseline: the earliest after-numbers came from a
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
- The same build served without that header scores **SEO 100**, verified again on 2026-07-30.
- The guard is host-conditional on `*.vercel.app` and lifts the moment a production domain is
  attached.

Both measurements are kept rather than the flattering one being reported alone. The raw run sets are
local, not committed — `lighthouse/` is gitignored as ~85MB of regenerable blobs, and reproducibility
is the receipt (see `.gitignore` and 00-baseline §0). Every number cited here is in `before.json` /
`after.json`, which are committed.

| Run set                     | What it is                                                        |
| --------------------------- | ----------------------------------------------------------------- |
| `lighthouse/runs/`          | before, `www.masteryourmold.com`, network                         |
| `lighthouse/runs-after/`    | after, first pass, 2026-07-27                                     |
| `lighthouse/runs-after-v2/` | after, current build, 2026-07-30 — **the numbers reported below** |
| `lighthouse/runs-local/`    | after, identical build served without the staging header          |

> **Known measurement obstacle.** Repeated automated runs against `moldmaster.vercel.app` eventually
> trip Vercel's bot mitigation, which answers `403` with `x-vercel-mitigated: challenge` and a
> "Security Checkpoint" page. It is IP-scoped and transient, and it is **not** a site fault — the
> deployment reports `READY` throughout. If a capture run starts returning 403 on every route, that is
> why. Wait it out rather than debugging the site.

---

## 1. Scores

Median of 5 runs per form factor, 2026-07-30.

### Desktop

|        | Performance | Accessibility | Best practices | SEO                                  | Agent-ready |
| ------ | ----------- | ------------- | -------------- | ------------------------------------ | ----------- |
| Before | 94          | 91            | 100            | 100                                  | **67**      |
| After  | **100**     | **100**       | 100            | 69 _(100 without the staging guard)_ | **100**     |

### Mobile

|        | Performance | Accessibility | Best practices | SEO                                  | Agent-ready |
| ------ | ----------- | ------------- | -------------- | ------------------------------------ | ----------- |
| Before | **67**      | 95            | 100            | 100                                  | **67**      |
| After  | **100**     | **100**       | 100            | 69 _(100 without the staging guard)_ | **100**     |

Per-run after scores, so the spread is visible: desktop performance `100, 100, 100, 100, 100`; mobile
performance `99, 100, 99, 100, 100`. Accessibility, best practices and agent-ready were 100 on every
single run, both form factors.

**Why single runs are not reported.** One mobile run of this site has come back as low as 97 and as
high as 100 within the same ten minutes, entirely on Vercel cold-start variance in TBT. The median of
five is the number; a single flattering run is not evidence.

---

## 2. Core Web Vitals

| Metric              | Desktop before | Desktop after | Mobile before | Mobile after |
| ------------------- | -------------- | ------------- | ------------- | ------------ |
| LCP                 | 1.63 s         | **0.31 s**    | **4.32 s**    | **1.22 s**   |
| FCP                 | —              | **0.31 s**    | —             | **1.14 s**   |
| TBT                 | 0 ms           | 0 ms          | 448 ms        | **56 ms**    |
| CLS                 | 0.011          | **0.000**     | 0.003         | **0.000**    |
| Speed Index         | 0.87 s         | **0.38 s**    | 5.23 s        | **2.37 s**   |
| Time to Interactive | 1.63 s         | **0.31 s**    | **10.80 s**   | **1.22 s**   |
| Page weight         | 1,322 KiB      | **66 KiB**    | 1,557 KiB     | **94 KiB**   |
| Requests            | ~172           | **12**        | ~179          | **12**       |

**The mobile numbers are the ones that matter.** LCP moved out of Google's "poor" band (>4 s) to
comfortably inside "good" (≤2.5 s). Time to interactive went from 10.8 s to 1.22 s, an **8.9× change**:
the old page looked ready for nine seconds before it could respond to a tap. Page weight is **16.6×
lighter** on mobile and **20× lighter** on desktop, with **~15× fewer requests**.

**The variance is gone, and that was half the problem.** The old site's mobile LCP ranged 3.6 s to
16.9 s across five identical runs, and TTI ranged 7.9 s to 22.5 s. The rebuild's mobile LCP holds
inside a few hundred milliseconds. An unpredictable site is worse than a uniformly slow one, because
you cannot tell a customer what to expect.

**One number will get worse, and it should.** Speed Index improved partly because the hero is
currently a labelled placeholder rather than a photograph — there is no large image to paint. When the
real hero photo lands, Speed Index and LCP will both rise. That is a trade worth making: a picture of
the actual work is worth more than a fractional lab metric, and the earlier version of this document
recorded the opposite trade for the same reason. Budget for it rather than being surprised.

---

## 3. Agent-ready: 67 → 100

The baseline's single failing `agentic-browsing` audit was `agent-accessibility-tree`: a malformed
accessibility tree. Fixed, and it is the same fix that serves screen readers, which is why
accessibility moved 91/95 → 100 in the same pass.

| Signal               | Before                                                   | After                                                                            |
| -------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| AI crawler access    | ✅ 200                                                   | ✅ 200 (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, OAI-SearchBot) |
| Accessibility tree   | ❌ malformed                                             | ✅ well-formed                                                                   |
| `llms.txt`           | Wix auto-generated, names the business "Mold Master Rem" | hand-shaped, generated from the same content the pages render                    |
| Entity consistency   | ❌ four brand-name variants                              | ✅ one name, sourced from `site.ts`                                              |
| Answerable structure | ❌ no FAQ schema, 6/7 service pages with zero H2s        | ✅ FAQPage on every service page, real H2 hierarchy                              |
| Extractable facts    | ❌ no service area, hours, or process                    | ✅ service area, process, credentials, review text, **published prices**         |

**A regression caught here, worth recording as method.** A mid-project accessibility fix put
`role="region"` on the reviews `<ul>` so the horizontal slider would be keyboard-reachable (WCAG
technique G202). The role overrode the list semantics, which orphaned every `<li>` from its parent:
accessibility dropped 100 → 97 on the `listitem` audit and agent-ready fell **100 → 67**. The fix was
to move the role and `tabindex` onto a wrapping `<div>` and leave the list a list.

Two lessons, both now enforced: an accessibility change can break the machine-readability of a page,
and **the agent-ready score is the more sensitive detector of a malformed tree** — it moved 33 points
where accessibility moved 3.

---

## 4. Structure and SEO fundamentals

|                                  | Before                                                      | After                                            |
| -------------------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| Pages missing a meta description | **11 of 13**                                                | **0 of 12**                                      |
| Pages with exactly one H1        | 8 of 13                                                     | **all**                                          |
| Service pages with zero H2s      | 6 of 7                                                      | **0**                                            |
| Schema types                     | 2 (`WebSite`, `LocalBusiness`)                              | **5** (`+ Service`, `FAQPage`, `BreadcrumbList`) |
| `Offer` / `AggregateOffer`       | ❌ none                                                     | ✅ on the four services that publish a price     |
| `aggregateRating`                | ❌ none                                                     | ✅ 5.0 from 16 reviews, all verifiable on Google |
| Conflicting `WebSite` blocks     | 2                                                           | 1                                                |
| Live staging page in the index   | `/copy-of-who-we-are`, titled "WHO WE ARE - before editing" | gone, 301 to `/who-we-are`                       |
| Brand-name variants              | 4                                                           | 1                                                |
| Sitemap                          | Wix-generated, listed the draft page                        | generated from content, 14 URLs                  |

**URLs preserved.** Verified again on 2026-07-30 by pulling all three live Wix sitemaps and diffing
against the rebuild: every one of the 13 live pages plus both blog posts resolves. The migration has
**exactly one redirect**, and it is the page that should never have existed. Nothing with index
history was traded for a tidier structure.

Meta descriptions can't regress: `description` is a required prop on the SEO component, so a page
physically cannot ship without one.

**Structured data matches visible content.** `Offer` is opt-in per page, because `/our-services` lists
all seven services without their prices — emitting an Offer there would describe a figure the reader
cannot see, which is the mismatch Google names as grounds for a manual action rather than a style
note. A test asserts offers stay off by default.

---

## 5. Content

|                           | Before           | After                 |
| ------------------------- | ---------------- | --------------------- |
| Words across the page set | 4,954 (13 pages) | **13,787** (12 pages) |
| Blog posts                | 543 + 583 words  | 888 + 925 words       |
| Service pages with FAQs   | 0                | 7                     |
| Customer reviews on-page  | 2, unverifiable  | **16, all on Google** |

**Caveat on those totals:** both counts include navigation and footer chrome, and the rebuild has a
fuller footer, so some of the increase is furniture. The cleaner figure is the service copy measured
from source: **5,114 words across the seven service pages**, which on its own exceeds the old site's
entire 4,954-word total. Each service page carries 650–850 words plus 5–6 FAQs.

For scale, the competitor benchmark from baseline §5: one C&J page carried **3,564 words**, more than
seven times the old `/mold-remediation` page. That specific gap is closed.

**Reviews are now the trust surface.** All 16 five-star Google reviews are transcribed verbatim into a
zero-JavaScript scroll-snap slider, with `aggregateRating` emitted as a fact rather than an
assumption. The two testimonials from the old Wix homepage ("Elizabeth M.", "Jake S.") are
deliberately **excluded**: they are not traceable to a verifiable source, and sixteen reviews anyone
can go and confirm beats eighteen where two cannot be. The reviews also validated the positioning
independently — customers use the words "holistic", "health", "non-toxic" and "resources for our
family" without being prompted.

**What has not changed, and cannot yet:** rankings. Baseline §5 found the site absent from every
non-branded query in its own county. Search takes months and compounds with what gets published, and
per the sixtom SEO/AEO hedge rule the rebuild sells the foundation, never the outcome. The honest
claim today is that the structural reasons for the absence are fixed.

---

## 6. Security

| Header                      | Before | After        |
| --------------------------- | ------ | ------------ |
| `content-security-policy`   | ❌     | ✅           |
| `x-frame-options`           | ❌     | ✅ `DENY`    |
| `referrer-policy`           | ❌     | ✅           |
| `permissions-policy`        | ❌     | ✅           |
| `x-content-type-options`    | ❌     | ✅ `nosniff` |
| `strict-transport-security` | ✅     | ✅           |

All verified with `curl -I` against the deployment, not read from source. That distinction earned its
keep: the first deployment shipped **none** of these. They were set in `hooks.server.ts`, and because
every page is prerendered the hook never runs for a page request, so the whole block was dead code
that read like a deliverable. Moved to `vercel.json`, which applies to static responses. Reading the
source would never have caught it.

The booking integration is a **link, not an embed**, which keeps that CSP intact. Calendly's widget
would require `script-src` and `frame-src` exceptions plus client JavaScript on a site that ships
none, to save one click.

DMARC is still absent on the domain. That is a DNS record, unrelated to the rebuild, and worth fixing.

---

## 7. The content-parity audit — and two regressions it caught

**This is the most transferable part of the method, and it exists because the first pass got it
wrong.** Before launch, every fact on the live site is rendered in a real browser (Wix is JS-gated;
`curl` sees only a shell) and diffed against the rebuild. Not the layout — the _facts_: prices, phone,
email, service area, certifications, response commitments, conversion paths.

That audit found two things the rebuild had **deleted from a working business**:

| Dropped              | What the live site has                                                                                                                                      | Status      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **Published prices** | Inspections from **$649** · sampling **$149** first / **$89** each additional · ERMI from **$395** · air check **$749** · remediation "**$2,000–$10,000+**" | ✅ restored |
| **Online booking**   | "SCHEDULE ONLINE NOW" → a live Calendly, the homepage's primary CTA                                                                                         | ✅ restored |

Both were removed by accident, not decision, and both are the shortest path to revenue on the page. A
published price qualifies a visitor before they call, and in a trade where almost nobody quotes in
public it is a differentiator on its own. A booking link puts a consultation on the calendar in one
pass, where a contact form asks someone to describe a problem and then wait a business day.

The uncomfortable diagnosis: the rebuild was optimised against the **scorecard** rather than the
**business**. Lighthouse cannot tell you that you deleted the price list. Nothing in this document
would have caught it either. Only diffing the live site did.

Booking is now the filled primary in the header, hero and every service page, with the phone alongside
as a text link and the form retained beneath — someone who already knows what they want should not
have to type it out, and someone who wants to explain first still can.

**Also found on their live site, not reproduced:** the `spring-air-check` page still carries a
**"LIMITED SPOTS AVAILABLE — EXPIRES MAY 11"** banner, eleven weeks stale as of this writing. The
$749 is carried over because deleting the client's own number is the mistake above, but it is flagged
in `services.ts` as possibly a lapsed promotional rate rather than the standing price. **Confirm before
launch.**

---

## 8. What the rebuild also fixed that nobody asked about

- **Their service area was published in the Wix footer** and is now on-page and in schema: Bucks,
  Montgomery, Delaware, Chester, Philadelphia, New Jersey.
- **Six certification marks were buried.** IICRC, ASHI, and three MICRO certifications plus the
  Happening List 2026 award now have a dedicated block and `hasCredential` markup. Attributions come
  from the badge artwork on their own site, not from decoding the bare acronyms their page lists.
- **The brand font wasn't loading.** 151 elements on the live Wix site render in Arial because Poppins
  arrives via a third-party stylesheet. Self-hosted now, 16 KB for both weights.
- **The owners were anonymous.** Kevin and Nicole are named, with what each of them does drawn from
  what customers describe in the reviews rather than invented.
- **The logo lockup was crowded.** The supplied artwork sets the wordmark 185px from the mark across a
  5,631px lockup — 5.8px at the size a header renders it. Both halves are lifted off the source by
  measured bounding boxes and recomposited with a real gap. Nothing redrawn.
- **The social card was unusable.** `og:image` was the bare logo at 1200×333 (3.6:1), which every
  platform centre-crops to 1.91:1, slicing the ends off the wordmark — and it carried an alpha
  channel, which scrapers composite onto black. Now a real 1200×630 card, flat white, no alpha, with
  the `og:image:width/height/alt` and `og:locale` tags that were all missing.
- **The favicon was a hand-drawn approximation.** Now cut from the real logo mark. The
  `apple-touch-icon` ships as a plain opaque square on purpose: iOS ignores alpha on home-screen
  icons, composites onto black, and applies its own mask, so pre-rounded corners would put a black
  frame around a white card on every iPhone.
- **Positioning.** Holistic and health-led was one service among seven; it is now the page's thesis.
  Every competitor ranking for "mold remediation Bucks County" is a water/fire/storm restoration firm.
  None of them position on health. **This is a hypothesis, not a validated strategy — see §11.**

---

## 9. Conversion-path decisions

Recorded because they are judgment calls, not fixes, and the client should get to overrule them.

- **The nav is two items.** Every nav link is an alternative to converting; four links plus a button
  gave the header five competing targets. Blog and Free Guide moved to the footer — blog posts are
  _entry_ points from search, not destinations people navigate to, and the guide captures nothing (no
  email gate) while competing with the phone. Both keep homepage sections and sitewide footer links.
- **Nav points at homepage anchors, not pages.** The homepage carries every section in full, so
  sending someone to a separate page to read what is 800px below them costs a full document load
  (there is no client router) and drops them out of a scroll that was building the case.
- **A phone number is not a desktop CTA.** `tel:` on a laptop opens a handoff prompt at best, so the
  most prominent element in the header was an action much of the desktop audience could not take.
  Desktop leads with booking; mobile leads with the call, because `tel:` works and someone standing in
  front of standing water wants a person.
- **Images are labelled placeholders, deliberately.** The stock hero (a technician in full PPE
  spraying a bottle) contradicted the headline: you cannot lead with "holistic, non-toxic" over a
  picture of someone applying chemicals. Every slot names the photograph that belongs there, so **the
  shot list is the site itself** rather than a document that goes stale. Placeholders are hidden below
  `lg` — an empty dashed box says nothing a phone reader needs and ate ~230px of an 844px viewport.

---

## 10. Verification

- **`/drive` 5 of 5 journeys, 29 steps**, against the deployment: landing to contact, service page and
  FAQ, blog and Portable Text rendering, all preserved URLs plus the single redirect, and the contact
  form failing loudly. Zero console errors, a meaningful assertion on a site that ships no JavaScript.
- **44 unit tests**, pinning the baseline findings so they cannot regress: URLs unchanged, every page
  has a meta description, no fabricated star ratings, brand name never truncated, schema omits
  unverified fields, no em/en dashes in visible copy, published prices present, no `null` in the
  JSON-LD graph, and the schema price band never advertises a figure below the display prose.
- **Lint, type-check and build clean**, with a post-change build gate so a review commit cannot break
  the build silently.

**Assertions are negative-verified where it matters.** The `/drive` step guarding the service page's
booking CTA was checked by reintroducing the regression and confirming the step fails — a test that
cannot fail closes nothing. That step exists because a routine `git merge` silently reverted that exact
CTA while keeping both comment blocks, and the original assertions only covered the hero.

---

## 11. Still open

Nothing here blocks the work; all of it is honesty about scope.

1. **Not on the production domain.** The DNS cutover has not happened, so the public still sees the
   Wix site and none of this is live for customers.
2. **The positioning is a hypothesis.** The health-led thesis is inferred from their own `llms.txt`
   phrasing, a MICRO health & safety certification, the ERMI offering, and one service page — not
   from the client. If the revenue is mostly realtor pre-sale inspections, the homepage is aimed wrong.
   **This is the highest-variance open item in the project.**
3. **No traffic baseline.** Baseline §6 confirmed zero third-party analytics over 26 page loads. Umami
   event hooks are wired but no account is connected, and no pre-rebuild traffic data exists to compare
   against. **Wix Analytics history must be exported before the cutover** or it is gone permanently.
   This is the only time-critical item in the document.
4. **The contact form is not live.** `/api/contact` validates, rate-limits and honeypots correctly,
   then returns 503 with a readable page pointing at the phone number, because no SMTP credentials
   have been supplied. It fails loudly rather than accepting a lead it cannot deliver.
5. **Facts still marked `NEEDS_CLIENT`**: street address, postal code, opening hours, and Nicole's
   surname. Schema omits them rather than guessing. The live site's schema puts a _county_ in
   `addressLocality`, which is wrong; we would rather emit nothing than a second wrong fact.
   `priceRange` also stays unset — the published figures are now known, but that field is a subjective
   band (`$`, `$$`), not a number.
6. **Prices need confirming**, especially the `$749` air check (§7).
7. **Rankings unchanged and will be for months** (§5).
8. **Copy is written from the outside.** Accurate about the service category, not yet specific about
   _their_ process, products, or what "holistic" means in their practice.
9. **No real photography.** Every image slot is a labelled placeholder. Expect LCP and Speed Index to
   rise when photos land (§2).
10. **Content is hardcoded** except the blog, which is Portable-Text-shaped for a Sanity cutover. Any
    price or copy change currently requires a developer. That is a deliberate v1 trade and a
    maintenance liability worth pricing.
11. **CrUX field data still unavailable.** All performance numbers here are lab, not field.

---

## 12. Questions this rebuild cannot answer

The technical work is ahead of the commercial understanding. These are ordered by how much the answer
would change the build.

1. **Is the constraint leads or capacity?** If Kevin is the only inspector and he is booked, the site
   should qualify harder and price higher, not generate more volume. Every other decision downstream
   of this one is currently a guess.
2. **What is the revenue mix — realtor/pre-sale, homeowner-health, or restoration referral?** This
   validates or kills the health-led positioning in §8.
3. **What does a $649 inspection convert to?** If inspections become $5k remediations at a decent
   rate, the inspection is a loss-leader and should be priced and marketed as one.
4. **Where do leads actually come from today?** One review mentions meeting Kevin at the _Newtown home
   show_. If the business runs on referral and events, SEO is a bet on a channel they do not currently
   use, and the existing flywheel may deserve the investment instead.
5. **Are IEPs a referral channel?** Two reviews describe working _alongside_ an independent
   environmental professional. A B2B lane to IEPs and functional-medicine clinicians could be worth
   more than consumer SEO, and it is invisible on the site.
6. **What is Nicole's work worth?** Reviews describe her sending families health resources during the
   process. That is the actual differentiator, it is currently free, and it appears nowhere.
7. **Three years out: bigger, or better?** Hiring inspectors versus a strong living for two people.
   Determines whether we build for scale or margin — and whether a CMS matters at all.
8. **What happens when someone is sick and the house is clean?** There is no answer for the
   referral-out case today. It is an ethics question and a two-way partnership opportunity.

---

## 13. The one-line version

> A business that was invisible for every search except its own name, on a page that took 10.8 seconds
> to become usable on a phone, now loads in **1.22 seconds**, weighs **16× less**, scores **100 across
> performance, accessibility and answer-engine readiness on both form factors**, publishes its prices,
> books consultations in one click, and says the one true thing about itself that none of its
> competitors can say. The rankings will take months. Everything that was structurally stopping them
> is fixed — and the parity audit in §7 is why it still has the things that were already working.

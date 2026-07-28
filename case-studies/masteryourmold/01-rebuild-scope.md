# masteryourmold.com — rebuild scope

Companion to [`00-baseline.md`](./00-baseline.md). The baseline says what's broken; this says what
gets built; [`02-after.md`](./02-after.md) says what shipped and what it measured. Every item traces to a numbered finding so the case study can show cause → fix → delta.

**Stack:** SvelteKit 2 + Svelte 5 + Tailwind 4 + TypeScript strict, Vercel adapter, Vitest +
Playwright — mirroring the sixtom repo so the toolchain (`/rev`, `/drive`, `/a11y`, `/lighthouse`)
works unchanged.

**Repo:** new, separate from sixtom — `~/Code/Me/moldmaster` → `threesam/moldmaster`.

---

## 1. What the site is

A **13-page local service site** for a mold inspection/remediation company in Bucks County, PA.
Seven services, an about page, a lead magnet, a contact surface, and a blog with 2 posts.

Content divides cleanly, and that division drives the whole architecture:

| Content | Volume | Changes | Where it lives |
|---|---|---|---|
| Home, about, 7 service pages, contact, guide | 11 pages | rarely — a few times a year | **hardcoded** in typed TS modules |
| Blog posts | 2 today, growing | the only thing that needs fresh publishing | **Sanity-shaped now, Sanity later** |

Only the blog earns a CMS. Building one for eleven pages that change annually is the mistake this
rebuild is explicitly not making.

---

## 2. Brand — already good, currently wasted

Nothing here needs inventing. It needs using properly.

**Palette** (sampled from the live site's computed styles, `raw/brand.json`):

| Token | Value | On white | On navy | Use |
|---|---|---|---|---|
| `--brand-navy` | `#08415C` | **10.93:1** ✅ AAA | — | headings, header/footer, primary buttons, **links on white** |
| `--brand-slate` | `#293241` | **12.91:1** ✅ AAA | — | body text |
| `--brand-sky` | `#81C3D7` | **1.96:1** ❌ | 5.58:1 ✅ AA | icons, accents, borders — **never text on white** |
| `--brand-bright` | `#5AB7E8` | **2.24:1** ❌ | 4.88:1 ✅ AA | accent on navy only |

**Contrast is a hard constraint on this palette, not a preference.** Both blues fail against white —
`#81C3D7` at 1.96:1 and `#5AB7E8` at 2.24:1, versus the 4.5:1 AA floor. They are icon, border, and
on-navy colours. Any text, link, or small UI element on a white background uses navy or slate.
Inverted (white or sky on navy) everything passes comfortably.

This is worth stating up front because it's exactly the trap the current site falls into — the
`color-contrast` failure in baseline §2 is this palette used as if the light blue were a text colour.

**Type:** Poppins (SemiBold display, Light/Regular body). Note from §1 of the baseline: on the live
site **151 elements currently render in Arial** — Poppins isn't reliably loading. Self-hosting a
subset woff2 fixes the brand *and* removes render-blocking third-party font CSS.

**Creative** — pulled at original resolution into `brand/`:

- `logo.png` — 6250×1736, clean two-colour mark. Genuinely good; keep as-is, ship as SVG if the
  vector can be sourced.
- `hero.png` — technician in PPE treating a wall. Real photography, not stock-looking.
- **5 certification marks + 1 award** — IICRC Certified Technician, ASHI, MICRO Certified Mold
  Inspector, MICRO Certified Remediation Contractor, MICRO Certified Health & Safety Technician,
  and **Happening List Bucks County's Best 2026 Winner**.
- ~~6 service icons~~ — line-art set (flashlight, hazmat suit, wind swirl, dripping pipe). **Cut.**

### Icons: cut. Credential marks: kept.

The line-art service icons go. A flashlight does not tell anyone what a mold inspection is, and a
wind swirl does not mean "spring air check" to a person who has never seen the page before. They
occupy the vertical space where the sentence explaining the service should be. **If an icon needs a
label to be understood, the label was doing the work.** Services lead with words.

The certification marks stay, and the distinction matters: they aren't decoration, they're
**evidence**. An IICRC or MICRO seal is a third party asserting something about this company — it
carries information a word can't, because the point is that someone else vouched. A homeowner may
not know MICRO by name, but "certified by a body that isn't them" reads instantly.

**They're also the most under-used asset on the site.** For someone deciding who to let into their
home during a health scare, certification is the entire trust question. They get a real credentials
block, and they get marked up (§5).

---

## 3. The homepage is the product

**The homepage carries everything — a tasting menu.** All seven services, who they are, the
credentials, reviews, service area, and contact all live on `/` in condensed form. "Read more" leads
to the long-form page for anyone who wants depth, but a visitor who never scrolls past the homepage
should still get the whole business.

This suits the actual customer: someone with a mold problem, on a phone, deciding in one session
whether to call. Making them navigate to find out whether you do water mitigation loses them.

It also sets the performance constraint. A homepage carrying that much content has to stay fast —
which is exactly why it's static and image-disciplined (§5), not a page builder assembling a runtime.

**Homepage composition**, top to bottom:

| Section | Content | Reads more at |
|---|---|---|
| Hero | what they do + where + since 2013, phone and quote CTA in the first screen | — |
| Credentials | the 5 certification marks + Happening List 2026 award | `/who-we-are` |
| Services | all 7 — name, one-line promise, 2–3 lines of substance. No icons. | each service page |
| Why it matters | what mold actually does to a home and the people in it | — |
| Process | what happens when you call — inspect, test, remediate, verify | `/mold-inspections` |
| Who we are | short version, certifications named | `/who-we-are` |
| Reviews | real Google reviews, marked up | — |
| Service area | the towns, in text | — |
| Guide | the lead magnet | `/free-mold-guide` |
| Contact | form + click-to-call + email + hours | — |

All seven services on the homepage is deliberate — it's the single highest-value SEO surface and
currently carries 339 words. Condensed-but-real copy for each service takes it to ~1,200 and gives
every service an internal link with meaningful anchor text.

This ordering is a starting point, not a commitment. Changing it is moving a line (§4b).

## 3b. Routes — preserve, don't restructure

Every existing URL stays exactly as it is. The current site's flat structure is already fine, and
these URLs have whatever equity, links, and index history exist. **Restructuring to `/services/[slug]`
would trade real accumulated equity for tidiness** — a bad trade, and 301 chains leak a little every
hop. No redirects means no leak.

```
/                        home — the tasting menu
/our-services            services index                    ← preserved
/mold-testing            ─┐                                ← preserved
/mold-inspections         │                                ← preserved
/mold-remediation         │ 7 service pages, flat,         ← preserved
/water-mitigation         │ URLs unchanged                 ← preserved
/hepa-deep-clean          │                                ← preserved
/home-health-consults     │                                ← preserved
/spring-air-check        ─┘                                ← preserved
/who-we-are              about + credentials + award       ← preserved
/free-mold-guide         lead magnet                       ← preserved
/blog                    post index                        ← preserved
/post/[slug]             post — Wix's path, kept on purpose ← preserved

/copy-of-who-we-are  →  301  →  /who-we-are    the only redirect (finding §3)
/sitemap.xml  /robots.txt  /llms.txt            generated, not hand-maintained
```

`/post/[slug]` is not the shape I'd choose from scratch — but both existing posts live there and
changing it buys nothing. New content joins the existing pattern.

**Net: one redirect across the whole migration.** The only URL that dies is the one that should
never have existed.

---

## 4. Content architecture — the Sanity cutover

The requirement: hardcode everything now, but shape the blog so moving to Sanity is a data-source
swap and nothing else.

**The rule: the render path never learns where content came from.** Pages call a loader; the loader
returns Sanity-shaped documents. Today it returns a local array. Later it returns a GROQ result. No
component changes.

```
src/lib/content/
  types.ts        Post, Service, Review, Credential, SiteSettings
  posts.ts        the 2 existing posts as Post[]  (Sanity-shaped)
  services.ts     7 services — slug, name, promise, summary (home), body, faqs[]
  site.ts         NAP, hours, service area, socials
  credentials.ts  the 5 certification marks + the award
  reviews.ts      real Google review text
  loaders.ts      getPosts() / getPost(slug) — the ONLY seam that changes at cutover
src/lib/sections/  Hero, Services, Credentials, Process, ReviewList,
                   ServiceArea, Contact, Prose, FAQ, CtaBlock
src/params/
  service.ts      matcher — validates a slug against services.ts
sanity/
  schemas/        written now, deployed later — post, author, category, blockContent
scripts/
  import-wix.ts   MCP drain → content modules (when access lands)
```

Each `Service` carries both its short and long copy, so the homepage and the service page read from
one record and can never drift out of sync:

```ts
export type Service = {
  slug: string          // the URL — unchanged from the current site (§3b)
  name: string
  promise: string       // one line, homepage
  summary: string       // 2-3 lines, homepage
  body: string[]        // the long-form page
  faqs: { q: string; a: string }[]   // FAQPage schema + on-page answers
}
```

Writing the Sanity schema files **now**, before they're used, is deliberate: it forces the hardcoded
types to be honest, and makes cutover "deploy the studio and migrate two documents" rather than a
redesign.

`Post` mirrors a Sanity document exactly:

```ts
export type Post = {
  _id: string
  _type: 'post'
  title: string
  slug: { current: string }
  publishedAt: string        // ISO
  excerpt: string            // also the meta description — fixes finding §3
  mainImage?: { asset: { url: string }; alt: string }   // alt required — finding §2
  body: PortableTextBlock[]
  author?: { name: string; role?: string }
  categories?: { title: string; slug: { current: string } }[]
}
```

`body` is **Portable Text today** — `PortableTextBlock[]`, Sanity's exact wire shape, hardcoded in
`posts.ts`. The renderer takes `post.body` and never learns where it came from:

```ts
// loaders.ts — today
export const getPosts = (): Post[] => POSTS
export const getPost = (slug: string) => POSTS.find((p) => p.slug.current === slug)

// loaders.ts — at cutover. Nothing else in the app changes.
export const getPosts = () =>
  client.fetch<Post[]>(`*[_type == "post"] | order(publishedAt desc)`)
```

The hardcoded posts are typed against the same `Post` type the Sanity schema generates, so a shape
mismatch is a compile error rather than a discovery made during migration.

**Services stay plain TS** — `services.ts`, no Sanity shape. They're not going in a CMS, so giving
them document semantics would be ceremony for its own sake.

---

## 4b. Built to be rearranged

The structure in this document is a first draft written from the outside. After the intro call it
will change — sections will move, services will merge or split, copy will be replaced wholesale.
**The build has to make that cheap, or the call's findings get argued against the code instead of
applied to it.**

Three decisions carry that, and they're all subtraction rather than machinery:

**1. Content is data; components never contain copy.** Every sentence lives in `src/lib/content/*.ts`
behind a type. Rewriting a service page after the call is editing an object. No component is opened,
so no component can break.

**2. One route for all seven services, not seven files.** A param matcher validates the slug against
`services.ts`, so real URLs render and anything else 404s properly:

```
src/params/service.ts          isService(slug) — checks the services array
src/routes/[service=service]/  ONE page component, all 7 services
```

Adding an eighth service is appending to an array. Removing one is deleting a line. Renaming is
changing a string — and the sitemap, the homepage list, the nav, and the schema all follow, because
they read from the same array. This is what keeps the flat URLs of §3b from costing seven near-copies
of the same file.

**3. Sections are shared between the homepage and the long-form pages.** The homepage's condensed
service block and the service page's full treatment render through the same primitives — `Prose`,
`FAQ`, `CtaBlock`, `Credentials`, `ReviewList`. Promoting homepage copy into a full page, or pulling
a page's section onto the homepage, is moving data between fields. Neither move requires new UI.

**Deliberately not building: a section registry.** A `sections: [{type:'hero'},…]` array with a
component switch would look more configurable and buy nothing — reordering is moving one line either
way, and the registry adds a layer of indirection between the page and what it renders. The
homepage composes its sections directly. `// ponytail:` comment on the page says so, so nobody
"improves" it later.

### Draining Wix via MCP

Their site exposes `/_api/mcp` with `SearchInSite` and `CallWixSiteAPI` (baseline §4). Once we have
access, that's the content migration: a script pulls pages, posts, and business details and emits
typed content modules matching `types.ts`.

```
scripts/import-wix.ts    MCP → src/lib/content/*.ts
```

This is why the content types get defined before the copy is written. **The import is mechanical
only if there's a target shape to import into** — otherwise it's a pile of JSON someone hand-sorts.
Same principle as writing the Sanity schema before the studio exists.

Worth noting for the case study: the platform they're leaving hands over its own content cleanly. No
scraping required.

---

## 5. Fixes, traced to findings

**Structure & SEO** *(baseline §3)*
- Exactly one H1 per page; real H2 hierarchy on all 7 service pages (currently zero H2s on six).
- A meta description on all 13 pages (currently 11 have none) — sourced from `excerpt`/`summary`
  fields so it can't be forgotten.
- `/copy-of-who-we-are` gone; 301 to `/who-we-are` — the migration's only redirect.
- One brand name everywhere: **Mold Master Remediation** (currently four variants).
- Homepage title carries service + geography, not just the brand.
- Generated sitemap and robots; no stale hand-maintained lists.

**Schema** *(baseline §3, §4)* — the whole point is rich results and answer-engine extractability:
- `LocalBusiness` with real `address`, `geo`, `openingHours`, `areaServed`, `telephone`,
  `priceRange`, and `sameAs` linking Facebook + Instagram (currently absent).
- `Service` on each of the 7 service pages (currently none).
- `FAQPage` on service pages — competitors ship this and rank; we don't.
- `BreadcrumbList` site-wide, `Article` on posts, `Organization` once.
- One `WebSite` block, not two conflicting ones.

**Answer-engine readiness** *(baseline §4)* — currently 67/100 `agentic-browsing`:
- Fix the accessibility tree — the single failing audit, and the same fix that serves screen readers.
- Hand-authored `llms.txt` with the correct business name, services, and service area.
- Extractable facts on-page: hours, towns served, what each service costs or how pricing works.
- Answerable heading structure so passages can be lifted cleanly.

**Accessibility** *(baseline §2)* — target: real WCAG 2.2 AA, not just a Lighthouse number.
- Discernible names on every link (`link-name` currently fails).
- Contrast enforced per the palette table in §2 — both brand blues fail on white and are restricted
  to icons, borders, and on-navy use. A unit test pins the ratios so a future palette tweak can't
  silently reintroduce the current `color-contrast` failure.
- Real alt text on all images (40 of 84 currently use filenames like `new.png`).
- Sequential headings; visible focus; 24×24 targets; `/a11y` gate in CI.

**Performance** *(baseline §1)* — target 100s desktop, 95+ mobile:
- Static prerender; no page-builder runtime. Budget: **<10 requests, <150 KiB** vs today's ~179 and
  1,557 KiB.
- Self-hosted subset Poppins woff2, `font-display: swap`.
- Responsive AVIF/WebP with explicit dimensions; hero preloaded.
- The 5.2 MB source hero becomes a ~40 KiB responsive set.

**Measurement** *(baseline §6)* — the gap that makes the case study provable:
- Umami, self-hosted, with the `test_eject=1` convention shipped day one.
- **Conversion events on every money surface**: phone tap, email tap, form submit, guide download.
  None of these are currently counted.
- GA4 + Search Console alongside, because that's where the ranking history lives.

**Conversion** *(baseline §7)*
- Credentials block using the 6 badges.
- Google reviews surfaced and marked up (they have them; there's a "HAPPY CUSTOMERS" section today).
- Explicit service-area list — the towns, in text. Local intent needs local words.
- Sticky click-to-call on mobile.
- Real form: server-validated, honeypot + timing guard, rate-limited (the sixtom `contact-form.ts`
  pattern ports directly).

**Security** *(baseline §8)* — CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy via
`hooks.server.ts`. All five are currently missing and unsettable on Wix.

---

## 6. Content work — the part that actually moves rankings

The rebuild fixes structure. **Structure alone will not close a 3,564-word gap** (baseline §5), and
per the sixtom SEO/AEO hedge rule this is a foundation, not an outcome.

In scope: rewriting the 7 service pages from ~400 to 800–1,200 words each with real FAQ sections,
plus a service-area page. That takes the site from 4,954 words to roughly 12–15k and makes each
service page genuinely competitive.

Out of scope, and it should be said plainly in the case study: **the ongoing publishing cadence.**
The blog is the compounding asset, and it's theirs to run. The rebuild ships the engine and the
90-day map; the results come from what gets published after.

---

## 7. Proving it

Same method, both columns (baseline §0): `capture.mjs`, `lh-median.sh`, `build-scorecard.mjs`,
`render.mjs` re-run against the new site → `after.json` + `after.png`, rendered identically to the
before scorecard.

Honest about what can and can't be claimed at launch:

| Claimable at launch | Needs months |
|---|---|
| Lighthouse deltas, all four categories | rankings on non-branded queries |
| `agentic-browsing` 67 → target 100 | organic traffic growth |
| Page weight, request count, LCP/TBT/TTI | answer-engine citations |
| Schema coverage, a11y, word count | conversion rate (needs a baseline first) |

**Sequencing constraint from baseline §6:** analytics must be live and collecting *before* launch, or
there's no floor to measure against. Request the Wix Analytics history now — it may be the only
pre-rebuild traffic record that exists.

---

## 8. Decisions — locked 2026-07-26

1. **Blog `body` is Portable Text.** Stored as `PortableTextBlock[]` exactly as Sanity emits it, so
   cutover is a data-source swap and the renderer written now is the renderer forever. The cost —
   hand-authoring PT for posts published before Sanity lands — is small at two posts and disappears
   the moment the studio is live. `getPosts()` in `loaders.ts` is the only line that changes.
2. **Repo: `moldmaster`** — `~/Code/Me/moldmaster` → `threesam/moldmaster`.
3. **Service page copy gets rewritten** — 7 pages from ~400 to 800–1,200 words with real FAQ
   sections, plus a service-area page (§6). Structure alone doesn't close a 3,564-word gap.
4. **Homepage carries everything** (§3); **URLs are preserved, not restructured** (§3b).
5. **No decorative icons.** The line-art service icons are cut — if an icon needs a label to be
   understood, the label was doing the work. Third-party certification marks stay, because they're
   evidence rather than decoration (§2).
6. **Built to be rearranged** (§4b) — content as data, one route for all services, shared section
   primitives. The structure here is a first draft; the intro call will change it, and changing it
   should cost minutes.

### Still needed from the client

Not blocking the build — the architecture and every fix above proceed without them — but these
determine how good the rewritten copy actually is, and §6 is where the ranking outcome lives:

- **Service area**: the actual towns served, in their words.
- **Process**: what happens on an inspection, a remediation, a test. Specifics are what make a
  service page rank and convert; generic mold copy is what everyone else already has.
- **Pricing shape**: even "inspections start at $X" or "we quote after a walkthrough" beats silence.
- **Hours** and a **street address** (or explicit service-area-only status) for `LocalBusiness`.
- **Reviews**: they have Google reviews; the real text, to mark up properly.
- **Wix Analytics history** — the sequencing constraint from baseline §6.
- **Wix account access** — unlocks the MCP content drain (§4b) and the billing line (baseline §9).
- The **logo as vector**, if it exists.

Everything above is an input to the *copy*, not to the *architecture*. The build proceeds now; the
call makes it right rather than making it possible.

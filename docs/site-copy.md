# sixtom — full page copy (v1.3 / `sixtom-v1.3` branch)

Walk it top to bottom as a buyer would. Source files this doc mirrors:

- `src/lib/content/site.ts` — typed content layer (single source of truth)
- `src/app.html` — title + meta + OG/Twitter + analytics
- `src/lib/components/{Hero,OfferSection,LeadCapture}.svelte` — rendering
- `static/llms.txt` — AEO snapshot

If page and doc disagree, files win — re-export from those.

---

## 1. Hero (snap section, full screen, `bg-neutral-950`)

```
sixtom — async sprints                  ← eyebrow, gold, uppercase tracking-widest

AI ships demos. I ship products.        ← H1, huge bold neutral-100

I run agents in parallel. Work ships    ← subhead, neutral-400, 18–22px
whether I'm in a meeting or asleep.
Two weeks to a working version in
production. Daily drops in Slack. No
standups.

$500 audit. $7,500 sprint. By           ← concrete, gold, 24–30px
appointment.

[ Book a 30-min intro call → ]          ← CTA (gold bg, dark text)
                                          (data-umami-event="cta_hero_book")

@ Made In Cookware · Formerly @ Rhone   ← trust marks, tiny neutral-500, uppercase
```

---

## 2. Thesis (snap section, `bg-neutral-950`)

```
— the thesis                            ← eyebrow

"Vibe coding is how you slowly become    ← H2-sized italic quote
the intern of your own codebase."         (sourced verbatim from your "Vibe coding
                                            insight" vault note)

AI gets you to a demo. I run the        ← body, neutral-400
agents that turn it into a product.
```

---

## 3. Offer Section — two cards (snap section, `bg-neutral-900`)

```
two ways in                             ← eyebrow

Start small. Or go.                     ← H2

┌─ AUDIT CARD ───────────────────┐   ┌─ SPRINT CARD ──────────────────┐
│ start here                     │   │ when you're ready              │
│                                │   │                                │
│ The Audit.                     │   │ The Async Sprint.              │
│ $500. Turnaround within a      │   │ $7,500. 1 client a month,      │
│ week.                          │   │ by appointment.                │
│                                │   │                                │
│ Send me your repo and the      │   │ Two weeks. Multiple agents     │
│ thing you've been trying to    │   │ working in parallel on the     │
│ ship. I send back a 1-pager    │   │ boring bits — fixes,           │
│ and a 15-min Loom: what's      │   │ accessibility passes, the      │
│ blocking, what I'd do, whether │   │ edge cases that break in       │
│ a sprint makes sense.          │   │ front of customers. I steer.   │
│                                │   │ You get a daily drop in        │
│                                │   │ Slack and a working version    │
│                                │   │ live on day 10.                │
│                                │   │                                │
│ [ Start the audit → ]          │   │ [ Book the call → ]            │
│ (cta_audit_book)               │   │ (cta_sprint_book)              │
└────────────────────────────────┘   └────────────────────────────────┘

──── stats (3-up grid, gold values, neutral labels) ────────────────────
2 weeks         0                $7,500
PER SPRINT      STANDUPS         FIXED
────────────────────────────────────────────────────────────────────────

"He's built three sites for me and with each one, the unique needs and
goals of the site dictated his approach, no cookie cutting corners."
— Eleanor Goldfield
                                        ← testimonial, italic, left-bordered
```

---

## 4. Lead Capture + Marquee (snap section, `bg-neutral-950` → black footer)

```
Not ready yet?                          ← eyebrow

Heads-up when the next slot opens.      ← H2

One client a month. Drop your email     ← body, neutral-400
and I'll let you know when I'm taking
the next one.

[ you@yourdomain.com ] [ Notify me ]    ← input + button
                                          (cta_notify_submit)
                                          (umami.track('notify_signup_success'))

(conditional status)
You're on the list.                     ← success, gold
Something went wrong. Try again in      ← error, rose-400
a moment.

──── marquee (bottom-anchored, scrolls left ←→ in black bar) ──────────
we just want to build cool shit   ★   more at the garden →   ★   we…
                                      (cta_garden_link)
```

---

## 5. Browser meta (`src/app.html`)

```
<title>sixtom — async sprints with Sam D'Angelo</title>

<meta name="description"
      content="AI ships demos. I ship products. Senior engineer by day, async
               builder for you on my hours. $500 audit. $7,500 sprint. By
               appointment." />

<link rel="canonical" href="https://sixtom.com/" />

<meta property="og:title"        content="sixtom — async sprints with Sam D'Angelo" />
<meta property="og:description"  content="AI ships demos. I ship products.
                                          $500 audit. $7,500 sprint." />
<meta property="og:image"        content="https://sixtom.com/og.png" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt"    content="sixtom — async sprints with Sam D'Angelo" />

<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="sixtom — async sprints with Sam D'Angelo" />
<meta name="twitter:description" content="AI ships demos. I ship products. …" />
```

---

## 6. Cal.com event (provisioned by `pnpm cal:sync`)

```
Title:    30-min intro call — Sixtom
Slug:     sprint-intro
Duration: 30 min

Description:
  A 30-min call. Tell me about the thing you've been trying to ship and
  whether the audit or the sprint is the right next step.

Intake questions:
  1. What's the thing you've been close on but haven't shipped?
     [longText, required]
  2. Send a link to the repo or a screenshot of where it is.
     [text, optional]
  3. Audit ($500) or sprint ($7,500)?
     [select, required]
     options: Audit — figure it out first
              Sprint — I know what I need
              Not sure, want to talk it through
```

---

## 7. `llms.txt` (AEO snapshot)

See `static/llms.txt` for the live version. Summary:

```
sixtom — AI ships demos. I ship products. I run AI agents in parallel —
work happens whether I'm in a meeting or asleep. Two weeks to a working
version. $500 audit. $7,500 sprint. 1 client a month.
```

---

## 8. Umami events fired

| Event name                   | Trigger                                      |
|------------------------------|----------------------------------------------|
| `cta_hero_book`              | Hero "Book a 30-min intro call" click        |
| `cta_audit_book`             | Audit card "Start the audit →" click         |
| `cta_sprint_book`            | Sprint card "Book the call →" click          |
| `cta_notify_submit`          | Notify-me form submit (any state)            |
| `notify_signup_success`      | Notify-me submit returns 200                 |
| `cta_garden_link`            | Marquee "more at the garden" click           |

---

## 9. Voice rules (apply to every edit)

- No "most teams" / "most people" — frame around what *Sam* has been doing.
- No AI tropes: em-dash sandwich, abstract nouns, tricolons-for-symmetry, "It's not X, it's Y", "Here's the thing."
- Periods over commas where reasonable.
- *Italics* and em-dashes only when genuinely earned.
- Wry / self-aware where authentic (matches the "Vibe coding insight" published voice).
- Concrete > generic. Specific numbers > rhetoric.

---

## 10. The whole flow, in one paragraph

You land on a black-on-gold hero that names the gap (AI builds demos, the shipping part is the work) and the offer's two doors ($500 audit, $7,500 sprint). Scroll once and you hit a thesis that's a verbatim quote from your own published writing — voice and POV without a sales pitch. Scroll again and you're inside the offer: two cards (audit + sprint) with explicit price and promise, then three stats, then a real testimonial. Final screen is the soft-conversion notify form with the brand marquee anchored at the bottom. Total: 4 snap-screens. No FAQ wall. No service grid. No agency garnish. Every CTA tracks to Umami.

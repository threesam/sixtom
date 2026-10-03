# tracking plan

Umami, self-hosted at analytics.sixtom.com. No cookies; `?test` ejects a browser
(`?test=0` rejoins). Event wiring is pinned by `umami-events.test.ts`.

## the funnel

| step         | event                                                                                                          | where it fires                    | counts                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| 1. land      | pageview                                                                                                       | browser                           | every visit, with referrer + `utm_*`                                         |
| 2. intent    | `cta_hero_waitlist`, `cta_hero_teardown`, `cta_faq_book`, `footer_book`, `footer_notify`, …                    | browser click                     | clicks, bots with JS included                                                |
| 3a. waitlist | `cta_waitlist_submit` / `cta_notify_submit` → **`notify_signup_success`**                                      | click / **server**                | the server event only counts real signups (same guard as the listmonk write) |
| 3b. qualify  | `book_step_next` (`step`) → `book_submit` → **`book_qualified`** / **`book_disqualified`** (`stage`, `budget`) | click / **server**                | server events skip honeypot, time-trap and the e2e address                   |
| 4. booked    | `book_qualified_booking_click` → cal.com booking                                                               | click / Studio `/api/cal` webhook | the booking itself lives in Studio's leads pipeline, not Umami               |

Bold events are the conversions. They fire from the server with the visitor's
IP + user agent in the payload, so Umami puts them in the same session as the
pageview that carried the UTMs. That's what makes "signups by source" readable
(Umami → Attribution, or a Funnel report: `/` → `book_submit` → `book_qualified`).

## tag every link you send

Most pushes are DMs and email, and those arrive with no referrer (the LinkedIn
app strips it). Untagged, they all read as "direct". Tag them:

| param          | values                                                |
| -------------- | ----------------------------------------------------- |
| `utm_source`   | `dm`, `email`, `pyre`, `referral`, `x`                |
| `utm_medium`   | `dm`, `newsletter`, `podcast`, `social`               |
| `utm_campaign` | the push: `outreach-2026-10`, `ep4`, `waitlist-reply` |
| `utm_content`  | optional placement: `bio`, `shownotes`, `clip-<slug>` |

Example: `https://sixtom.com/?utm_source=dm&utm_medium=dm&utm_campaign=outreach-2026-10`

Lowercase, hyphens, no spaces. pyre links keep pyre's own convention
(`utm_campaign=ep<N>`).

## known blind spots

- **Booked calls** aren't in Umami: read them from Studio's leads (cal.com webhook).
- **Teardown starts** happen by email reply: count them in the inbox.
- **Dark social** (a forwarded link, a podcast mention) shows as direct even when
  tagged links exist. Ask on the intro call how they found you.

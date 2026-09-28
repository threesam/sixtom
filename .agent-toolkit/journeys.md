# journeys

App: `pnpm build && pnpm preview --port 4173` (SvelteKit, http://localhost:4173). Set
`CONTACT_FORM_TEST_EMAIL=e2e@test.sixtom.local` in the server env before driving journeys 1 and 4 —
the forms must never hit SMTP or Listmonk with a real address (the /notify action
skips Listmonk for the test email; processSubmission skips SMTP for it).

Assertions pin structure (routes, `data-umami-event` hooks, form ids), not marketing copy —
the hero/offer copy changes often; the funnel shape shouldn't.

## 1. land → join the waitlist

1. Open `/`. Expect: exactly one h1; CTAs `cta_hero_waitlist` and `cta_hero_teardown` both point at `#waitlist`.
2. Click `cta_hero_waitlist`. Expect: `#waitlist-email` is in view.
3. Fill `#waitlist-email` with e2e@test.sixtom.local and `#waitlist-build` with any text; submit.
4. Expect: navigation to `/notify?/notify` (the named-action URL — no redirect) showing "You're on the list." No console errors, no failed network requests anywhere in the journey.

## 2. the tax loop

1. Open `/tax`. Expect h1 "what's it costing you?" and a non-$0 figure with default inputs; changing the goal radio changes the figure.
2. Click `cta_calc_book`. Expect `/book` step 1 ("where are you with this thing?") renders. No console errors.

## 3. faq → book

1. Open `/faq`. Expect: at least 10 questions (`dt`) rendered.
2. Click `cta_faq_book`. Expect `/book` step 1 renders. No console errors.

## 4. book wizard (keyboard)

1. Open `/book`. Pick a team stage with the keyboard, press "next →". Expect focus on the step 2 heading.
2. Fill the three step-2 fields, "next →". Expect focus on the step 3 heading; "← back" returns focus to the step 2 heading.
3. Fill name, email e2e@test.sixtom.local, company url; submit. Expect the "qualified" panel with a "book the call" link to cal.com, and focus on its message.
4. Reload `/book`, pick "solo". Expect the "not yet" panel with focus on its message; "i picked the wrong one" returns to step 1 with focus on its heading.

## 5. 404

1. Open `/definitely-not-a-page`. Expect status 404, h1 "nothing here.", a `<title>`, and `error_back_home` linking to `/`.

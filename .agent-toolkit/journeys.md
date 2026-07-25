# journeys

App: `pnpm build && pnpm preview --port 4173` (SvelteKit, http://localhost:4173). Set
`CONTACT_FORM_TEST_EMAIL=e2e@test.sixtom.local` in the server env before driving journey 1 —
the waitlist form must never hit SMTP or Listmonk with a real address (the /notify action
skips Listmonk for the test email; processSubmission skips SMTP for it).

## 1. land → read the offer → join the waitlist

1. Open `/`. Expect: h1 "the demo works. production doesn't.", chip "1 client a month · waitlist open", stat "day 10 or free".
2. Scroll through wall → ledger → guarantee → proof. Expect: ledger shows "total value" of "$28,500+" and a pay line containing "$10,000"; guarantee headline contains "day 10"; proof tiles include "+185%".
3. Fill `#waitlist-email` with e2e@test.sixtom.local and `#waitlist-build` with any text; submit.
4. Expect: navigation to `/notify` showing "You're on the list." No console errors, no failed network requests anywhere in the journey.

## 2. the tax loop

1. Open `/`, click the "run yours →" link in the wall section.
2. On `/tax`: expect h1 "what's it costing you?" and a non-$0 annual tax figure with default inputs; changing the goal radio changes the figure.
3. Click the calculator CTA "see if i can help" (event `cta_calc_book`). Expect `/book` step 1 ("where are you with this thing?") renders. No console errors.

## 3. faq → book

1. Open `/faq`. Expect: 11 questions rendered, one containing "day 10" (the guarantee answer), zero mentions of "$1,500" or "retainer".
2. Click the BookCta. Expect `/book` step 1 renders. No console errors.

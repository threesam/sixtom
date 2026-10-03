import { describe, it, expect } from 'vitest'
import { site, calEvent, grandSlam, FAQ, LEDGER_TOTAL_USD } from './index'

describe('content', () => {
	// The price floor (vault, 2026-09-23): $15k engagement, $1.5k teardown.
	// Prices hold or rise, so a lower number here is a regression, not an edit.
	it('site exports the operator + the price floor (audit and retainer are gone)', () => {
		expect(site.operator.name).toBe("Salvatore D'Angelo")
		expect(site.engagement.priceUSD).toBeGreaterThanOrEqual(15000)
		expect(site.teardown.priceUSD).toBeGreaterThanOrEqual(1500)
		expect('sprint' in site).toBe(false)
		expect(site.bookingUrl).toMatch(/^https?:\/\//)
		expect('audit' in site).toBe(false)
		expect('retainer' in site).toBe(false)
	})

	// The teardown price is written out in prose on several surfaces (FAQ, llms.txt,
	// terms) the way the sprint price already is, so changing site.ts alone would
	// leave them quietly disagreeing about what a teardown costs.
	it('the FAQ quotes the current teardown price', () => {
		const answer = FAQ.find((qa) => qa.question.includes('teardown'))?.answer ?? ''
		expect(answer).toContain(`$${site.teardown.priceUSD.toLocaleString('en-US')}`)
		expect(answer).toContain(site.teardown.creditNote)
	})

	it('ledger line values sum to the advertised total', () => {
		const sum = grandSlam.ledger.groups
			.flatMap((g) => g.lines)
			.reduce((acc, l) => acc + (l.valueUSD ?? 0), 0)
		expect(sum).toBe(28000)
		expect(LEDGER_TOTAL_USD).toBe(sum)
	})

	it('pay parts derive from engagement pricing, with nothing discounted', () => {
		const parts = grandSlam.ledger.payParts
		expect(parts[0]?.text).toBe('$15,000 fixed.')
		expect(parts.some((p) => p.struck)).toBe(false)
	})

	it('guarantee is the day-10 promise', () => {
		expect(grandSlam.guarantee.headline).toContain('day 10')
		expect(grandSlam.guarantee.headline).toContain('free')
	})

	it('results over mechanism: no "agent" anywhere in customer-facing offer copy', () => {
		expect(JSON.stringify(grandSlam).toLowerCase()).not.toContain('agent')
	})

	it('honest at zero: no slot counters in the copy', () => {
		expect(JSON.stringify(grandSlam)).not.toMatch(/\bof 3 left\b|\bslots? left\b/i)
	})

	it('calEvent has the fields the sync script needs', () => {
		expect(calEvent.title).toBeTruthy()
		expect(calEvent.slug).toBeTruthy()
		expect(calEvent.durationMinutes).toBeGreaterThan(0)
		expect(calEvent.description).toBeTruthy()
		expect(calEvent.intakeQuestions.length).toBeGreaterThan(0)
	})
})

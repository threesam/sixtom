import { describe, it, expect } from 'vitest'
import { site, calEvent, grandSlam, LEDGER_TOTAL_USD } from './index'

describe('content', () => {
	it('site exports the operator + sprint (audit and retainer are gone)', () => {
		expect(site.operator.name).toBe("Salvatore D'Angelo")
		expect(site.sprint.priceUSD).toBe(10000)
		expect(site.sprint.introPriceUSD).toBe(7500)
		expect(site.bookingUrl).toMatch(/^https?:\/\//)
		expect('audit' in site).toBe(false)
		expect('retainer' in site).toBe(false)
	})

	it('ledger line values sum to the advertised total', () => {
		const sum = grandSlam.ledger.groups
			.flatMap((g) => g.lines)
			.reduce((acc, l) => acc + (l.valueUSD ?? 0), 0)
		expect(sum).toBe(28500)
		expect(LEDGER_TOTAL_USD).toBe(sum)
	})

	it('pay parts derive from sprint pricing; the closed intro is struck', () => {
		const parts = grandSlam.ledger.payParts
		expect(parts.find((p) => p.text.includes('$10,000'))?.struck).toBeFalsy()
		expect(parts.find((p) => p.text.includes('4 weekly payments of $2,500'))?.struck).toBeFalsy()
		// The $7,500 first-3 window is closed (referral margin) — visible but struck.
		expect(parts.find((p) => p.text.includes('$7,500'))?.struck).toBe(true)
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

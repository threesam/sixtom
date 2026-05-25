import { describe, it, expect } from 'vitest'
import { site, calEvent } from './index'

describe('content', () => {
	it('site exports the operator + audit + sprint', () => {
		expect(site.operator.name).toBe("Salvatore D'Angelo")
		expect(site.audit.priceUSD).toBe(1500)
		expect(site.sprint.priceUSD).toBe(10000)
		expect(site.sprint.introPriceUSD).toBe(7500)
		expect(site.bookingUrl).toMatch(/^https?:\/\//)
	})

	it('calEvent has the fields the sync script needs', () => {
		expect(calEvent.title).toBeTruthy()
		expect(calEvent.slug).toBeTruthy()
		expect(calEvent.durationMinutes).toBeGreaterThan(0)
		expect(calEvent.description).toBeTruthy()
		expect(calEvent.intakeQuestions.length).toBeGreaterThan(0)
	})
})

import { describe, it, expect } from 'vitest'
import { site, calEvent } from './index'

describe('content', () => {
	it('site exports the operator and offer constants', () => {
		expect(site.operator.name).toBe("Sam D'Angelo")
		expect(site.offer.priceUSD).toBe(7500)
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

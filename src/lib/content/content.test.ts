import { describe, it, expect } from 'vitest'
import { corollaries, sprintQA, site, calEvent } from './index'

describe('content', () => {
	it('exports exactly 5 corollaries', () => {
		expect(corollaries).toHaveLength(5)
	})

	it('every corollary has a non-empty question and answer', () => {
		for (const c of corollaries) {
			expect(c.question).toBeTruthy()
			expect(c.answer).toBeTruthy()
		}
	})

	it('exports at least 8 sprint Q&A entries', () => {
		expect(sprintQA.length).toBeGreaterThanOrEqual(8)
	})

	it('every sprint Q&A has a non-empty question and answer', () => {
		for (const q of sprintQA) {
			expect(q.question).toBeTruthy()
			expect(q.answer).toBeTruthy()
		}
	})

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

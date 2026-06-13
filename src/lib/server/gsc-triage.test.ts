import { describe, it, expect } from 'vitest'
import { computeBuckets, type GscRow } from './gsc-triage'

const row = (keys: string[], position: number, impressions: number, clicks: number): GscRow => ({
	keys,
	position,
	impressions,
	clicks,
	ctr: impressions > 0 ? clicks / impressions : 0
})

describe('computeBuckets', () => {
	it('puts position 11–20 queries in pageTwoClimbers, sorted by impressions desc', () => {
		const rows = [
			row(['low impr p15'], 15, 50, 1),
			row(['high impr p12'], 12, 500, 5),
			row(['p10 not a climber'], 10, 100, 10),
			row(['p21 page 3'], 21, 200, 0)
		]
		const { pageTwoClimbers } = computeBuckets(rows, new Set())
		expect(pageTwoClimbers.map((r) => r.keys[0])).toEqual(['high impr p12', 'low impr p15'])
	})

	it('identifies top-10 queries with below-median CTR, excluding zero-impression noise', () => {
		const rows = [
			row(['p3 ctr 50%'], 3, 100, 50),
			row(['p5 ctr 10%'], 5, 100, 10),
			row(['p7 ctr 1%'], 7, 100, 1),
			row(['p2 ctr 80%'], 2, 100, 80),
			row(['zero impr'], 4, 0, 0)
		]
		const keys = computeBuckets(rows, new Set()).lowCtrTopTen.map((r) => r.keys[0])
		expect(keys).toContain('p7 ctr 1%')
		expect(keys).toContain('p5 ctr 10%')
		expect(keys).not.toContain('p2 ctr 80%')
		expect(keys).not.toContain('zero impr')
	})

	it('flags queries whose tokens do not overlap with known titles', () => {
		const known = new Set(['sixtom', 'audit', 'sprint'])
		const rows = [
			row(['vibe coding production'], 8, 100, 5), // no overlap → off-target
			row(['sixtom audit pricing'], 5, 100, 10), // overlap on sixtom + audit
			row(['kubernetes deploy'], 25, 100, 0), // no overlap → off-target, pos 25 ok
			row(['x'], 12, 100, 0) // x is below TOKEN_MIN, treated as no tokens → off-target
		]
		const keys = computeBuckets(rows, known).offTargetQueries.map((r) => r.keys[0])
		expect(keys).toContain('vibe coding production')
		expect(keys).toContain('kubernetes deploy')
		expect(keys).not.toContain('sixtom audit pricing')
	})

	it('off-target excludes very-low-impression noise (<5)', () => {
		const known = new Set<string>()
		const rows = [
			row(['rare query'], 15, 4, 0), // below 5-impr floor
			row(['real query'], 15, 5, 0) // meets 5-impr floor
		]
		const keys = computeBuckets(rows, known).offTargetQueries.map((r) => r.keys[0])
		expect(keys).toEqual(['real query'])
	})

	it('handles empty input without crashing', () => {
		const buckets = computeBuckets([], new Set())
		expect(buckets.pageTwoClimbers).toEqual([])
		expect(buckets.lowCtrTopTen).toEqual([])
		expect(buckets.offTargetQueries).toEqual([])
	})

	it('caps each bucket at 20 rows', () => {
		const rows: GscRow[] = []
		for (let i = 0; i < 50; i++) rows.push(row([`page-two ${String(i)}`], 12, 100 + i, 0))
		const { pageTwoClimbers } = computeBuckets(rows, new Set())
		expect(pageTwoClimbers).toHaveLength(20)
	})
})

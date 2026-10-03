import { beforeEach, describe, expect, it, vi } from 'vitest'
import { processSubmission } from '$lib/server/contact-form'
import { subscribeToList } from '$lib/server/listmonk'
import { fireServerEvent } from '$lib/server/umami'
import { actions as notifyActions } from './notify/+page.server'
import { actions as bookActions } from './book/+page.server'
import { BUDGET_OPTIONS, DISQUALIFY_STAGE, STAGE_OPTIONS } from './book/options'

// Conversion events must only count real visitors. Honeypot/time-trap fakes
// (and the e2e address) get ok + suspicious, a silent 200 by design; when the
// signup event fired outside that guard it logged 41 signups against 3 real
// subscribers over 30d. These drive the actual actions, not the source text.
vi.mock('$lib/server/contact-form', () => ({
	MAX_REQUEST_BYTES: 20_000,
	processSubmission: vi.fn()
}))
vi.mock('$lib/server/listmonk', () => ({
	SIXTOM_LIST_UUID: 'list',
	subscribeToList: vi.fn(() => Promise.resolve(true))
}))
vi.mock('$lib/server/umami', () => ({ fireServerEvent: vi.fn() }))

const submission = vi.mocked(processSubmission)
const real = { ok: true, message: 'ok' } as const
const fake = { ok: true, message: 'ok', suspicious: true } as const

function post(path: string, fields: Record<string, string>) {
	const request = new Request(`https://sixtom.com${path}`, {
		method: 'POST',
		headers: { 'content-length': '100' },
		body: new URLSearchParams(fields)
	})
	return { request, getClientAddress: () => '203.0.113.7' } as never
}

const stage = STAGE_OPTIONS.find((o) => o.value !== DISQUALIFY_STAGE)?.value ?? ''
const budget = BUDGET_OPTIONS[0].value
const bookFields = (s: string) => ({
	name: 'Ada',
	email: 'ada@example.com',
	built: 'ops',
	stage: s,
	deliverable: 'the weekly report runs itself',
	budget,
	company_url: 'example.com'
})

beforeEach(() => vi.clearAllMocks())

describe('notify_signup_success', () => {
	it('fires for a real signup (even if listmonk is down: they still signed up)', async () => {
		submission.mockResolvedValueOnce(real)
		vi.mocked(subscribeToList).mockResolvedValueOnce(false)
		await notifyActions.notify(post('/notify', { email: ' ada@example.com ' }))
		expect(subscribeToList).toHaveBeenCalledWith('ada@example.com', 'list')
		expect(fireServerEvent).toHaveBeenCalledWith('notify_signup_success', expect.anything())
	})

	it('stays silent for fakes, and keeps them off the list', async () => {
		submission.mockResolvedValueOnce(fake)
		await notifyActions.notify(post('/notify', { email: 'bot@example.com' }))
		expect(subscribeToList).not.toHaveBeenCalled()
		expect(fireServerEvent).not.toHaveBeenCalled()
	})
})

describe('/book outcome events', () => {
	it('fires book_qualified with stage + budget for a real lead', async () => {
		submission.mockResolvedValueOnce(real)
		await bookActions.default(post('/book', bookFields(stage)))
		expect(fireServerEvent).toHaveBeenCalledWith('book_qualified', expect.anything(), {
			stage,
			budget
		})
	})

	it('fires book_disqualified for the solo stage', async () => {
		submission.mockResolvedValueOnce(real)
		await bookActions.default(post('/book', bookFields(DISQUALIFY_STAGE)))
		expect(fireServerEvent).toHaveBeenCalledWith('book_disqualified', expect.anything(), {
			stage: DISQUALIFY_STAGE,
			budget
		})
	})

	it('stays silent for fakes', async () => {
		submission.mockResolvedValueOnce(fake)
		await bookActions.default(post('/book', bookFields(stage)))
		expect(fireServerEvent).not.toHaveBeenCalled()
	})
})

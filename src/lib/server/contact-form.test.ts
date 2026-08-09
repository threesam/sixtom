import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { RequestEvent } from '@sveltejs/kit'
import { processSubmission, resetRateLimitForTests } from './contact-form'

// hoisted so the spy is reachable from the tests; contact-form caches the
// transporter, so a fresh vi.fn() per createTransport call would be unobservable.
const { sendMail } = vi.hoisted(() => ({
	// typed param so mock.calls carries the mail shape rather than an empty tuple.
	// nodemailer's sendMail returns a promise, so resolve one without an await.
	sendMail: vi.fn((mail: { to: string; subject: string; text: string }) => {
		void mail
		return Promise.resolve(undefined)
	})
}))

vi.mock('nodemailer', () => ({
	default: {
		createTransport: () => ({ sendMail })
	}
}))

interface MockEventOptions {
	headers?: Record<string, string>
	ip?: string
}

function mockEvent({ headers = {}, ip = '127.0.0.1' }: MockEventOptions = {}): Pick<
	RequestEvent,
	'request' | 'getClientAddress'
> {
	const headerMap = new Map<string, string>(
		Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
	)
	const request = {
		headers: { get: (k: string) => headerMap.get(k.toLowerCase()) ?? null }
	} as unknown as Request
	return {
		request,
		getClientAddress: () => ip
	}
}

function makeFormData(overrides: Partial<Record<string, string>> = {}): FormData {
	const fd = new FormData()
	const fields: Record<string, string> = {
		name: 'Real Person',
		email: 'real@example.com',
		message: 'Heads-up please',
		formStartedAt: String(Date.now() - 10_000),
		enhanced: '1',
		...overrides
	}
	for (const [k, v] of Object.entries(fields)) fd.set(k, v)
	return fd
}

describe('processSubmission — protection layers', () => {
	beforeEach(() => {
		resetRateLimitForTests()
		sendMail.mockClear()
	})

	it('rejects missing required fields', async () => {
		const result = await processSubmission(makeFormData({ name: '' }), mockEvent())
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.status).toBe(400)
	})

	it('rejects malformed email', async () => {
		const result = await processSubmission(makeFormData({ email: 'not-an-email' }), mockEvent())
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.status).toBe(400)
	})

	it('rejects header injection (CRLF in email)', async () => {
		const result = await processSubmission(
			makeFormData({ email: 'evil@example.com\r\nBcc: leak@evil.com' }),
			mockEvent()
		)
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.status).toBe(400)
	})

	it('rejects oversized fields', async () => {
		const result = await processSubmission(makeFormData({ name: 'a'.repeat(200) }), mockEvent())
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.status).toBe(400)
	})

	it('silently 200s when honeypot is filled', async () => {
		const result = await processSubmission(
			makeFormData({ company: 'AcmeCorp' }),
			mockEvent({ ip: '10.0.0.1' })
		)
		expect(result.ok).toBe(true)
	})

	describe('time-trap (gated on enhanced=1)', () => {
		it('silently 200s when enhanced + submitted before the time-trap window', async () => {
			const result = await processSubmission(
				makeFormData({ enhanced: '1', formStartedAt: String(Date.now()) }),
				mockEvent({ ip: '10.0.0.2' })
			)
			expect(result.ok).toBe(true)
		})

		it('silently 200s when enhanced + formStartedAt is missing', async () => {
			const result = await processSubmission(
				makeFormData({ enhanced: '1', formStartedAt: '' }),
				mockEvent({ ip: '10.0.0.3' })
			)
			expect(result.ok).toBe(true)
		})

		it('SENDS when enhancement never loaded (no `enhanced` flag) — real visitor protection', async () => {
			// This is the CRITICAL behavior change: with the lazy script blocked
			// or racing, a real visitor must still get their email sent rather
			// than getting a silent fake-success.
			const result = await processSubmission(
				makeFormData({ enhanced: '', formStartedAt: '' }),
				mockEvent({ ip: '10.0.0.4' })
			)
			expect(result.ok).toBe(true)
			if (result.ok) expect(result.message).toMatch(/list/i)
		})
	})

	it('rate-limits after the configured number of valid submissions per IP', async () => {
		const ip = '10.0.0.99'
		for (let i = 0; i < 5; i++) {
			const ok = await processSubmission(makeFormData(), mockEvent({ ip }))
			expect(ok.ok).toBe(true)
		}
		const limited = await processSubmission(makeFormData(), mockEvent({ ip }))
		expect(limited.ok).toBe(false)
		if (!limited.ok) expect(limited.status).toBe(429)
	})

	it('falls back to x-forwarded-for header when getClientAddress is unavailable', async () => {
		const event = mockEvent({ headers: { 'x-forwarded-for': '203.0.113.7, 70.41.3.18' } })
		;(event as { getClientAddress: () => string }).getClientAddress = () => {
			throw new Error('not available')
		}
		const result = await processSubmission(makeFormData(), event)
		expect(result.ok).toBe(true)
	})

	it('bypasses SMTP when email matches CONTACT_FORM_TEST_EMAIL env var', async () => {
		const { env } = await import('$env/dynamic/private')
		const original = env['CONTACT_FORM_TEST_EMAIL']
		env['CONTACT_FORM_TEST_EMAIL'] = 'e2e@test.sixtom.local'
		try {
			const result = await processSubmission(
				makeFormData({ email: 'e2e@test.sixtom.local' }),
				mockEvent({ ip: '10.0.0.51' })
			)
			expect(result.ok).toBe(true)
		} finally {
			env['CONTACT_FORM_TEST_EMAIL'] = original
		}
	})

	describe('waitlist submissions', () => {
		function sentMail() {
			return sendMail.mock.calls.map(([mail]) => mail)
		}

		it('sends the waitlist confirmation rather than the generic contact ack', async () => {
			await processSubmission(makeFormData({ name: 'Waitlist signup' }), mockEvent(), 'waitlist')
			const toVisitor = sentMail().find((m) => m.to === 'real@example.com')
			expect(toVisitor?.subject).toContain('on the list')
			// the ask is the whole gate: no reply, no work
			expect(toVisitor?.text).toContain('reply')
			expect(toVisitor?.text).not.toContain('Contact form submission received')
		})

		it('offers more than one way to show the app', async () => {
			// Most of this audience has no public URL to paste — localhost, behind
			// auth, or never deployed. A URL-only ask is unanswerable for them and
			// they go quiet, which is the exact drop-off the reply-gate exists to
			// prevent. Narrowing this copy back to one artifact is a regression.
			await processSubmission(makeFormData({ name: 'Waitlist signup' }), mockEvent(), 'waitlist')
			const body = sentMail().find((m) => m.to === 'real@example.com')?.text ?? ''
			expect(body).toContain('url')
			expect(body).toContain('repo')
			expect(body).toContain('recording')
		})

		it('makes the operator notification identifiable by address', async () => {
			// every waitlist signup hardcodes this name, so the subject cannot use it
			await processSubmission(makeFormData({ name: 'Waitlist signup' }), mockEvent(), 'waitlist')
			const toOperator = sentMail().find((m) => m.to !== 'real@example.com')
			expect(toOperator?.subject).toContain('real@example.com')
			expect(toOperator?.subject).not.toBe('Contact: Waitlist signup')
		})

		it('leaves the contact path unchanged', async () => {
			await processSubmission(makeFormData(), mockEvent())
			const toVisitor = sentMail().find((m) => m.to === 'real@example.com')
			expect(toVisitor?.subject).toBe('Contact SIXTOM')
		})
	})
})

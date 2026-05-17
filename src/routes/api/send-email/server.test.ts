import { describe, it, expect, vi } from 'vitest'
import type { RequestEvent } from './$types'
import { POST } from './+server'

// Mock nodemailer so any test that reaches the SMTP path runs without
// needing real SMTP credentials in the environment.
vi.mock('nodemailer', () => ({
	default: {
		createTransport: () => ({ sendMail: vi.fn().mockResolvedValue(undefined) })
	}
}))

interface MockEventOptions {
	body?: unknown
	rawBody?: string
	headers?: Record<string, string>
	ip?: string
}

function mockEvent({
	body,
	rawBody,
	headers = {},
	ip = '127.0.0.1'
}: MockEventOptions = {}): RequestEvent {
	const finalBody = rawBody ?? (body === undefined ? undefined : JSON.stringify(body))
	const headerMap = new Map<string, string>(
		Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
	)
	const request = {
		json: () =>
			finalBody === undefined
				? Promise.reject(new Error('no body'))
				: Promise.resolve(JSON.parse(finalBody) as unknown),
		headers: { get: (k: string) => headerMap.get(k.toLowerCase()) ?? null }
	} as unknown as Request
	return {
		request,
		getClientAddress: () => ip
	} as unknown as RequestEvent
}

const validForm = {
	name: 'Real Person',
	email: 'real@example.com',
	message: 'Heads-up please',
	formStartedAt: Date.now() - 10_000
}

describe('POST /api/send-email — protection layers', () => {
	it('rejects malformed JSON body', async () => {
		const res = await POST(mockEvent({ rawBody: 'not json' }))
		expect(res.status).toBe(400)
	})

	it('rejects oversized payloads via content-length before parsing', async () => {
		const res = await POST(
			mockEvent({
				rawBody: '{}',
				headers: { 'content-length': '50000' }
			})
		)
		expect(res.status).toBe(413)
	})

	it('rejects missing required fields', async () => {
		const res = await POST(mockEvent({ body: { name: 'a', email: 'x@y.z' } }))
		expect(res.status).toBe(400)
	})

	it('rejects malformed email', async () => {
		const res = await POST(
			mockEvent({
				body: { ...validForm, email: 'not-an-email', formStartedAt: validForm.formStartedAt }
			})
		)
		expect(res.status).toBe(400)
	})

	it('rejects header injection (CRLF in email)', async () => {
		const res = await POST(
			mockEvent({
				body: {
					...validForm,
					email: 'evil@example.com\r\nBcc: leak@evil.com',
					formStartedAt: validForm.formStartedAt
				}
			})
		)
		expect(res.status).toBe(400)
	})

	it('rejects oversized fields', async () => {
		const res = await POST(
			mockEvent({
				body: {
					...validForm,
					name: 'a'.repeat(200),
					formStartedAt: validForm.formStartedAt
				}
			})
		)
		expect(res.status).toBe(400)
	})

	it('silently 200s when honeypot field is filled', async () => {
		const res = await POST(
			mockEvent({
				body: {
					...validForm,
					company: 'AcmeCorp',
					formStartedAt: validForm.formStartedAt
				},
				ip: '10.0.0.1'
			})
		)
		expect(res.status).toBe(200)
		const data = (await res.json()) as { status: string }
		expect(data.status).toBe('Message sent successfully!')
	})

	it('silently 200s when submitted before the time-trap window', async () => {
		const res = await POST(
			mockEvent({
				body: { ...validForm, formStartedAt: Date.now() }, // submitted instantly
				ip: '10.0.0.2'
			})
		)
		expect(res.status).toBe(200)
	})

	it('silently 200s when formStartedAt is missing', async () => {
		const res = await POST(
			mockEvent({
				body: { name: 'Real Person', email: 'real@example.com', message: 'Heads-up please' },
				ip: '10.0.0.3'
			})
		)
		expect(res.status).toBe(200)
	})

	it('rate-limits after the configured number of valid submissions per IP', async () => {
		// Unique IP so other tests' counters don't interfere with the count.
		const ip = '10.0.0.99'
		const submit = () => POST(mockEvent({ body: validForm, ip }))

		// Default MAX is 5 per 60s window
		for (let i = 0; i < 5; i++) {
			const ok = await submit()
			expect(ok.status).toBe(200)
		}
		const limited = await submit()
		expect(limited.status).toBe(429)
	})

	it('falls back to x-forwarded-for header when getClientAddress is unavailable', async () => {
		const event = mockEvent({
			body: validForm,
			headers: { 'x-forwarded-for': '203.0.113.7, 70.41.3.18' }
		})
		// Strip getClientAddress so the header path is taken
		;(event as { getClientAddress?: () => string }).getClientAddress = () => {
			throw new Error('not available')
		}
		const res = await POST(event)
		expect(res.status).toBe(200)
	})
})

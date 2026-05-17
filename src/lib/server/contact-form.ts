import nodemailer, { type Transporter } from 'nodemailer'
import { env } from '$env/dynamic/private'
import type { RequestEvent } from '@sveltejs/kit'

export const MAX_NAME_LENGTH = 120
export const MAX_EMAIL_LENGTH = 254
export const MAX_MESSAGE_LENGTH = 5000
export const MAX_REQUEST_BYTES = 20_000

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_MIN_SUBMIT_MS = 3000
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000
const DEFAULT_MAX_REQUESTS_PER_WINDOW = 5
const RATE_LIMIT_SWEEP_AT = 10_000

function parsePositiveNumber(value: string | undefined, fallback: number): number {
	const parsedValue = Number(value)
	return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback
}

const MIN_SUBMIT_MS = parsePositiveNumber(env.CONTACT_FORM_MIN_SUBMIT_MS, DEFAULT_MIN_SUBMIT_MS)
const RATE_LIMIT_WINDOW_MS = parsePositiveNumber(
	env.CONTACT_FORM_RATE_LIMIT_WINDOW_MS,
	DEFAULT_RATE_LIMIT_WINDOW_MS
)
const RATE_LIMIT_MAX_REQUESTS = parsePositiveNumber(
	env.CONTACT_FORM_RATE_LIMIT_MAX_REQUESTS,
	DEFAULT_MAX_REQUESTS_PER_WINDOW
)

const requestLog = new Map<string, number[]>()

export function resetRateLimitForTests(): void {
	requestLog.clear()
}

function getClientIp(event: Pick<RequestEvent, 'request' | 'getClientAddress'>): string {
	try {
		const addr = event.getClientAddress()
		if (addr) return addr
	} catch {
		// fall through to header parsing
	}
	const forwardedFor = event.request.headers.get('x-forwarded-for')
	if (forwardedFor) {
		return forwardedFor.split(',')[0]?.trim() ?? 'unknown'
	}
	const realIp = event.request.headers.get('x-real-ip')
	if (realIp) {
		return realIp.trim()
	}
	return 'unknown'
}

function sweepRateLimit(now: number): void {
	for (const [key, timestamps] of requestLog) {
		const fresh = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
		if (fresh.length === 0) requestLog.delete(key)
		else requestLog.set(key, fresh)
	}
}

function isRateLimited(ip: string): boolean {
	const now = Date.now()
	if (requestLog.size > RATE_LIMIT_SWEEP_AT) sweepRateLimit(now)
	const recentAttempts =
		requestLog.get(ip)?.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS) ?? []
	recentAttempts.push(now)
	requestLog.set(ip, recentAttempts)
	return recentAttempts.length > RATE_LIMIT_MAX_REQUESTS
}

function hasHeaderInjection(value: string): boolean {
	return /[\r\n]/.test(value)
}

export type SubmissionResult =
	| { ok: true; message: string }
	| { ok: false; status: number; message: string }

export const SUCCESS_MESSAGE = "You're on the list."

// Honeypot + time-trap silently 200 so attackers can't learn which layer filtered them.
function suspicious(): SubmissionResult {
	return { ok: true, message: SUCCESS_MESSAGE }
}

let cachedTransporter: Transporter | null = null
function getTransporter(): Transporter {
	cachedTransporter ??= nodemailer.createTransport({
		host: env.SMTP_SERVER,
		port: parsePositiveNumber(env.SMTP_PORT, 587),
		secure: false,
		requireTLS: true,
		tls: { minVersion: 'TLSv1.2' },
		auth: { user: env.SMTP_EMAIL, pass: env.SMTP_TOKEN }
	})
	return cachedTransporter
}

export async function processSubmission(
	formData: FormData,
	event: Pick<RequestEvent, 'request' | 'getClientAddress'>
): Promise<SubmissionResult> {
	function readString(field: string): string {
		const value = formData.get(field)
		return typeof value === 'string' ? value : ''
	}

	const name = readString('name').trim()
	const email = readString('email').trim()
	const message = readString('message').trim()
	const company = readString('company')
	const enhanced = readString('enhanced') === '1'
	const formStartedAtRaw = readString('formStartedAt')
	const formStartedAt = formStartedAtRaw !== '' ? Number(formStartedAtRaw) : undefined

	if (!name || !email || !message) {
		return { ok: false, status: 400, message: 'Missing required fields.' }
	}

	if (
		name.length > MAX_NAME_LENGTH ||
		email.length > MAX_EMAIL_LENGTH ||
		message.length > MAX_MESSAGE_LENGTH ||
		!EMAIL_REGEX.test(email) ||
		hasHeaderInjection(name) ||
		hasHeaderInjection(email)
	) {
		return { ok: false, status: 400, message: 'Invalid form submission.' }
	}

	if (company.trim() !== '') return suspicious()

	// Time-trap only runs when the lazy enhancement script set `enhanced=1`.
	// Real visitors whose JS failed to load (ad-blockers, defer race, blocked CSP)
	// would otherwise get a silent 200 with no email sent — which is worse than
	// skipping this single layer and relying on honeypot + rate-limit + validation.
	if (enhanced) {
		if (typeof formStartedAt !== 'number' || Number.isNaN(formStartedAt)) return suspicious()
		if (Date.now() - formStartedAt < MIN_SUBMIT_MS) return suspicious()
	}

	const clientIp = getClientIp(event)
	if (isRateLimited(clientIp)) {
		return { ok: false, status: 429, message: 'Too many requests. Please try again shortly.' }
	}

	// E2E bypass; env var unset in production, exact-match comparison.
	const testEmailRaw = env.CONTACT_FORM_TEST_EMAIL
	const testEmail = typeof testEmailRaw === 'string' ? testEmailRaw.trim() : ''
	if (testEmail !== '' && email === testEmail) {
		return { ok: true, message: SUCCESS_MESSAGE }
	}

	const transporter = getTransporter()
	const confirmation = {
		from: env.SMTP_EMAIL,
		to: email,
		subject: `Contact sixtom`,
		text: 'Contact form submission received! We look forward to talking to you soon.'
	}
	const notification = {
		from: env.SMTP_EMAIL,
		to: env.SMTP_RECIPIENT_EMAIL,
		replyTo: email,
		subject: `Contact: ${name}`,
		text: message
	}

	try {
		await Promise.all([transporter.sendMail(confirmation), transporter.sendMail(notification)])
		return { ok: true, message: SUCCESS_MESSAGE }
	} catch (error) {
		console.error('send-email failed:', error instanceof Error ? error.message : 'unknown')
		return { ok: false, status: 500, message: 'Error sending message. Please try again later.' }
	}
}

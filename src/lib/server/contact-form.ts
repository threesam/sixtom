import nodemailer from 'nodemailer'
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

// Visible for tests so each describe block can isolate its IP counters.
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

function isRateLimited(ip: string): boolean {
	const now = Date.now()
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

function suspicious(message: string): SubmissionResult {
	// Honeypot + time-trap both look successful to bots — they shouldn't learn
	// the form is filtering them.
	return { ok: true, message }
}

interface ProcessOptions {
	skipSend?: boolean
}

/**
 * Validates and (if all layers pass) sends the contact email. Returns a
 * uniform result the caller can map to either a form-action response or a
 * raw HTTP JSON response.
 *
 * Bot-protection layer order matters — honeypot + time-trap return a silent
 * success so attackers can't learn the form is filtering them.
 */
export async function processSubmission(
	formData: FormData,
	event: Pick<RequestEvent, 'request' | 'getClientAddress'>,
	options: ProcessOptions = {}
): Promise<SubmissionResult> {
	const declaredLength = Number(event.request.headers.get('content-length'))
	if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
		return { ok: false, status: 413, message: 'Payload too large.' }
	}

	function readString(field: string): string {
		const value = formData.get(field)
		return typeof value === 'string' ? value : ''
	}

	const name = readString('name').trim()
	const email = readString('email').trim()
	const message = readString('message').trim()
	const company = readString('company')
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

	// Honeypot: a filled `company` means a bot auto-completed every visible field.
	if (company.trim() !== '') {
		return suspicious("You're on the list.")
	}

	// Time-trap: enforced only when the client provided a timestamp (the lazy
	// enhancement script writes it on page load). Submissions without one are
	// also treated as suspicious — most scrapers don't execute deferred JS.
	if (typeof formStartedAt !== 'number' || Number.isNaN(formStartedAt)) {
		return suspicious("You're on the list.")
	}
	if (Date.now() - formStartedAt < MIN_SUBMIT_MS) {
		return suspicious("You're on the list.")
	}

	const clientIp = getClientIp(event)
	if (isRateLimited(clientIp)) {
		return { ok: false, status: 429, message: 'Too many requests. Please try again shortly.' }
	}

	if (options.skipSend) {
		return { ok: true, message: "You're on the list." }
	}

	const transporter = nodemailer.createTransport({
		host: env.SMTP_SERVER,
		port: parsePositiveNumber(env.SMTP_PORT, 587),
		secure: false,
		requireTLS: true,
		tls: { minVersion: 'TLSv1.2' },
		auth: {
			user: env.SMTP_EMAIL,
			pass: env.SMTP_TOKEN
		}
	})

	const confirmationMailOptions = {
		from: env.SMTP_EMAIL,
		to: email,
		subject: `Contact sixtom`,
		text: 'Contact form submission received! We look forward to talking to you soon.'
	}
	const mailOptions = {
		from: env.SMTP_EMAIL,
		to: env.SMTP_RECIPIENT_EMAIL,
		replyTo: email,
		subject: `Contact: ${name}`,
		text: message
	}

	try {
		await transporter.sendMail(confirmationMailOptions)
		await transporter.sendMail(mailOptions)
		return { ok: true, message: "You're on the list." }
	} catch (error) {
		console.error('send-email failed:', error instanceof Error ? error.message : 'unknown')
		return { ok: false, status: 500, message: 'Error sending message. Please try again later.' }
	}
}

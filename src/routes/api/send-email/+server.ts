import nodemailer from 'nodemailer'
import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import type { RequestEvent } from './$types'

interface ContactForm {
	name: string
	email: string
	message: string
	company?: string
	formStartedAt?: number
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME_LENGTH = 120
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 5000
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

function getClientIp(event: RequestEvent): string {
	const forwardedFor = event.request.headers.get('x-forwarded-for')
	if (forwardedFor) {
		return forwardedFor.split(',')[0]?.trim() ?? 'unknown'
	}

	const realIp = event.request.headers.get('x-real-ip')
	if (realIp) {
		return realIp.trim()
	}

	try {
		return event.getClientAddress()
	} catch {
		return 'unknown'
	}
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

function isSuspiciousSubmission(form: Partial<Record<keyof ContactForm, unknown>>): boolean {
	if (typeof form.company === 'string' && form.company.trim() !== '') {
		return true
	}

	if (typeof form.formStartedAt !== 'number') {
		return true
	}

	if (Date.now() - form.formStartedAt < MIN_SUBMIT_MS) {
		return true
	}

	return false
}

export async function POST(event: RequestEvent) {
	let form: Partial<Record<keyof ContactForm, unknown>>
	try {
		form = (await event.request.json()) as Partial<Record<keyof ContactForm, unknown>>
	} catch {
		return json({ status: 'Invalid request payload.' }, { status: 400 })
	}

	const name = typeof form.name === 'string' ? form.name.trim() : ''
	const email = typeof form.email === 'string' ? form.email.trim() : ''
	const message = typeof form.message === 'string' ? form.message.trim() : ''

	if (!name || !email || !message) {
		return json({ status: 'Missing required fields.' }, { status: 400 })
	}

	if (
		name.length > MAX_NAME_LENGTH ||
		email.length > MAX_EMAIL_LENGTH ||
		message.length > MAX_MESSAGE_LENGTH ||
		!EMAIL_REGEX.test(email) ||
		hasHeaderInjection(name) ||
		hasHeaderInjection(email)
	) {
		return json({ status: 'Invalid form submission.' }, { status: 400 })
	}

	if (isSuspiciousSubmission(form)) {
		return json({ status: 'Message sent successfully!' })
	}

	const clientIp = getClientIp(event)
	if (isRateLimited(clientIp)) {
		return json({ status: 'Too many requests. Please try again shortly.' }, { status: 429 })
	}

	const transporter = nodemailer.createTransport({
		host: env.SMTP_SERVER,
		port: parsePositiveNumber(env.SMTP_PORT, 587),
		secure: false,
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

		return json({
			status: 'Message sent successfully!'
		})
	} catch (error) {
		console.error('Error sending email:', error)
		return json(
			{
				status: 'Error sending message. Please try again later.'
			},
			{ status: 500 }
		)
	}
}

import nodemailer from 'nodemailer'
import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

// Simple in-memory deduplication within a short time window
const submissionCache = new Map<string, number>()
const DEDUPE_WINDOW_MS = 30_000 // 30 seconds

function makeKey(name: string, email: string, message: string) {
    return `${email.trim().toLowerCase()}|${name.trim()}|${message.trim()}`
}

function isDuplicateAndRecord(key: string): boolean {
    const now = Date.now()
    const last = submissionCache.get(key)
    if (last && now - last < DEDUPE_WINDOW_MS) {
        return true
    }
    submissionCache.set(key, now)
    return false
}

// Define types for incoming request body
interface ContactForm {
    name: string
    email: string
    message: string
    website?: string // honeypot
}

export async function POST({ request }: { request: Request }) {
    const { name, email, message, website }: ContactForm = await request.json()

    // Honeypot check: if filled, pretend success without sending
    if (website && website.trim() !== '') {
        return json({ status: 'Message sent successfully!' })
    }

    // Short-window dedupe to prevent multiple sends from accidental double submit
    const key = makeKey(name ?? '', email ?? '', message ?? '')
    if (isDuplicateAndRecord(key)) {
        return json({ status: 'Message sent successfully!' })
    }

	// Create the transporter object using Gmail's SMTP service (or other SMTP server)
	const transporter = nodemailer.createTransport({
		host: env.SMTP_SERVER,
		port: env.SMTP_PORT,
		secure: false,
		auth: {
			user: env.SMTP_EMAIL,
			pass: env.SMTP_TOKEN
		}
	})

	// Email options
	const confirmationMailOptions = {
		from: env.SMTP_EMAIL,
		to: email,
		subject: `Contact sixtom`,
		text: 'Contact form submission received! We look forward to talking to you soon.'
	}

	// Email options
	const mailOptions = {
		from: env.SMTP_EMAIL,
		to: env.SMTP_RECIPIENT_EMAIL,
		replyTo: email,
		subject: `Contact: ${name}`,
		text: message
	}

    try {
		// Send the email
		await transporter.sendMail(confirmationMailOptions)
		await transporter.sendMail(mailOptions)

		return json({
			status: 'Message sent successfully!'
		})
    } catch (error) {
		console.error('Error sending email:', error)
        return json({ status: 'Error sending message. Please try again later.' }, { status: 500 })
	}
}

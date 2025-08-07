import nodemailer, { type TransportOptions } from 'nodemailer'
import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

// Define types for incoming request body
interface ContactForm {
	name: string
	email: string
	message: string
}

export async function POST({ request }: { request: Request }) {
	const { name, email, message }: ContactForm = await request.json()

	if (email === 'salvatoredangelo@protonmail.com') {
		return json({ status: 'Message spoofed successfully!' })
	}

	const host = env.SMTP_SERVER as string
	const port = Number(env.SMTP_PORT ?? 587)
	const user = env.SMTP_EMAIL as string
	const pass = env.SMTP_TOKEN as string

	// Create the transporter object using SMTP service
	const transporter = nodemailer.createTransport({
		host,
		port,
		secure: port === 465,
		auth: { user, pass }
	} as TransportOptions)

	// Email options
	const confirmationMailOptions = {
		from: user,
		to: email,
		subject: `Contact sixtom`,
		text: 'Contact form submission received! We look forward to talking to you soon.'
	}

	// Email options
	const mailOptions = {
		from: user,
		to: env.SMTP_RECIPIENT_EMAIL as string,
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
		return json(
			{
				status: 'Error sending message. Please try again later.'
			},
			{ status: 500 }
		)
	}
}

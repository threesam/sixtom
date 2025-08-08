import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
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

	// Create the transporter object using Gmail's SMTP service (or other SMTP server)
	const transporter = nodemailer.createTransport({
		host: env.SMTP_SERVER,
		port: Number(env.SMTP_PORT),
		secure: false,
		auth: {
			user: env.SMTP_EMAIL,
			pass: env.SMTP_TOKEN
		}
	} as SMTPTransport.Options)

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
		return json(
			{
				status: 'Error sending message. Please try again later.'
			},
			{ status: 500 }
		)
	}
}

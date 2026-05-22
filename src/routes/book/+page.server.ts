import { fail } from '@sveltejs/kit'
import { site } from '$lib/content'
import { MAX_REQUEST_BYTES, processSubmission } from '$lib/server/contact-form'
import type { Actions } from './$types'
import { BUDGET_OPTIONS, DISQUALIFY_STAGE, STAGE_OPTIONS } from './options'

function lookupLabel(
	options: ReadonlyArray<{ value: string; label: string }>,
	value: string
): string {
	return options.find((o) => o.value === value)?.label ?? value
}

function composeMessage(input: {
	built: string
	stage: string
	deliverable: string
	budget: string
	companyUrl: string
	disqualified: boolean
}): string {
	const lines = [
		input.disqualified ? '[stage = pre-build — auto-disqualified]' : null,
		`built: ${input.built}`,
		`stage: ${lookupLabel(STAGE_OPTIONS, input.stage)}`,
		`30-day must-be-true: ${input.deliverable}`,
		`budget: ${lookupLabel(BUDGET_OPTIONS, input.budget)}`,
		`company: ${input.companyUrl}`
	].filter((line): line is string => line !== null)
	return lines.join('\n\n')
}

// Hard-wire the booking origin so a future site.bookingUrl typo or env-driven
// override can't turn the qualified-lead success card into an open redirect.
const CAL_ORIGIN = 'https://cal.com'

function buildCalComUrl(input: { name: string; email: string; notes: string }): string {
	const url = new URL(site.bookingUrl)
	if (url.origin !== CAL_ORIGIN) {
		throw new Error(`booking URL must be on ${CAL_ORIGIN}, got ${url.origin}`)
	}
	url.searchParams.set('name', input.name)
	url.searchParams.set('email', input.email)
	url.searchParams.set('notes', input.notes)
	return url.toString()
}

export const actions = {
	default: async (event) => {
		const declaredLength = Number(event.request.headers.get('content-length'))
		if (!Number.isFinite(declaredLength) || declaredLength > MAX_REQUEST_BYTES) {
			return fail(413, { status: 'error' as const, message: 'Payload too large.' })
		}

		const formData = await event.request.formData()
		// Strip CRLF from single-line fields (and length-cap them) so they can't
		// fabricate extra "field: value" lines in the email body Sam reads.
		// Cap deliverable too so composedMessage stays under MAX_MESSAGE_LENGTH
		// (5000) — a wall of text in deliverable + built would silently 400.
		const stripNewlines = (s: string) => s.replace(/[\r\n]+/g, ' ').trim()
		const normalizeNewlines = (s: string) => s.replace(/\r\n/g, '\n').trim()

		const built = stripNewlines(String(formData.get('built') ?? '')).slice(0, 500)
		const stage = String(formData.get('stage') ?? '')
		const deliverable = normalizeNewlines(String(formData.get('deliverable') ?? '')).slice(0, 4000)
		const budget = String(formData.get('budget') ?? '')
		const companyUrl = stripNewlines(String(formData.get('company_url') ?? '')).slice(0, 500)

		const missing = !built || !stage || !deliverable || !budget || !companyUrl
		if (missing) {
			return fail(400, { status: 'error' as const, message: 'Missing required fields.' })
		}

		if (!STAGE_OPTIONS.some((o) => o.value === stage)) {
			return fail(400, { status: 'error' as const, message: 'Invalid stage.' })
		}
		if (!BUDGET_OPTIONS.some((o) => o.value === budget)) {
			return fail(400, { status: 'error' as const, message: 'Invalid budget.' })
		}

		const disqualified = stage === DISQUALIFY_STAGE
		const composedMessage = composeMessage({
			built,
			stage,
			deliverable,
			budget,
			companyUrl,
			disqualified
		})

		// processSubmission validates name/email/length/header-injection, runs
		// honeypot + rate-limit + time-trap, and sends both the notification
		// (to Sam) and the visitor confirmation. The booking form composes the
		// qualifying answers into `message` so it threads through unchanged.
		formData.set('message', composedMessage)

		const result = await processSubmission(formData, event)
		if (!result.ok) {
			return fail(result.status, { status: 'error' as const, message: result.message })
		}

		if (disqualified) {
			return {
				status: 'success' as const,
				disqualified: true,
				message:
					"sixtom is for people who've already built something with AI and need to make it production-grade. come back when you have a working demo and a thing that's not shipping — i'll be here."
			}
		}

		const bookingUrl = buildCalComUrl({
			name: String(formData.get('name') ?? '').trim(),
			email: String(formData.get('email') ?? '').trim(),
			notes: composedMessage
		})

		return {
			status: 'success' as const,
			disqualified: false,
			bookingUrl,
			message: "qualified. here's the booking link — i've pre-filled your context for the call."
		}
	}
} satisfies Actions

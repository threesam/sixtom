import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { MAX_REQUEST_BYTES, processSubmission } from '$lib/server/contact-form'
import { SIXTOM_LIST_UUID, subscribeToList } from '$lib/server/listmonk'
import { fireServerEvent } from '$lib/server/umami'

export const actions = {
	notify: async (event) => {
		// Reject oversized or unmeasured bodies before parsing them into memory.
		// A missing content-length is suspicious — every legitimate browser POST sets it.
		const declaredLength = Number(event.request.headers.get('content-length'))
		if (!Number.isFinite(declaredLength) || declaredLength > MAX_REQUEST_BYTES) {
			return fail(413, {
				status: 'error' as const,
				message: 'that was too much text. shorten it and try again.'
			})
		}

		const formData = await event.request.formData()
		const result = await processSubmission(formData, event, 'waitlist')

		if (result.ok) {
			// Bank the address in listmonk's `sixtom` list as well as the inbox,
			// but never for fakes (`suspicious`: honeypot, time-trap, e2e address),
			// or bots would poison the list through the silent-200 path.
			// Best-effort: a listmonk outage must not fail the promised signup.
			//
			// The analytics event belongs INSIDE this guard too. Outside it, fakes
			// counted as signups: 41 notify_signup_success events over 30d against
			// 3 real subscribers. It counts real signups, so a listmonk outage
			// still fires it: the person signed up and both emails went out.
			if (!result.suspicious) {
				const emailField = formData.get('email')
				const email = typeof emailField === 'string' ? emailField.trim() : ''
				await subscribeToList(email, SIXTOM_LIST_UUID)
				await fireServerEvent('notify_signup_success', event)
			}
			return { status: 'success' as const, message: result.message }
		}

		return fail(result.status, { status: 'error' as const, message: result.message })
	}
} satisfies Actions

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
			return fail(413, { status: 'error' as const, message: 'Payload too large.' })
		}

		const formData = await event.request.formData()
		const result = await processSubmission(formData, event)

		if (result.ok) {
			// Bank the address in listmonk's `sixtom` list as well as the inbox —
			// but never for honeypot/time-trap fakes (`suspicious`), or bots would
			// poison the list through the silent-200 path. Best-effort: a listmonk
			// outage must not fail the signup the visitor was just promised.
			const email = String(formData.get('email') ?? '').trim()
			if (!result.suspicious && email) {
				await subscribeToList(email, SIXTOM_LIST_UUID)
			}
			fireServerEvent('notify_signup_success', event.request)
			return { status: 'success' as const, message: result.message }
		}

		return fail(result.status, { status: 'error' as const, message: result.message })
	}
} satisfies Actions

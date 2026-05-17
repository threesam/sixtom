import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { MAX_REQUEST_BYTES, processSubmission } from '$lib/server/contact-form'
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
			fireServerEvent('notify_signup_success', event.request)
			return { status: 'success' as const, message: result.message }
		}

		return fail(result.status, { status: 'error' as const, message: result.message })
	}
} satisfies Actions

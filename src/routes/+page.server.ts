import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { processSubmission } from '$lib/server/contact-form'
import { fireServerEvent } from '$lib/server/umami'

export const actions = {
	notify: async (event) => {
		const formData = await event.request.formData()
		const result = await processSubmission(formData, event)

		if (result.ok) {
			fireServerEvent('notify_signup_success', event.request)
			return { status: 'success' as const, message: result.message }
		}

		return fail(result.status, { status: 'error' as const, message: result.message })
	}
} satisfies Actions

import type { UmamiEvent } from '$lib/types'

const UMAMI_ENDPOINT = 'https://analytics.sixtom.com/api/send'
const WEBSITE_ID = '64398c1a-02a0-4a61-991c-b0d143f01b46'
const HOSTNAME = 'sixtom.com'

// Fire-and-forget server-side Umami event. For signals that originate on the
// server (successful form submits) where the client may have JS disabled.
export function fireServerEvent(eventName: UmamiEvent, request: Request): void {
	const userAgent = request.headers.get('user-agent') ?? 'unknown'
	const referrer = request.headers.get('referer') ?? ''
	const language = request.headers.get('accept-language')?.split(',')[0] ?? 'en'
	const url = new URL(request.url).pathname

	fetch(UMAMI_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': userAgent
		},
		body: JSON.stringify({
			type: 'event',
			payload: {
				website: WEBSITE_ID,
				hostname: HOSTNAME,
				url,
				name: eventName,
				referrer,
				language
			}
		})
	}).catch(() => {
		// Analytics failures must not affect user-facing responses.
	})
}

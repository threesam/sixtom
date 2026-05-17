const UMAMI_ENDPOINT = 'https://analytics.sixtom.com/api/send'
const WEBSITE_ID = '64398c1a-02a0-4a61-991c-b0d143f01b46'
const HOSTNAME = 'sixtom.com'

/**
 * Fires a server-side Umami event. Fire-and-forget — failures are swallowed
 * so analytics issues never affect the action response.
 *
 * Used for events that originate server-side (e.g. successful form submits)
 * where we can't rely on the client running JS. The page-view + click events
 * remain client-side via the standard Umami script tag.
 */
export function fireServerEvent(eventName: string, request: Request): void {
	const userAgent = request.headers.get('user-agent') ?? 'unknown'
	const referrer = request.headers.get('referer') ?? ''
	const language = request.headers.get('accept-language')?.split(',')[0] ?? 'en'

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
				url: '/',
				name: eventName,
				referrer,
				language
			}
		})
	}).catch(() => {
		// Analytics failures must not affect user-facing responses.
	})
}

import type { RequestEvent } from '@sveltejs/kit'

type UmamiEvent = 'notify_signup_success' | 'book_qualified' | 'book_disqualified'

const UMAMI_ENDPOINT = 'https://analytics.sixtom.com/api/send'
const WEBSITE_ID = '64398c1a-02a0-4a61-991c-b0d143f01b46'
const HOSTNAME = 'sixtom.com'

// Server-side Umami event, for signals that originate on the server (successful
// form submits) where the client may have JS disabled.
//
// The visitor's IP + user agent go in the payload, not just the headers: Umami
// hashes (website, ip, ua) into the session id, and from Vercel the request IP
// is Vercel's. Without them every conversion lands in its own server session,
// orphaned from the UTM/referrer pageviews that produced it, so "signups by
// source" reads as zero for every source. Umami hashes the IP and never stores it.
export async function fireServerEvent(
	eventName: UmamiEvent,
	event: Pick<RequestEvent, 'request' | 'getClientAddress'>,
	data?: Record<string, string>
): Promise<void> {
	const { request } = event
	// testing eject: browsers marked by ?test (cookie set in hooks.server)
	// don't produce server-side events. One guard here covers every caller.
	if (/(?:^|;\s*)test_eject=1(?:;|$)/.test(request.headers.get('cookie') ?? '')) {
		return
	}
	// Only the production host reports, mirroring the client script's
	// data-domains. Without this, local dev, e2e runs and Vercel previews all
	// landed in prod analytics stamped as sixtom.com.
	const { hostname, pathname: url } = new URL(request.url)
	if (hostname !== HOSTNAME) return
	const userAgent = request.headers.get('user-agent') ?? 'unknown'
	let ip: string | undefined
	try {
		ip = event.getClientAddress()
	} catch {
		// no address: Umami falls back to its own headers (a server session)
	}

	// Awaited, not fire-and-forget: Vercel can freeze the function as soon as
	// the response is returned, dropping an in-flight fetch. The timeout caps
	// what a slow analytics box can add to a form submit.
	await fetch(UMAMI_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'User-Agent': userAgent },
		body: JSON.stringify({
			type: 'event',
			payload: {
				website: WEBSITE_ID,
				hostname: HOSTNAME,
				url,
				name: eventName,
				referrer: request.headers.get('referer') ?? '',
				language: request.headers.get('accept-language')?.split(',')[0] ?? 'en',
				ip,
				userAgent,
				data
			}
		}),
		signal: AbortSignal.timeout(2000)
	}).catch(() => {
		// Analytics failures must not affect user-facing responses.
	})
}

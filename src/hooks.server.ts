import type { Handle } from '@sveltejs/kit'

const MARKETING_CSP = [
	"default-src 'self'",
	// 'unsafe-inline' covers the in-repo JSON-LD <script> block; no user input is reflected.
	"script-src 'self' 'unsafe-inline' https://analytics.sixtom.com",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data:",
	"connect-src 'self' https://analytics.sixtom.com",
	"font-src 'self'",
	"frame-ancestors 'none'",
	"form-action 'self'",
	"base-uri 'self'"
].join('; ')

// Studio is a third-party SPA that needs eval + cross-origin to *.sanity.io. Gated by noindex + robots.
const STUDIO_CSP = [
	"default-src 'self' https://*.sanity.io",
	"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sanity.io",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: https:",
	"connect-src 'self' https://*.sanity.io wss://*.sanity.io",
	"font-src 'self' data:",
	"frame-ancestors 'none'",
	"base-uri 'self'"
].join('; ')

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'X-Frame-Options': 'DENY',
	'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
}

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)

	// CSP + security headers are only meaningful on HTML; static assets ship with
	// their own content-type/cache headers and don't benefit from CSP.
	if (!response.headers.get('content-type')?.startsWith('text/html')) {
		return response
	}

	const csp = event.url.pathname.startsWith('/sanity') ? STUDIO_CSP : MARKETING_CSP
	response.headers.set('Content-Security-Policy', csp)
	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(name, value)
	}

	if (event.request.method === 'GET' && event.url.pathname === '/') {
		response.headers.set(
			'Cache-Control',
			'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800'
		)
	} else if (event.request.method !== 'GET') {
		// Action responses must never be cached — they're per-request and may carry form state.
		response.headers.set('Cache-Control', 'private, no-store')
	}

	return response
}

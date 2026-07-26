// One-shot CLI to mint a Google OAuth refresh token for the GSC API.
//
// Prereqs (one-time):
//   1. Google Cloud project + enable the "Google Search Console API".
//   2. Create an OAuth 2.0 Client ID — type "Desktop app" — and add
//      http://localhost:8420 as an authorized redirect URI.
//   3. Export the ID + secret in your shell:
//        export GSC_OAUTH_CLIENT_ID=...
//        export GSC_OAUTH_CLIENT_SECRET=...
//
// Then:
//   node scripts/gsc-oauth-bootstrap.mjs
//
// It launches a local HTTP server, opens the consent screen in your browser,
// captures the redirect code, exchanges it for a refresh token, and prints
// the refresh token to stdout. Paste that into Vercel as:
//   GSC_OAUTH_REFRESH_TOKEN
// Nothing is written to disk.
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'

const PORT = 8420
const REDIRECT = `http://localhost:${String(PORT)}`
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

const clientId = process.env.GSC_OAUTH_CLIENT_ID
const clientSecret = process.env.GSC_OAUTH_CLIENT_SECRET
if (!clientId || !clientSecret) {
	console.error('Set GSC_OAUTH_CLIENT_ID and GSC_OAUTH_CLIENT_SECRET in your shell first.')
	process.exit(1)
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
authUrl.searchParams.set('client_id', clientId)
authUrl.searchParams.set('redirect_uri', REDIRECT)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('scope', SCOPE)
authUrl.searchParams.set('access_type', 'offline')
authUrl.searchParams.set('prompt', 'consent')

const code = await new Promise((resolve, reject) => {
	const server = createServer((req, res) => {
		const url = new URL(req.url ?? '/', REDIRECT)
		const c = url.searchParams.get('code')
		const error = url.searchParams.get('error')
		if (error) {
			res.writeHead(400, { 'Content-Type': 'text/plain' })
			res.end(`OAuth error: ${error}`)
			server.close()
			reject(new Error(error))
		} else if (c) {
			res.writeHead(200, { 'Content-Type': 'text/plain' })
			res.end('Got it. You can close this tab.')
			server.close()
			resolve(c)
		} else {
			res.writeHead(404)
			res.end()
		}
	})
	server.listen(PORT, () => {
		console.log(`Listening on ${REDIRECT}; opening browser…`)
		const opener =
			process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
		spawn(opener, [authUrl.toString()], { stdio: 'ignore', detached: true }).unref()
	})
})

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
	method: 'POST',
	headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	body: new URLSearchParams({
		code,
		client_id: clientId,
		client_secret: clientSecret,
		redirect_uri: REDIRECT,
		grant_type: 'authorization_code'
	})
})
if (!tokenRes.ok) {
	console.error('Token exchange failed:', tokenRes.status, (await tokenRes.text()).slice(0, 300))
	process.exit(1)
}
const tokens = await tokenRes.json()
if (!tokens.refresh_token) {
	console.error('No refresh_token in response — likely already authorized for this app.')
	console.error('Revoke at https://myaccount.google.com/permissions and re-run.')
	process.exit(1)
}
console.log('\nRefresh token (paste into Vercel env as GSC_OAUTH_REFRESH_TOKEN):\n')
console.log(tokens.refresh_token)

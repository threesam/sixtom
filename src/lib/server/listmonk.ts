// Server-side bridge to the self-hosted listmonk (Hetzner box, behind Caddy).
// The `sixtom` list is private, so listmonk's public subscription api refuses
// it: bots posted straight to that api (4 of 5 subscribers by 2026-11). This
// writes with the admin api instead, as the `sixtom-signup` api user, whose
// list role only reaches this list. Same shape as pyre-divers' joinList.
//
// Lists are per-brand and never cross-mailed: this module only knows sixtom's.
// (threesam.com's `garden` list has its own bridge in that repo.)
import * as env from '$app/env/private'

const LISTMONK_URL = 'https://mail.sixtom.com'
const API_USER = 'sixtom-signup'

// `sixtom` list (private, single opt-in): slot notifications + future tax reports.
export const SIXTOM_LIST_ID = 7

const SUBSCRIBE_TIMEOUT_MS = 5000
const EXISTS = 409

interface Found {
	data?: { results?: { id: number; email: string }[] }
}

function api(path: string, method: string, body?: object): Promise<Response> {
	return fetch(`${LISTMONK_URL}/api${path}`, {
		method,
		headers: {
			Authorization: `token ${API_USER}:${env.LISTMONK_SIGNUP_TOKEN ?? ''}`,
			'Content-Type': 'application/json'
		},
		...(body && { body: JSON.stringify(body) }),
		signal: AbortSignal.timeout(SUBSCRIBE_TIMEOUT_MS)
	})
}

async function join(email: string, listId: number): Promise<Response> {
	const made = await api('/subscribers', 'POST', {
		email,
		name: email.split('@')[0],
		status: 'enabled',
		lists: [listId],
		preconfirm_subscriptions: true
	})
	if (made.status !== EXISTS) return made
	// Already on another of the box's lists: add this one to theirs. A
	// blocklisted address stays unsubscribed, listmonk sees to that.
	const found = await api(`/subscribers?search=${encodeURIComponent(email)}&per_page=20`, 'GET')
	if (!found.ok) return found
	const { data } = (await found.json()) as Found
	const id = data?.results?.find((s) => s.email.toLowerCase() === email)?.id
	if (id === undefined) return new Response(null, { status: 404 })
	return api('/subscribers/lists', 'PUT', {
		ids: [id],
		action: 'add',
		target_list_ids: [listId],
		status: 'confirmed'
	})
}

// Best-effort subscribe. Never throws — the caller's primary flow (the email
// to Sam) must succeed even when listmonk is down; the address still lands in
// the inbox, only the list write is lost.
export async function subscribeToList(email: string, listId: number): Promise<boolean> {
	try {
		const res = await join(email.toLowerCase(), listId)
		if (!res.ok) {
			console.error('listmonk subscribe failed:', res.status)
			return false
		}
		return true
	} catch (error) {
		console.error('listmonk subscribe failed:', error instanceof Error ? error.message : 'unknown')
		return false
	}
}

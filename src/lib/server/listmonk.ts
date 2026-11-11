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
	data?: { results?: { id: number; email: string; status: string }[] }
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

function ok(res: Response): boolean {
	if (!res.ok) console.error('listmonk subscribe failed:', res.status)
	return res.ok
}

// listmonk's `search` is a case-insensitive regex over name and email, so the
// address is escaped and anchored: an exact match, `+` and `.` included.
const exactly = (email: string) => `^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`

async function join(email: string, listId: number): Promise<boolean> {
	const made = await api('/subscribers', 'POST', {
		email,
		name: email.split('@')[0],
		status: 'enabled',
		lists: [listId],
		preconfirm_subscriptions: true
	})
	if (made.status !== EXISTS) return ok(made)
	// Already on another of the box's lists: add this one to theirs.
	const found = await api(`/subscribers?search=${encodeURIComponent(exactly(email))}`, 'GET')
	if (!ok(found)) return false
	const { data } = (await found.json()) as Found
	const subscriber = data?.results?.find((s) => s.email.toLowerCase() === email)
	if (!subscriber) {
		console.error('listmonk subscribe failed: existing subscriber not found')
		return false
	}
	// Blocklisted stays off: a confirmed add would revive the list membership
	// the moment someone un-blocklists them.
	if (subscriber.status === 'blocklisted') return true
	return ok(
		await api('/subscribers/lists', 'PUT', {
			ids: [subscriber.id],
			action: 'add',
			target_list_ids: [listId],
			status: 'confirmed'
		})
	)
}

// Best-effort subscribe. Never throws — the caller's primary flow (the email
// to Sam) must succeed even when listmonk is down; the address still lands in
// the inbox, only the list write is lost.
export async function subscribeToList(email: string, listId: number): Promise<boolean> {
	try {
		return await join(email.toLowerCase(), listId)
	} catch (error) {
		console.error('listmonk subscribe failed:', error instanceof Error ? error.message : 'unknown')
		return false
	}
}

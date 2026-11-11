// Server-side bridge to the self-hosted listmonk (Hetzner box, behind Caddy).
// The `sixtom` list is private, so listmonk's public subscription api refuses
// it: bots posted straight to that api (4 of 5 subscribers by 2026-11). This
// writes with the admin api instead, as the `sixtom-signup` api user, whose
// only permission is creating subscribers on this list.
//
// Lists are per-brand and never cross-mailed: this module only knows sixtom's.
// (threesam.com's `garden` list has its own bridge in that repo.)
import * as env from '$app/env/private'

const LISTMONK_URL = 'https://mail.sixtom.com'
const API_USER = 'sixtom-signup'

// `sixtom` list (private, single opt-in): slot notifications + future tax reports.
export const SIXTOM_LIST_ID = 7

const SUBSCRIBE_TIMEOUT_MS = 5000

// Best-effort subscribe. Never throws — the caller's primary flow (the email
// to Sam) must succeed even when listmonk is down; the address still lands in
// the inbox, only the list write is lost.
//
// ponytail: create-only. An address already on another of the box's lists
// gets a 409 and stays off this one (the inbox email still has it). Adding it
// needs `lists:get_all`, which also opens every list to this token; grant that
// and add a search + PUT /subscribers/lists if the overlap ever matters.
export async function subscribeToList(email: string, listId: number): Promise<boolean> {
	try {
		const res = await fetch(`${LISTMONK_URL}/api/subscribers`, {
			method: 'POST',
			headers: {
				Authorization: `token ${API_USER}:${env.LISTMONK_SIGNUP_TOKEN ?? ''}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email.toLowerCase(),
				name: email.split('@')[0],
				status: 'enabled',
				lists: [listId],
				preconfirm_subscriptions: true
			}),
			signal: AbortSignal.timeout(SUBSCRIBE_TIMEOUT_MS)
		})
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

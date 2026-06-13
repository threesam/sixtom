// Server-side bridge to the self-hosted listmonk (Hetzner box, behind Caddy).
// Uses the PUBLIC subscription endpoint — no credentials involved; list UUIDs
// are the same values any public subscribe form would carry.
//
// Lists are per-brand and never cross-mailed: this module only knows sixtom's.
// (threesam.com's `garden` list has its own bridge in that repo.)
const LISTMONK_URL = 'https://mail.sixtom.com'

// `sixtom` list (single opt-in): slot notifications + future tax reports.
export const SIXTOM_LIST_UUID = 'd82e4dd1-517b-45dc-b86d-a38b562c2717'

const SUBSCRIBE_TIMEOUT_MS = 5000

// Best-effort subscribe. Never throws — the caller's primary flow (the email
// to Sam) must succeed even when listmonk is down; the address still lands in
// the inbox, only the list write is lost.
export async function subscribeToList(email: string, listUuid: string): Promise<boolean> {
	try {
		const res = await fetch(`${LISTMONK_URL}/api/public/subscription`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, list_uuids: [listUuid] }),
			signal: AbortSignal.timeout(SUBSCRIBE_TIMEOUT_MS)
		})
		if (!res.ok) {
			console.error('listmonk subscribe failed:', res.status)
			return false
		}
		return true
	} catch (error) {
		console.error(
			'listmonk subscribe failed:',
			error instanceof Error ? error.message : 'unknown'
		)
		return false
	}
}

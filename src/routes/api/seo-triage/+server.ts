import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { runWeeklyTriage } from '$lib/server/gsc-triage'
import type { RequestHandler } from './$types'

// Vercel automatically attaches `Authorization: Bearer ${CRON_SECRET}` to cron
// invocations when CRON_SECRET is set in the project env. We refuse anything
// else so the endpoint can't be triggered (and billed) by anonymous traffic.
// Also accepts manual invocation with the same header for debugging.
export const GET: RequestHandler = async ({ request }) => {
	const expected = env['CRON_SECRET']
	if (!expected) {
		return json({ ok: false, error: 'CRON_SECRET not configured' }, { status: 500 })
	}
	const auth = request.headers.get('authorization')
	if (auth !== `Bearer ${expected}`) {
		return json({ ok: false, error: 'unauthorized' }, { status: 401 })
	}
	try {
		const result = await runWeeklyTriage()
		return json({
			ok: true,
			startDate: result.startDate,
			endDate: result.endDate,
			rowsAnalyzed: result.rowsAnalyzed
		})
	} catch (err) {
		const message = err instanceof Error ? err.message : 'unknown error'
		console.error('[/api/seo-triage] failed:', message)
		return json({ ok: false, error: message }, { status: 500 })
	}
}

import nodemailer from 'nodemailer'
import { env } from '$env/dynamic/private'

// Endpoints used by the weekly triage. Hardcoded — they don't change.
const GSC_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const GSC_SITES_BASE = 'https://searchconsole.googleapis.com/webmasters/v3/sites'
const AI_GATEWAY_ENDPOINT = 'https://ai-gateway.vercel.sh/v1/chat/completions'
const TRIAGE_MODEL = 'anthropic/claude-sonnet-4-6'

// Per-row shape returned by the GSC searchAnalytics.query API when dimensions=[query].
// `keys[0]` is the query string. `ctr` is a fraction in [0, 1].
export interface GscRow {
	keys: string[]
	clicks: number
	impressions: number
	ctr: number
	position: number
}

export interface TriageBuckets {
	// Position 11–20, sorted by impressions desc — one nudge from page 1.
	pageTwoClimbers: readonly GscRow[]
	// Position ≤ 10 with CTR below the cohort median — snippet rewrites pay off here.
	lowCtrTopTen: readonly GscRow[]
	// Queries the site ranks for but whose terms don't appear in any known page title.
	offTargetQueries: readonly GscRow[]
}

export interface TriageResult {
	startDate: string
	endDate: string
	rowsAnalyzed: number
	report: string
}

interface OAuthRefreshResponse {
	access_token: string
	expires_in: number
}

interface GscQueryResponse {
	rows?: GscRow[]
}

interface ChatCompletionResponse {
	choices?: { message?: { content?: string } }[]
}

async function refreshAccessToken(): Promise<string> {
	const clientId = env['GSC_OAUTH_CLIENT_ID']
	const clientSecret = env['GSC_OAUTH_CLIENT_SECRET']
	const refreshToken = env['GSC_OAUTH_REFRESH_TOKEN']
	if (!clientId || !clientSecret || !refreshToken) {
		throw new Error(
			'GSC OAuth env not set: need GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN'
		)
	}
	const res = await fetch(GSC_TOKEN_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: 'refresh_token'
		})
	})
	if (!res.ok) {
		// Bodies on token errors are non-sensitive ("invalid_grant" etc.). Read short text for diagnostics.
		const detail = (await res.text()).slice(0, 200)
		throw new Error(`GSC token refresh ${String(res.status)} ${res.statusText}: ${detail}`)
	}
	const json = (await res.json()) as OAuthRefreshResponse
	return json.access_token
}

async function fetchQueryRows(
	accessToken: string,
	siteUrl: string,
	startDate: string,
	endDate: string,
	rowLimit: number
): Promise<GscRow[]> {
	const url = `${GSC_SITES_BASE}/${encodeURIComponent(siteUrl)}/searchAnalytics/query`
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			startDate,
			endDate,
			dimensions: ['query'],
			rowLimit,
			dataState: 'final'
		})
	})
	if (!res.ok) {
		throw new Error(`GSC query ${String(res.status)} ${res.statusText}`)
	}
	const json = (await res.json()) as GscQueryResponse
	return json.rows ?? []
}

const isoDate = (d: Date): string => d.toISOString().slice(0, 10)
const daysAgoUtc = (n: number): Date => {
	const d = new Date()
	d.setUTCDate(d.getUTCDate() - n)
	return d
}

// Pure: extracted so the bucket logic is unit-testable without hitting any API.
export function computeBuckets(
	rows: readonly GscRow[],
	knownTitleTokens: ReadonlySet<string>
): TriageBuckets {
	const pageTwo = rows.filter((r) => r.position >= 11 && r.position <= 20)
	pageTwo.sort((a, b) => b.impressions - a.impressions)

	const topTen = rows.filter((r) => r.position <= 10 && r.impressions > 0)
	const sortedCtrs = topTen.map((r) => r.ctr).sort((a, b) => a - b)
	const median = sortedCtrs.length > 0 ? (sortedCtrs[Math.floor(sortedCtrs.length / 2)] ?? 0) : 0
	const lowCtrTopTen = topTen
		.filter((r) => r.ctr < median)
		.sort((a, b) => b.impressions - a.impressions)

	const TOKEN_MIN = 3
	const tokensOf = (query: string): string[] =>
		query
			.toLowerCase()
			.split(/[^a-z0-9]+/)
			.filter((t) => t.length >= TOKEN_MIN)

	const offTarget = rows
		.filter((r) => r.position <= 30 && r.impressions >= 5)
		.filter((r) => {
			const tokens = tokensOf(r.keys[0] ?? '')
			return !tokens.some((t) => knownTitleTokens.has(t))
		})
		.sort((a, b) => b.impressions - a.impressions)

	return {
		pageTwoClimbers: pageTwo.slice(0, 20),
		lowCtrTopTen: lowCtrTopTen.slice(0, 20),
		offTargetQueries: offTarget.slice(0, 20)
	}
}

function renderBucketTable(name: string, rows: readonly GscRow[]): string {
	if (rows.length === 0) return `### ${name}\n_no rows_\n`
	const lines = rows.map(
		(r) =>
			`- "${r.keys[0] ?? ''}" — pos ${r.position.toFixed(1)}, ${String(r.impressions)} impr, ${String(r.clicks)} clicks, CTR ${(r.ctr * 100).toFixed(2)}%`
	)
	return `### ${name}\n${lines.join('\n')}\n`
}

function buildPrompt(buckets: TriageBuckets, siteUrl: string): string {
	return [
		`You are a senior SEO operator triaging a weekly Google Search Console export for ${siteUrl}.`,
		`The site is sixtom.com — a solo engineering consultant offering a $1,500 audit and a $10,000 two-week sprint, targeting founders shipping AI-built MVPs to production. Voice: lowercase, terse, declarative.`,
		``,
		`Three buckets of raw GSC data:`,
		``,
		renderBucketTable('Page-two climbers (positions 11–20)', buckets.pageTwoClimbers),
		renderBucketTable('Top-10 queries with low CTR', buckets.lowCtrTopTen),
		renderBucketTable(
			'Queries the site ranks for but no current title targets',
			buckets.offTargetQueries
		),
		``,
		`Produce a markdown report with exactly three sections:`,
		`1. **5 highest-leverage fixes this week** — each: the query, what to do, why it matters (one line each).`,
		`2. **Title/meta rewrites** — for low-CTR top-10s where a snippet rewrite pays off. Concrete new title + meta in sixtom's voice.`,
		`3. **Next 3 article titles** — based on off-target queries that match buyer intent for a $1,500 audit / $10,000 sprint. Lowercase titles, buyer-question framed.`,
		``,
		`Be ruthless about leverage. No fluff. No congratulations.`
	].join('\n')
}

async function callAiGateway(prompt: string): Promise<string> {
	const token = env['AI_GATEWAY_API_KEY'] ?? env.VERCEL_OIDC_TOKEN
	if (!token) {
		throw new Error('Neither AI_GATEWAY_API_KEY nor VERCEL_OIDC_TOKEN is available')
	}
	const res = await fetch(AI_GATEWAY_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: TRIAGE_MODEL,
			messages: [{ role: 'user', content: prompt }]
		})
	})
	if (!res.ok) {
		throw new Error(`AI Gateway ${String(res.status)} ${res.statusText}`)
	}
	const json = (await res.json()) as ChatCompletionResponse
	const content = json.choices?.[0]?.message?.content
	if (typeof content !== 'string' || content.length === 0) {
		throw new Error('AI Gateway returned empty content')
	}
	return content
}

async function sendEmailReport(subject: string, body: string): Promise<void> {
	const host = env.SMTP_SERVER
	const port = env.SMTP_PORT
	const user = env.SMTP_EMAIL
	const pass = env.SMTP_TOKEN
	const to = env.SMTP_RECIPIENT_EMAIL
	if (!host || !port || !user || !pass || !to) {
		throw new Error(
			'SMTP env not set: need SMTP_SERVER, SMTP_PORT, SMTP_EMAIL, SMTP_TOKEN, SMTP_RECIPIENT_EMAIL'
		)
	}
	const portNumber = Number.parseInt(port, 10)
	if (!Number.isFinite(portNumber)) throw new Error(`Invalid SMTP_PORT: ${port}`)
	const transport = nodemailer.createTransport({
		host,
		port: portNumber,
		secure: true,
		auth: { user, pass }
	})
	await transport.sendMail({ from: user, to, subject, text: body })
}

// Hardcoded for the first iteration — these are the words in sixtom's current
// titles. The off-target bucket flags queries whose tokens don't overlap. Easy
// to lift to a sitemap-derived set later.
const KNOWN_TITLE_TOKENS = new Set<string>([
	'sixtom',
	'faq',
	'log',
	'tax',
	'vibe',
	'code',
	'audit',
	'sprint',
	'garden',
	'party',
	'production',
	'solution',
	'book',
	'notify'
])

const QUERY_ROW_LIMIT = 5000

export async function runWeeklyTriage(): Promise<TriageResult> {
	const siteUrl = env['GSC_SITE_URL']
	if (!siteUrl) throw new Error('GSC_SITE_URL not set (e.g. "https://sixtom.com/")')

	// GSC data lags ~2 days. End at yesterday-1, start 7 days before that.
	const endDate = isoDate(daysAgoUtc(2))
	const startDate = isoDate(daysAgoUtc(8))

	const accessToken = await refreshAccessToken()
	const rows = await fetchQueryRows(accessToken, siteUrl, startDate, endDate, QUERY_ROW_LIMIT)
	const buckets = computeBuckets(rows, KNOWN_TITLE_TOKENS)
	const prompt = buildPrompt(buckets, siteUrl)
	const report = await callAiGateway(prompt)

	await sendEmailReport(`SEO triage ${startDate} → ${endDate}`, report)
	return { startDate, endDate, rowsAnalyzed: rows.length, report }
}

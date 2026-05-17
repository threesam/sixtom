import 'dotenv/config'
import { calEvent } from '../src/lib/content/site'

const API_KEY = process.env.CAL_API_KEY
const USERNAME = process.env.CAL_USERNAME

if (!API_KEY) {
	console.error('Missing CAL_API_KEY in .env')
	process.exit(1)
}
if (!USERNAME) {
	console.error('Missing CAL_USERNAME in .env')
	process.exit(1)
}

const BASE = 'https://api.cal.com/v2'
const HEADERS = {
	Authorization: `Bearer ${API_KEY}`,
	'cal-api-version': '2024-06-14',
	'Content-Type': 'application/json'
} as const

const FIELD_TYPE_MAP = { longText: 'textarea', select: 'select', text: 'text' } as const
function fieldType(t: keyof typeof FIELD_TYPE_MAP): string {
	return FIELD_TYPE_MAP[t]
}

function toBookingField(q: (typeof calEvent.intakeQuestions)[number]) {
	const slug = q.label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 40)
	const base = { type: fieldType(q.type), slug, label: q.label, required: q.required }
	if (q.type === 'select' && q.options?.length) {
		return { ...base, options: q.options.map((o) => ({ label: o, value: o })) }
	}
	return base
}

interface EventTypeRow {
	id: number
	slug: string
}

async function listEventTypes(): Promise<EventTypeRow[]> {
	const res = await fetch(`${BASE}/event-types?username=${String(USERNAME)}`, { headers: HEADERS })
	if (!res.ok) {
		throw new Error(`List event-types failed: ${String(res.status)} ${await res.text()}`)
	}
	const json = (await res.json()) as { data?: EventTypeRow[] }
	return json.data ?? []
}

const existing = await listEventTypes()
const match = existing.find((e) => e.slug === calEvent.slug)
const payload = {
	title: calEvent.title,
	slug: calEvent.slug,
	lengthInMinutes: calEvent.durationMinutes,
	description: calEvent.description,
	bookingFields: calEvent.intakeQuestions.map(toBookingField)
}
const url = match ? `${BASE}/event-types/${String(match.id)}` : `${BASE}/event-types`
const method = match ? 'PATCH' : 'POST'
const res = await fetch(url, { method, headers: HEADERS, body: JSON.stringify(payload) })
if (!res.ok) {
	throw new Error(`${method} event-type failed: ${String(res.status)} ${await res.text()}`)
}
console.log(`${match ? 'Updated' : 'Created'} event type "${calEvent.title}".`)
console.log(`Booking URL: https://cal.com/${USERNAME}/${calEvent.slug}`)

export interface LogEntry {
	slug: string
	title: string
	eyebrow: string
	heroImage: string
	date: string
	blurb: string
}

export const LOG_ENTRIES: LogEntry[] = [
	{
		slug: 'garden-party',
		title: 'garden party',
		eyebrow: '— log / 2026-05-18',
		heroImage: '/assets/clouds.webp',
		date: '2026-05-18',
		blurb:
			'a 1:1 port of threesam.com from Next.js to SvelteKit. the impulse, the experiment, what the numbers showed.'
	}
]

export type Project = {
	_id: string
	title: string
	handle: { current: string }
	publishedAt?: string
	image: {
		url: string
	}
}

export type Section = {
	_id?: string
	title?: string
	subtitle?: string
	items?: Array<Record<string, unknown>>
}

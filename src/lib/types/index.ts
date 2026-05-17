export interface Project {
	_id: string
	title: string
	handle: { current: string }
	publishedAt?: string
	image: {
		url: string
	}
}

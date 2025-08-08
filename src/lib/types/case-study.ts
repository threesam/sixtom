export interface CaseStudyMetric {
	label: string
	value: string
}

export interface CaseStudy {
	_id: string
	title: string
	slug: { current: string }
	summary?: string
	heroImage?: { asset?: { url: string } }
	company?: string
	industry?: string
	services?: string[]
	metrics?: CaseStudyMetric[]
	publishedAt?: string
	problem?: any
	solution?: any
	results?: any
	ctaLabel?: string
	ctaUrl?: string
}

export interface BlogPostSummary {
	_id: string
	title: string
	slug: { current: string }
	excerpt?: string
	featuredImage?: { asset?: { url: string } }
	tags?: string[]
	publishedAt?: string
}

export interface BlogPost extends BlogPostSummary {
	body: any
	description?: string
}
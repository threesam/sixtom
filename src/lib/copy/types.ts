export type HeroCopy = {
	headline: string
	highlight: string
	subheadline: string
	cta: string
}

export type ProblemItem = {
	bold: string
	body?: string
}

export type ProblemCopy = {
	headline: string
	items: ProblemItem[]
	resolution: string
}

export type ServiceItem = {
	index: string
	question: string
	answer: string
	bullets: string[]
	dark: boolean
}

export type StatItem = {
	value: string
	label: string
}

export type CredibilityCopy = {
	headline: string
	stats: StatItem[]
}

export type ContactCopy = {
	headline: string
	subheadline: string
	namePlaceholder: string
	emailPlaceholder: string
	messagePlaceholder: string
	button: string
	successTitle: string
	successBody: string
}

export type MetaCopy = {
	title: string
	description: string
	keywords: string
}

export type SiteCopy = {
	meta: MetaCopy
	hero: HeroCopy
	problem: ProblemCopy
	services: ServiceItem[]
	credibility: CredibilityCopy
	contact: ContactCopy
}

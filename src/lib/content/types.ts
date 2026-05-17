export interface QA {
	question: string
	answer: string
}

export type StringList = readonly string[]

export interface Operator {
	name: string
	jobTitle: string
	currentEmployer: string
	formerEmployer: string
	credentialsChip: string
}

export interface Offer {
	name: string
	longName: string
	priceUSD: number
	cadence: string
	promise: string
}

export interface ProcessStep {
	label: string
	body: string
}

export interface Stat {
	value: string
	label: string
}

export interface Testimonial {
	quote: string
	attribution: string
}

export interface Site {
	siteUrl: string
	bookingUrl: string
	gardenUrl: string
	tagline: string
	thesis: string
	thesisBody: string
	hero: {
		h1: string
		subhead: string
		ctaPrimary: string
		ctaSecondary: string
	}
	operator: Operator
	audit: Offer
	sprint: Offer
	process: readonly ProcessStep[]
	stats: readonly Stat[]
	testimonial: Testimonial
}

export interface IntakeQuestion {
	label: string
	type: 'text' | 'longText' | 'select'
	required: boolean
	options?: readonly string[]
}

export interface CalEvent {
	title: string
	slug: string
	durationMinutes: number
	description: string
	intakeQuestions: readonly IntakeQuestion[]
}

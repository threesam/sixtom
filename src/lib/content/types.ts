export type QA = {
	question: string
	answer: string
}

export type StringList = readonly string[]

export type Operator = {
	name: string
	jobTitle: string
	currentEmployer: string
	formerEmployer: string
	credentialsChip: string
}

export type Offer = {
	name: string
	longName: string
	priceUSD: number
	cadence: string
	promise: string
}

export type ProcessStep = {
	label: string
	body: string
}

export type Stat = {
	value: string
	label: string
}

export type Testimonial = {
	quote: string
	attribution: string
}

export type Site = {
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

export type IntakeQuestion = {
	label: string
	type: 'text' | 'longText' | 'select'
	required: boolean
	options?: readonly string[]
}

export type CalEvent = {
	title: string
	slug: string
	durationMinutes: number
	description: string
	intakeQuestions: readonly IntakeQuestion[]
}

export interface QA {
	question: string
	answer: string
}

export interface Operator {
	name: string
	jobTitle: string
	currentEmployer: string
	formerEmployer: string
	credentialsChip: string
	linkedinUrl: string
	xUrl: string
	githubUrl: string
	soundcloudUrl: string
}

export interface Offer {
	name: string
	longName: string
	priceUSD: number
	cadence: string
	introPriceUSD?: number
	introNote?: string
	introClosed?: boolean
	paymentPlan?: string
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

export interface Teardown {
	name: string
	longName: string
	priceUSD: number
	creditNote: string
}

export interface Site {
	siteUrl: string
	bookingUrl: string
	gardenUrl: string
	tagline: string
	operator: Operator
	sprint: Offer
	teardown: Teardown
	process: readonly ProcessStep[]
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

// Discriminated: a line is either priced (valueUSD) or labeled ('core' /
// 'included') — never neither, so a blank value cell can't compile.
export type LedgerLine = {
	line: string
	sub: string
} & ({ valueUSD: number; valueLabel?: never } | { valueUSD: null; valueLabel: 'core' | 'included' })

export interface LedgerGroup {
	title: string
	note?: string // honest hedge rendered under the group
	lines: readonly LedgerLine[]
}

export interface CostCard {
	title: string
	sub: string
}

export interface GrandSlamOffer {
	chip: string
	headline: string
	lead: string
	offerLine: string
	stats: readonly Stat[]
	wall: {
		thesis: string
		para: string
		turn: string
		costCards: readonly CostCard[]
		taxLine: string
	}
	ledger: {
		eyebrow: string
		heading: string
		para: string
		groups: readonly LedgerGroup[]
		payParts: readonly { text: string; struck?: boolean }[]
		anchorLine: string
	}
	guarantee: { headline: string; body: string }
	proof: {
		eyebrow: string
		heading: string
		para: string
		tiles: readonly Stat[]
		para2: string
		bridge: string
	}
	isThisYou: {
		heading: string
		yesLead: string
		yes: readonly string[]
		noLead: string
		no: readonly string[]
	}
	timeline: { heading: string }
	close: {
		scarcity: string
		heading: string
		emailPlaceholder: string
		buildLabel: string
		buildPlaceholder: string
		button: string
		reward: string
	}
}

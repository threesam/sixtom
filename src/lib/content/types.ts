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

export interface Site {
	siteUrl: string
	bookingUrl: string
	gardenUrl: string
	tagline: string
	operator: Operator
	sprint: Offer
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

export interface LedgerLine {
	line: string
	sub: string
	valueUSD: number | null // null → valueLabel renders instead of a price
	valueLabel?: 'core' | 'included'
}

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
		eyebrow: string
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
		payLine: string
		anchorLine: string
	}
	guarantee: { eyebrow: string; headline: string; body: string }
	proof: {
		eyebrow: string
		heading: string
		para: string
		tiles: readonly Stat[]
		para2: string
		bridge: string
	}
	isThisYou: {
		eyebrow: string
		yesLead: string
		yes: readonly string[]
		noLead: string
		no: readonly string[]
	}
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

export const STAGE_OPTIONS = [
	{ value: 'memo-no-change', label: 'we said "use AI." nothing changed.' },
	{ value: 'some-trying', label: 'a few people use it. nobody ships with it.' },
	{ value: 'shipping-messy', label: "people are shipping. it's getting messy." },
	{ value: 'solo', label: "it's just me. no team yet." }
] as const

export const BUDGET_OPTIONS = [
	{ value: 'under-15k', label: 'under $15,000' },
	{ value: '15k-25k', label: '$15,000–$25,000' },
	{ value: '25k+', label: '$25,000+' },
	{ value: 'not-sure', label: 'not sure yet' }
] as const

// Stage that auto-disqualifies: the engagement is for a team.
export const DISQUALIFY_STAGE = 'solo'

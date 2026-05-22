export const STAGE_OPTIONS = [
	{ value: 'demo-only', label: 'demo works for me only' },
	{ value: 'few-users', label: 'a few real users on it' },
	{ value: 'paying-breaking', label: 'paying customers but breaking' },
	{ value: 'pre-build', label: 'pre-build, just an idea' }
] as const

export const BUDGET_OPTIONS = [
	{ value: 'under-1500', label: 'under $1,500' },
	{ value: '1500-10k', label: '$1,500–$10,000' },
	{ value: '10k-25k', label: '$10,000–$25,000' },
	{ value: '25k+', label: '$25,000+' },
	{ value: 'not-sure', label: 'not sure yet' }
] as const

// Stage that auto-disqualifies — sixtom isn't greenfield.
export const DISQUALIFY_STAGE = 'pre-build'

export const STAGE_OPTIONS = [
	{ value: 'demo-only', label: 'it works when I show it off' },
	{ value: 'few-users', label: 'a few real people are using it' },
	{ value: 'paying-breaking', label: 'paying customers, and it keeps breaking' },
	{ value: 'pre-build', label: 'still just an idea in my head' }
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

export interface Project {
	_id: string
	title: string
	handle: { current: string }
	publishedAt?: string
	image: {
		url: string
	}
}

export interface FormResult {
	status: 'success' | 'error'
	message: string
}

export type UmamiEvent =
	| 'cta_hero_book'
	| 'cta_audit_book'
	| 'cta_sprint_book'
	| 'cta_notify_submit'
	| 'cta_garden_link'
	| 'notify_signup_success'

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

export type UmamiEvent = 'cta_notify_submit' | 'cta_garden_link' | 'notify_signup_success'

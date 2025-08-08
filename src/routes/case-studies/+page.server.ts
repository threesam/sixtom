import type { PageServerLoad } from './$types'
import { getCaseStudies } from '$lib/client/case-studies'

export const load: PageServerLoad = async () => {
	return { studies: await getCaseStudies() }
}

export const prerender = false
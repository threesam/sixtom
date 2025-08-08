import type { PageServerLoad } from './$types'
import { getCaseStudyBySlug } from '$lib/client/case-studies'

export const load: PageServerLoad = async ({ params }) => {
	const study = await getCaseStudyBySlug(params.slug)
	return { study }
}

export const prerender = false
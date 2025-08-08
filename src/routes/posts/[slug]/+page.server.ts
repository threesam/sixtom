import type { PageServerLoad } from './$types'
import { getPostBySlug } from '$lib/client/case-studies'

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPostBySlug(params.slug)
	return { post }
}

export const prerender = false
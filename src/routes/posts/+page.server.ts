import type { PageServerLoad } from './$types'
import { getPosts } from '$lib/client/case-studies'

export const load: PageServerLoad = async () => {
	return { posts: await getPosts() }
}

export const prerender = false
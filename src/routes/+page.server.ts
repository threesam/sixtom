import type { PageServerLoad } from './$types'
import type { Project } from '$lib/types'
import { fetchSanityData } from '$lib/client/sanity'

// Query to fetch posts
const PAGE_QUERY = `*[_type == "page" && handle.current == 'home'][0]{
	sections[]->{
		...,
		_id,
		title,
		handle,
		image{asset->},
		publishedAt,
		items[]->{
			...,
			person->,
			image{asset->}
		}
	}
}`

export const load: PageServerLoad = async () => {
	try {
		const page = await fetchSanityData<Project[]>(PAGE_QUERY)

		return {
			page
		}
	} catch (error) {
		return {
			page: [],
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		}
	}
}

export const prerender = true

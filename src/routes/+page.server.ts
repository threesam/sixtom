import type { PageServerLoad } from './$types'
// Define a minimal type for the page data we use here
type PageData = {
    sections?: Array<Record<string, unknown>>
}
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
		return { page: await fetchSanityData<PageData>(PAGE_QUERY) }
	} catch (error) {
		return { error: error instanceof Error ? error.message : 'Unknown error occurred' }
	}
}

export const prerender = false

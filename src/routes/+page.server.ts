import type { PageServerLoad } from './$types'
import { fetchSanityData } from '$lib/client/sanity'

// Query to fetch posts
const PAGE_QUERY = `*[_type == "page" && handle.current == 'home'][0]{
	sections[]{
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

// Minimal shape used by the page
type HomePage = {
	sections: unknown[]
}

export const load: PageServerLoad = async () => {
	let page: HomePage = { sections: [] }
	try {
		page = await fetchSanityData<HomePage>(PAGE_QUERY)
	} catch (error) {
		// ignore and use default
	}
	return { page }
}

export const prerender = true

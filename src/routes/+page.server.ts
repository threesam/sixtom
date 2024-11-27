import type { PageServerLoad } from './$types'
import type { Project } from '$lib/types'
import { fetchSanityData } from '$lib/client/sanity'

// Query to fetch posts
const PROJECTS_QUERY = `*[_type == "project"]{
...,
  _id,
  title,
  "handle": slug.current,
	image{asset->},
  publishedAt
}[0...10] | order(publishedAt desc)`

export const load: PageServerLoad = async () => {
	try {
		const projects = await fetchSanityData<Project[]>(PROJECTS_QUERY)

		return {
			projects
		}
	} catch (error) {
		return {
			projects: [],
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		}
	}
}

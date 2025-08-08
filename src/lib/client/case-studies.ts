import { fetchSanityData } from './sanity'
import type { BlogPost, BlogPostSummary, CaseStudy } from '$lib/types/case-study'

export async function getCaseStudies(): Promise<CaseStudy[]> {
	const query = `*[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc){
		_id, title, slug, summary, heroImage{asset->{url}}, company, industry, services, metrics, publishedAt,
		ctaLabel, ctaUrl
	}`
	return fetchSanityData<CaseStudy[]>(query)
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
	const query = `*[_type == "caseStudy" && slug.current == $slug][0]{
		_id, title, slug, summary, heroImage{asset->{url}}, company, industry, services, metrics, publishedAt,
		problem, solution, results, ctaLabel, ctaUrl
	}`
	return fetchSanityData<CaseStudy | null>(query, { slug })
}

export async function getPosts(): Promise<BlogPostSummary[]> {
	const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
		_id, title, slug, excerpt, featuredImage{asset->{url}}, tags, publishedAt
	}`
	return fetchSanityData<BlogPostSummary[]>(query)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const query = `*[_type == "post" && slug.current == $slug][0]{
		_id, title, slug, excerpt, featuredImage{asset->{url}}, tags, publishedAt, description, body
	}`
	return fetchSanityData<BlogPost | null>(query, { slug })
}
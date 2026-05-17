import { site } from '$lib/content'

export const prerender = true

export function GET(): Response {
	const today = new Date().toISOString().slice(0, 10)
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${site.siteUrl}/</loc>
		<lastmod>${today}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>1.0</priority>
	</url>
</urlset>
`
	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	})
}

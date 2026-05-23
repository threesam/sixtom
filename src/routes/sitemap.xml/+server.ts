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
	<url>
		<loc>${site.siteUrl}/log</loc>
		<lastmod>${today}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>${site.siteUrl}/log/garden-party</loc>
		<lastmod>${today}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
	</url>
	<url>
		<loc>${site.siteUrl}/tax</loc>
		<lastmod>${today}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>
	<url>
		<loc>${site.siteUrl}/privacy</loc>
		<lastmod>${today}</lastmod>
		<changefreq>yearly</changefreq>
		<priority>0.3</priority>
	</url>
	<url>
		<loc>${site.siteUrl}/terms</loc>
		<lastmod>${today}</lastmod>
		<changefreq>yearly</changefreq>
		<priority>0.3</priority>
	</url>
</urlset>
`
	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	})
}

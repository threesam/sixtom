import { site } from '$lib/content'
import { LOG_ENTRIES } from '$lib/log'

export const prerender = true

interface SitemapUrl {
	path: string
	lastmod: string
	changefreq: string
	priority: string
}

export function GET(): Response {
	const today = new Date().toISOString().slice(0, 10)
	// Indexable routes only — /book (noindex,nofollow) and /notify (noindex) are
	// deliberately excluded. Writeups derive from LOG_ENTRIES so new ones appear
	// automatically, each stamped with its real publish date (honest lastmod).
	const urls: SitemapUrl[] = [
		{ path: '/', lastmod: today, changefreq: 'monthly', priority: '1.0' },
		{ path: '/log', lastmod: today, changefreq: 'weekly', priority: '0.8' },
		{ path: '/faq', lastmod: today, changefreq: 'monthly', priority: '0.7' },
		{ path: '/tax', lastmod: today, changefreq: 'monthly', priority: '0.6' },
		...LOG_ENTRIES.map((entry) => ({
			path: `/log/${entry.slug}`,
			lastmod: entry.date,
			changefreq: 'monthly',
			priority: '0.7'
		})),
		{ path: '/privacy', lastmod: today, changefreq: 'yearly', priority: '0.3' },
		{ path: '/terms', lastmod: today, changefreq: 'yearly', priority: '0.3' }
	]

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) => `	<url>
		<loc>${site.siteUrl}${u.path}</loc>
		<lastmod>${u.lastmod}</lastmod>
		<changefreq>${u.changefreq}</changefreq>
		<priority>${u.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>
`
	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	})
}

import { site } from '#lib/content/index.js'
import { LOG_ENTRIES } from '#lib/log.js'

export const prerender = true

interface SitemapUrl {
	path: string
	lastmod?: string | undefined
	changefreq: string
	priority: string
}

export function GET(): Response {
	// lastmod only where there's a real date. Stamping every page with the build
	// day says everything changed every deploy, and Google stops trusting it.
	const newest = LOG_ENTRIES.map((e) => e.date)
		.sort()
		.at(-1)
	// Indexable routes only — /book (noindex,nofollow) is deliberately excluded.
	// /notify is the waitlist + teardown offer URL (schema points at it),
	// indexable since the grand-slam migration. Writeups derive from LOG_ENTRIES
	// so new ones appear automatically, stamped with their real publish date.
	const urls: SitemapUrl[] = [
		{ path: '/', changefreq: 'monthly', priority: '1.0' },
		{ path: '/log', lastmod: newest, changefreq: 'weekly', priority: '0.8' },
		{ path: '/faq', changefreq: 'monthly', priority: '0.7' },
		{ path: '/notify', changefreq: 'monthly', priority: '0.6' },
		...LOG_ENTRIES.map((entry) => ({
			path: `/log/${entry.slug}`,
			lastmod: entry.date,
			changefreq: 'monthly',
			priority: '0.7'
		})),
		{ path: '/privacy', changefreq: 'yearly', priority: '0.3' },
		{ path: '/accessibility', changefreq: 'yearly', priority: '0.3' },
		{ path: '/terms', changefreq: 'yearly', priority: '0.3' }
	]

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) => `	<url>
		<loc>${site.siteUrl}${u.path}</loc>${u.lastmod ? `\n\t\t<lastmod>${u.lastmod}</lastmod>` : ''}
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

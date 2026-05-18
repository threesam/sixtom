import { env } from '$env/dynamic/private'
import type { PageServerLoad } from './$types'

export const config = { isr: { expiration: 3600 } }

export interface LogPost {
	id: number
	text: string
	publishedAt: string | null
	linkedinPermalink: string | null
	imageUrl: string | null
	pinned: boolean
}

interface RawPost {
	id: number
	text: string
	publishedAt: string | null
	linkedinPermalink: string | null
	imageUrl: string | null
	meta: { pinned?: boolean } | null
}

// Strip anything that isn't a plain https:// URL — defense against a future
// upstream returning `javascript:` or `data:` URIs that would execute on click.
function safeHttpsUrl(url: string | null): string | null {
	if (!url) return null
	try {
		return new URL(url).protocol === 'https:' ? url : null
	} catch {
		return null
	}
}

export const load: PageServerLoad = async ({ fetch }) => {
	const origin = env.CONTENT_ENGINE_URL
	const token = env.STUDIO_TOKEN
	if (!origin || !token) {
		console.warn('[/log] CONTENT_ENGINE_URL or STUDIO_TOKEN missing; rendering empty feed')
		return { posts: [] }
	}

	try {
		const res = await fetch(`${origin}/api/posts?status=published&limit=50`, {
			headers: { authorization: `Bearer ${token}` }
		})
		if (!res.ok) {
			console.error(`[/log] content-engine ${res.status} ${res.statusText}`)
			return { posts: [] }
		}
		const body = (await res.json()) as { posts: RawPost[] }
		const posts: LogPost[] = body.posts.map((p) => ({
			id: p.id,
			text: p.text,
			publishedAt: p.publishedAt,
			linkedinPermalink: safeHttpsUrl(p.linkedinPermalink),
			imageUrl: safeHttpsUrl(p.imageUrl),
			pinned: Boolean(p.meta?.pinned)
		}))
		posts.sort((a, b) => {
			if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
			return (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')
		})
		return { posts }
	} catch (err) {
		console.error('[/log] fetch failed', err)
		return { posts: [] }
	}
}

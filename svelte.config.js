import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),
	compilerOptions: { runes: true },
	kit: {
		adapter: adapter(),
		// Default is relative URLs (./_app/...), which 404 from nested routes
		// like /log when the inline style hand-off tries to load the external CSS.
		paths: { relative: false },
		prerender: { entries: ['/sanity', '/sitemap.xml', '/privacy', '/terms'] },
		// Inline CSS chunks under 25 KB to drop the render-blocking
		// <link rel="stylesheet"> round-trip on a fully prerendered page.
		inlineStyleThreshold: 25_000
	}
}

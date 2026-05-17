import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),
	compilerOptions: { runes: true },
	kit: {
		adapter: adapter(),
		prerender: { entries: ['/sanity', '/sitemap.xml'] },
		// Inline CSS chunks under 25 KB to drop the render-blocking
		// <link rel="stylesheet"> round-trip on a fully prerendered page.
		inlineStyleThreshold: 25_000
	}
}

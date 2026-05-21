import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),
	compilerOptions: { runes: true },
	kit: {
		adapter: adapter(),
		// Root-absolute asset URLs so nested-route HTML resolves /_app/... correctly.
		paths: { relative: false },
		prerender: { entries: ['/sanity', '/sitemap.xml', '/privacy', '/terms', '/tax'] }
		// inlineStyleThreshold removed: nested routes with <svelte:head> had the
		// SSR-injected inline <style> block wiped during hydration while the
		// fallback <link> stayed disabled, leaving the page unstyled.
	}
}

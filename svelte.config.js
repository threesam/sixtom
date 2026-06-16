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
		// /log must be listed explicitly: nothing in the crawl graph links to it
		// since the homepage went single-case-study, so the prerenderer can't
		// discover it and the build fails (same class of miss as /faq before).
		prerender: {
			entries: ['/sanity', '/sitemap.xml', '/privacy', '/terms', '/tax', '/faq', '/log']
		}
		// inlineStyleThreshold removed: nested routes with <svelte:head> had the
		// SSR-injected inline <style> block wiped during hydration while the
		// fallback <link> stayed disabled, leaving the page unstyled.
	}
}

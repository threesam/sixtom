import { defineConfig } from 'vitest/config'
import adapter from '@sveltejs/adapter-vercel'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import type { PluginOption } from 'vite'

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			compilerOptions: { runes: true },
			adapter: adapter(),
			// Root-absolute asset URLs so nested-route HTML resolves /_app/... correctly.
			paths: { relative: false },
			// /log must be listed explicitly: nothing in the crawl graph links to it
			// since the homepage went single-case-study, so the prerenderer can't
			// discover it and the build fails (same class of miss as /faq before).
			prerender: {
				entries: ['/accessibility', '/sitemap.xml', '/privacy', '/terms', '/faq', '/log']
			}
			// inlineStyleThreshold removed: nested routes with <svelte:head> had the
			// SSR-injected inline <style> block wiped during hydration while the
			// fallback <link> stayed disabled, leaving the page unstyled.
		}),
		tailwindcss() as PluginOption
	],
	test: {
		exclude: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**', 'e2e/**']
	}
})

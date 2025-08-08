import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: [
			'sanity',
			'sanity-plugin-media',
			'@sanity/*',
			'react-dropzone'
		]
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
})

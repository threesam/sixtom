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

	build: {
		chunkSizeWarningLimit: 2000,
		rollupOptions: {
			output: {
				manualChunks(id: string) {
					if (!id.includes('node_modules')) return undefined
					if (id.includes('sanity') || id.includes('@sanity')) return 'vendor-sanity'
					if (id.includes('react') || id.includes('react-dom') || id.includes('framer-motion'))
						return 'vendor-react'
					if (id.includes('@mux')) return 'vendor-mux'
					return undefined
				}
			}
		}
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
})

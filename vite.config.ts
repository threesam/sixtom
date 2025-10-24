import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import type { PluginOption } from 'vite'

export default defineConfig({
	plugins: [sveltekit(), tailwindcss() as PluginOption]
})

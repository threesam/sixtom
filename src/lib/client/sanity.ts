import { createClient } from '@sanity/client'
import type { ClientConfig } from '@sanity/client'

// The SvelteKit public env vars are injected at build time.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined
const dataset = import.meta.env.PUBLIC_SANITY_DATASET as string | undefined
const useCdnFlag = (import.meta.env.PUBLIC_SANITY_CDN as string | undefined) === 'true'

export type SanityQueryParams = Record<string, string | number | boolean>

export function getSanityConfig(): ClientConfig {
	return {
		projectId,
		dataset,
		apiVersion: '2024-01-01',
		useCdn: useCdnFlag
	}
}

export function sanityClient() {
	return createClient(getSanityConfig())
}

export async function fetchSanityData<T>(query: string, params: SanityQueryParams = {}): Promise<T> {
	try {
		const client = sanityClient()
		return await client.fetch<T>(query, params)
	} catch (error) {
		console.error('Sanity fetch error:', error)
		throw error
	}
}

// Dynamically build the Sanity Studio config on the client only
export async function createSanityConfig() {
	const [{ defineConfig }, { structureTool }, { visionTool }, { default: RiAliensLine }] = await Promise.all([
		import('sanity'),
		import('sanity/structure'),
		import('@sanity/vision'),
		import('react-icons/ri').then((m) => ({ default: m.RiAliensLine }))
	])

	// Optional plugin: load dynamically and ignore if unavailable
	let mediaPlugin: any | null = null
	try {
		const mod = await import('sanity-plugin-media')
		mediaPlugin = mod.media
	} catch {
		mediaPlugin = null
	}

	let codeInputPlugin: any | null = null
	try {
		const mod = await import('@sanity/code-input')
		codeInputPlugin = mod.codeInput
	} catch {
		codeInputPlugin = null
	}

	const { schemaTypes } = await import('../../schemas')

	return defineConfig({
		name: 'studio',
		title: 'The Studio',
		projectId: projectId ?? '',
		basePath: '/sanity',
		icon: RiAliensLine,
		dataset: dataset ?? 'production',
		plugins: [codeInputPlugin?.(), structureTool(), mediaPlugin?.(), visionTool()].filter(Boolean),
		schema: {
			types: schemaTypes
		}
	})
}

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '../../schemas'
import { env as PUBLIC_ENV } from '$env/dynamic/public'
import { RiAliensLine } from 'react-icons/ri'
import { createClient } from '@sanity/client'
import type { ClientConfig } from '@sanity/client'
// media plugin is loaded dynamically in SanityStudio.svelte to avoid SSR importing React deps
// code-input plugin will be added dynamically in SanityStudio.svelte

	export const sanityConfig = defineConfig({
		name: 'studio',
		title: 'The Studio',
		projectId: PUBLIC_ENV.PUBLIC_SANITY_PROJECT_ID ?? '',
		basePath: '/sanity',
		icon: RiAliensLine,
		dataset: PUBLIC_ENV.PUBLIC_SANITY_DATASET ?? 'production',
		plugins: [structureTool(), visionTool()],
		schema: {
			types: schemaTypes
		}
	})

// Create type for Sanity query function
export type SanityQueryParams = Record<string, string | number | boolean>

// Create Sanity client configuration
	export function getSanityConfig(): ClientConfig {
	return {
		projectId: PUBLIC_ENV.PUBLIC_SANITY_PROJECT_ID,
		dataset: PUBLIC_ENV.PUBLIC_SANITY_DATASET,
		apiVersion: '2024-01-01',
		useCdn: PUBLIC_ENV.PUBLIC_SANITY_CDN === 'true'
	}
}

// Create Sanity client
export function sanityClient() {
	return createClient(getSanityConfig())
}

// Fetch data from Sanity with typed query and params
export async function fetchSanityData<T>(
	query: string,
	params: SanityQueryParams = {}
): Promise<T> {
	try {
		const client = sanityClient()
		return await client.fetch<T>(query, params)
	} catch (error) {
		console.error('Sanity fetch error:', error)
		throw error
	}
}

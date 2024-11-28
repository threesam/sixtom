import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '../../schemas'
import {
	PUBLIC_SANITY_CDN,
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_DATASET
} from '$env/static/public'
import { RiAliensLine } from 'react-icons/ri'
import { createClient } from '@sanity/client'
import type { ClientConfig } from '@sanity/client'
import { media } from 'sanity-plugin-media'
import { codeInput } from '@sanity/code-input'

export const sanityConfig = defineConfig({
	name: 'studio',
	title: 'The Studio',
	projectId: PUBLIC_SANITY_PROJECT_ID ?? '',
	basePath: '/sanity',
	icon: RiAliensLine,
	dataset: PUBLIC_SANITY_DATASET ?? 'production',
	plugins: [codeInput(), structureTool(), media(), visionTool()],
	schema: {
		types: schemaTypes
	}
})

// Create type for Sanity query function
export type SanityQueryParams = Record<string, string | number | boolean>

// Create Sanity client configuration
export function getSanityConfig(): ClientConfig {
	return {
		projectId: PUBLIC_SANITY_PROJECT_ID,
		dataset: PUBLIC_SANITY_DATASET,
		apiVersion: '2024-01-01', // Use current date or latest API version
		useCdn: PUBLIC_SANITY_CDN === 'true' // Convert string to boolean
		// token: env.SANITY_TOKEN // Optional: for authenticated requests
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

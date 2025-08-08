/// <reference types="@sveltejs/kit" />

interface ImportMetaEnv {
	readonly PUBLIC_SANITY_PROJECT_ID?: string
	readonly PUBLIC_SANITY_DATASET?: string
	readonly PUBLIC_SANITY_CDN?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
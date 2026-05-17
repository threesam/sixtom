import prettier from 'eslint-config-prettier'
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import ts from 'typescript-eslint'

export default defineConfig(
	{
		ignores: [
			'build/**',
			'.svelte-kit/**',
			'dist/**',
			'.vercel/**',
			'node_modules/**',
			'coverage/**',
			'static/**',
			'playwright-report/**',
			'test-results/**'
		]
	},
	js.configs.recommended,
	...ts.configs.strictTypeChecked,
	...ts.configs.stylisticTypeChecked,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						'eslint.config.js',
						'svelte.config.js',
						'playwright.config.ts',
						'e2e/constants.ts',
						'e2e/notify-form.spec.ts'
					]
				},
				extraFileExtensions: ['.svelte'],
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
				projectService: {
					allowDefaultProject: [
						'eslint.config.js',
						'svelte.config.js',
						'playwright.config.ts',
						'e2e/constants.ts',
						'e2e/notify-form.spec.ts'
					]
				},
				extraFileExtensions: ['.svelte'],
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		rules: {
			// External-link href values (e.g., Cal.com, garden) don't go through SvelteKit's resolve().
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		// Legacy Sanity v2 schema files use the framework's `any`-typed PreviewProps.
		// Studio runs client-side, gated to /sanity; not part of the marketing build.
		files: ['src/schemas/**/*.ts'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/restrict-template-expressions': 'off'
		}
	}
)

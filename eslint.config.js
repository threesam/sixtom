import prettier from 'eslint-config-prettier'
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import ts from 'typescript-eslint'

// Root config files sit outside every tsconfig's include, so they need the
// default project. The e2e specs used to live here too, but the default project
// is capped at 8 files and they blew past it — e2e/tsconfig.json owns them now.
const ALLOW_DEFAULT_PROJECT = ['eslint.config.js', 'svelte.config.js', 'playwright.config.ts']

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
			'test-results/**',
			// One-off dev tooling (image capture/optimize, manual nav smoke).
			// Not part of the production build; skipped from type-aware lint.
			'scripts/**'
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
				projectService: { allowDefaultProject: ALLOW_DEFAULT_PROJECT },
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
				projectService: { allowDefaultProject: ALLOW_DEFAULT_PROJECT },
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
	}
)

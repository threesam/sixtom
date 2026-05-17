import { defineConfig, devices } from '@playwright/test'

const PORT = '4173'
const BASE_URL = `http://127.0.0.1:${PORT}`
const inCI = process.env.CI === 'true' || process.env.CI === '1'

export default defineConfig({
	testDir: 'e2e',
	fullyParallel: false,
	forbidOnly: inCI,
	retries: inCI ? 2 : 0,
	reporter: 'list',
	use: {
		baseURL: BASE_URL,
		trace: 'on-first-retry'
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		// pnpm preview serves the production build; matches what Lighthouse + production see.
		command: `pnpm build && pnpm preview --port ${PORT} --host 127.0.0.1`,
		url: BASE_URL,
		timeout: 120_000,
		reuseExistingServer: !inCI,
		env: {
			// Bypass SMTP for the form-action test; processSubmission honors this env var.
			CONTACT_FORM_TEST_EMAIL: 'e2e@test.sixtom.local'
		}
	}
})

import { defineConfig, devices } from '@playwright/test'
import { TEST_EMAIL } from './e2e/constants'

const PORT = '4173'
const BASE_URL = `http://127.0.0.1:${PORT}`
const inCI = process.env.CI === 'true' || process.env.CI === '1'

export default defineConfig({
	testDir: 'e2e',
	// Sequential because processSubmission's rate-limit Map is process-global; parallel
	// tests on the same dev IP would trigger 429 across tests.
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
		command: `pnpm build && pnpm preview --port ${PORT} --host 127.0.0.1`,
		url: BASE_URL,
		timeout: 180_000,
		reuseExistingServer: !inCI,
		env: {
			CONTACT_FORM_TEST_EMAIL: TEST_EMAIL,
			// 1ms keeps the time-trap path live (still a real check) without forcing each
			// test to wait 3s. The unit test asserts the trap fires at the threshold.
			CONTACT_FORM_MIN_SUBMIT_MS: '1'
		}
	}
})

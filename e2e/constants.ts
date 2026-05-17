// Shared between playwright.config (sets webServer.env) and the spec (uses it in fixtures).
// `*.local` is a non-routable RFC-6762 TLD so a leak doesn't point at a real inbox.
export const TEST_EMAIL = 'e2e@test.sixtom.local'

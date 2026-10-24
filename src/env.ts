import { defineEnvVars } from '@sveltejs/kit/env'

// Every server env var the app reads. All optional: each caller already
// handles unset (defaults, or a guarded early return). A var not declared here
// does not exist as far as $app/env/private is concerned.
const optional = (value: string | undefined) => value

export const variables = defineEnvVars({
	CONTACT_FORM_MIN_SUBMIT_MS: { schema: optional },
	CONTACT_FORM_RATE_LIMIT_WINDOW_MS: { schema: optional },
	CONTACT_FORM_RATE_LIMIT_MAX_REQUESTS: { schema: optional },
	// e2e only — must be empty in production
	CONTACT_FORM_TEST_EMAIL: { schema: optional },
	SMTP_SERVER: { schema: optional },
	SMTP_PORT: { schema: optional },
	SMTP_EMAIL: { schema: optional },
	SMTP_TOKEN: { schema: optional },
	SMTP_RECIPIENT_EMAIL: { schema: optional },
	CRON_SECRET: { schema: optional },
	GSC_SITE_URL: { schema: optional },
	GSC_OAUTH_CLIENT_ID: { schema: optional },
	GSC_OAUTH_CLIENT_SECRET: { schema: optional },
	GSC_OAUTH_REFRESH_TOKEN: { schema: optional },
	AI_GATEWAY_API_KEY: { schema: optional },
	VERCEL_OIDC_TOKEN: { schema: optional }
})

// Marketing page ships zero SvelteKit client JS. The contact form works via
// a native HTML POST to the action in +page.server.ts; static/enhance-form.js
// is a small deferred script that adds the inline "Sending..." UX as a
// progressive enhancement.
export const csr = false

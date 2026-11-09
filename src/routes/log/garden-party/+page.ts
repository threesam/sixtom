// A static writeup with nothing to hydrate (the hero isn't clickable here and
// the slider is a native scroller), so it ships no framework JS, like home.
// Not prerendered: Vercel serves prerendered HTML without hooks.server.ts, so
// the page would lose its CSP and security headers.
export const csr = false

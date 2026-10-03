import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireServerEvent } from './umami'

const visitor = (url: string, headers: Record<string, string> = {}) => ({
	request: new Request(url, { headers: { 'user-agent': 'Mozilla/5.0 test', ...headers } }),
	getClientAddress: () => '203.0.113.7'
})

describe('fireServerEvent', () => {
	const fetchMock = vi.fn<typeof fetch>(() => Promise.resolve(new Response()))
	vi.stubGlobal('fetch', fetchMock)
	afterEach(() => fetchMock.mockClear())

	it('reports from the production host', async () => {
		await fireServerEvent('notify_signup_success', visitor('https://sixtom.com/notify?/notify'))
		expect(fetchMock).toHaveBeenCalledOnce()
	})

	// The visitor's ip + ua are what join the conversion to the session that
	// carried the UTM/referrer. Without them, signups-by-source is empty.
	it("forwards the visitor's ip, user agent and event data", async () => {
		await fireServerEvent('book_qualified', visitor('https://sixtom.com/book'), {
			budget: '15k-25k'
		})
		const body = fetchMock.mock.calls[0]?.[1]?.body as string
		const { payload } = JSON.parse(body) as { payload: unknown }
		expect(payload).toMatchObject({
			name: 'book_qualified',
			url: '/book',
			ip: '203.0.113.7',
			userAgent: 'Mozilla/5.0 test',
			data: { budget: '15k-25k' }
		})
	})

	it('stays silent on localhost and preview hosts', async () => {
		await fireServerEvent('notify_signup_success', visitor('http://localhost:5173/notify'))
		await fireServerEvent('notify_signup_success', visitor('https://sixtom-abc.vercel.app/notify'))
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('stays silent for ejected test browsers', async () => {
		await fireServerEvent(
			'notify_signup_success',
			visitor('https://sixtom.com/notify', { cookie: 'test_eject=1' })
		)
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('never throws when analytics is down', async () => {
		fetchMock.mockRejectedValueOnce(new Error('down'))
		await expect(
			fireServerEvent('notify_signup_success', visitor('https://sixtom.com/notify'))
		).resolves.toBeUndefined()
	})
})

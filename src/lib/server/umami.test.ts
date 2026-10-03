import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireServerEvent } from './umami'

describe('fireServerEvent', () => {
	const fetchMock = vi.fn(() => Promise.resolve(new Response()))
	vi.stubGlobal('fetch', fetchMock)
	afterEach(() => fetchMock.mockClear())

	it('reports from the production host', () => {
		fireServerEvent('notify_signup_success', new Request('https://sixtom.com/notify?/notify'))
		expect(fetchMock).toHaveBeenCalledOnce()
	})

	it('stays silent on localhost and preview hosts', () => {
		fireServerEvent('notify_signup_success', new Request('http://localhost:5173/notify'))
		fireServerEvent('notify_signup_success', new Request('https://sixtom-abc.vercel.app/notify'))
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('stays silent for ejected test browsers', () => {
		const request = new Request('https://sixtom.com/notify', {
			headers: { cookie: 'test_eject=1' }
		})
		fireServerEvent('notify_signup_success', request)
		expect(fetchMock).not.toHaveBeenCalled()
	})
})

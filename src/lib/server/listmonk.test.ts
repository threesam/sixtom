import { afterEach, describe, expect, it, vi } from 'vitest'
import { subscribeToList } from './listmonk'

vi.mock('$app/env/private', () => ({ LISTMONK_SIGNUP_TOKEN: 'tok' }))

const json = (status: number, body: unknown = {}) =>
	new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

describe('subscribeToList', () => {
	const fetchMock = vi.fn<typeof fetch>()
	vi.stubGlobal('fetch', fetchMock)
	afterEach(() => fetchMock.mockReset())

	// The list is private: only the authed admin api can write to it.
	it('creates the subscriber with the api user, never the public endpoint', async () => {
		fetchMock.mockResolvedValueOnce(json(200))
		expect(await subscribeToList('Ada@Example.com', 7)).toBe(true)
		const [url, init] = fetchMock.mock.calls[0] ?? []
		expect(url).toBe('https://mail.sixtom.com/api/subscribers')
		expect(new Headers(init?.headers).get('authorization')).toBe('token sixtom-signup:tok')
		expect(JSON.parse(init?.body as string)).toMatchObject({ email: 'ada@example.com', lists: [7] })
	})

	it('reports an address already on the box (409) as not added', async () => {
		fetchMock.mockResolvedValueOnce(json(409))
		expect(await subscribeToList('ada@example.com', 7)).toBe(false)
		expect(fetchMock).toHaveBeenCalledOnce()
	})

	it('reports failure instead of throwing when listmonk is down', async () => {
		fetchMock.mockRejectedValueOnce(new Error('ECONNREFUSED'))
		expect(await subscribeToList('ada@example.com', 7)).toBe(false)
	})
})

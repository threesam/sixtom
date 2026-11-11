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

	it('adds an address already on another list to this one, found by exact match', async () => {
		fetchMock
			.mockResolvedValueOnce(json(409))
			.mockResolvedValueOnce(
				json(200, {
					data: { results: [{ id: 42, email: 'a.b+x@example.com', status: 'enabled' }] }
				})
			)
			.mockResolvedValueOnce(json(200))
		expect(await subscribeToList('a.b+x@example.com', 7)).toBe(true)
		const search = new URL(fetchMock.mock.calls[1]?.[0] as string).searchParams.get('search')
		expect(search).toBe('^a\\.b\\+x@example\\.com$')
		const [url, init] = fetchMock.mock.calls[2] ?? []
		expect(url).toBe('https://mail.sixtom.com/api/subscribers/lists')
		expect(JSON.parse(init?.body as string)).toMatchObject({ ids: [42], target_list_ids: [7] })
	})

	it('leaves a blocklisted address off the list', async () => {
		fetchMock.mockResolvedValueOnce(json(409)).mockResolvedValueOnce(
			json(200, {
				data: { results: [{ id: 42, email: 'bot@example.com', status: 'blocklisted' }] }
			})
		)
		expect(await subscribeToList('bot@example.com', 7)).toBe(true)
		expect(fetchMock).toHaveBeenCalledTimes(2)
	})

	it('reports failure instead of throwing when listmonk is down', async () => {
		fetchMock.mockRejectedValueOnce(new Error('ECONNREFUSED'))
		expect(await subscribeToList('ada@example.com', 7)).toBe(false)
	})
})

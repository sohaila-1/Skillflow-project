import { apiFetch } from './api'

const mockKeycloak = {
  isTokenExpired: jest.fn(() => false),
  updateToken: jest.fn(),
  logout: jest.fn(),
  token: 'mock-token',
}

jest.mock('./keycloak', () => ({
  getKeycloak: () => mockKeycloak,
}))

describe('apiFetch', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    jest.clearAllMocks()
  })

  it('returns parsed JSON on a successful response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ id: '1', title: 'Test' }),
    }) as jest.Mock

    const result = await apiFetch<{ id: string; title: string }>('/courses')

    expect(result).toEqual({ id: '1', title: 'Test' })
  })

  it('throws an error with the status code on a non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => 'Course not found',
    }) as jest.Mock

    await expect(apiFetch('/courses/unknown')).rejects.toThrow('API 404: Course not found')
  })

  it('includes the Authorization header when a token is present', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => '[]',
    }) as jest.Mock

    await apiFetch('/courses')

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }),
      }),
    )
  })

  it('returns undefined when the response body is empty', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => '',
    }) as jest.Mock

    const result = await apiFetch('/health')

    expect(result).toBeUndefined()
  })
})

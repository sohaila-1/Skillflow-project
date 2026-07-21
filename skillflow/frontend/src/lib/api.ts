import { getKeycloak } from './keycloak'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1'

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const kc = getKeycloak()
  if (kc.isTokenExpired?.(30)) {
    await kc.updateToken(30).catch(() => kc.logout())
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(kc.token ? { Authorization: `Bearer ${kc.token}` } : {}),
      ...(options.headers as Record<string, string> ?? {}),
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`API ${res.status}: ${text}`)
  }

  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

import keycloak from './keycloak'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1'

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (keycloak.isTokenExpired?.(30)) {
    await keycloak.updateToken(30).catch(() => keycloak.logout())
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(keycloak.token ? { Authorization: `Bearer ${keycloak.token}` } : {}),
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

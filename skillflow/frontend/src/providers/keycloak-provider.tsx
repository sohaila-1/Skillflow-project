'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react'
import { getKeycloak } from '../lib/keycloak'

interface KeycloakUser {
  sub: string
  email: string
  preferred_username: string
  roles: string[]
}

interface KeycloakContextValue {
  isLoading: boolean
  isAuthenticated: boolean
  user: KeycloakUser | undefined
  token: string | undefined
  login: () => void
  register: () => void
  logout: () => void
}

const KeycloakContext = createContext<KeycloakContextValue | null>(null)

function parseUser(parsed: Record<string, unknown>): KeycloakUser {
  return {
    sub: parsed['sub'] as string,
    email: (parsed['email'] as string) ?? '',
    preferred_username: (parsed['preferred_username'] as string) ?? '',
    roles: (parsed['realm_access'] as { roles?: string[] } | undefined)?.roles ?? [],
  }
}

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading]             = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser]                       = useState<KeycloakUser | undefined>()
  const [token, setToken]                     = useState<string | undefined>()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const keycloak = getKeycloak()

    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated)
        if (authenticated && keycloak.tokenParsed) {
          setUser(parseUser(keycloak.tokenParsed as Record<string, unknown>))
          setToken(keycloak.token)
        }
      })
      .finally(() => setIsLoading(false))

    // Renouvelle le token 60s avant expiration et met à jour l'état
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(60)
        .then(() => setToken(keycloak.token))
        .catch(() => keycloak.logout())
    }

    keycloak.onAuthRefreshSuccess = () => setToken(keycloak.token)
  }, [])

  return (
    <KeycloakContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        token,
        login:    () => getKeycloak().login({ redirectUri: window.location.origin + '/dashboard' }),
        register: () => getKeycloak().register({ redirectUri: window.location.origin + '/dashboard' }),
        logout:   () => getKeycloak().logout({ redirectUri: window.location.origin }),
      }}
    >
      {children}
    </KeycloakContext.Provider>
  )
}

export function useKeycloak(): KeycloakContextValue {
  const ctx = useContext(KeycloakContext)
  if (!ctx) throw new Error('useKeycloak must be used inside KeycloakProvider')
  return ctx
}

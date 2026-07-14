'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useKeycloak } from '../providers/keycloak-provider'

export function useRequireAuth(redirectTo = '/auth/login') {
  const { isLoading, isAuthenticated } = useKeycloak()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  return { isLoading, isAuthenticated }
}

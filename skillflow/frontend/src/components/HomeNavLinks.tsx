'use client'

import Link from 'next/link'
import { useKeycloak } from '../providers/keycloak-provider'

export default function HomeNavLinks() {
  const { isAuthenticated } = useKeycloak()

  return (
    <div style={{ display: 'flex', gap: 28, flex: 1 }}>
      <Link href="/courses" style={{ fontSize: 14, color: '#5C5C5C', fontWeight: 500, textDecoration: 'none' }}>
        Explore
      </Link>
      {!isAuthenticated && (
        <Link href="#how-it-works" style={{ fontSize: 14, color: '#5C5C5C', fontWeight: 500, textDecoration: 'none' }}>
          How it works
        </Link>
      )}
      {isAuthenticated && (
        <Link href="/dashboard" style={{ fontSize: 14, color: '#5C5C5C', fontWeight: 500, textDecoration: 'none' }}>
          My Learning
        </Link>
      )}
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useKeycloak } from '../providers/keycloak-provider'

export default function AuthNavActions() {
  const { isLoading, isAuthenticated, user, logout } = useKeycloak()

  if (isLoading) {
    return (
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '2px solid var(--border)',
        borderTopColor: 'var(--accent)',
        animation: 'spin 0.7s linear infinite',
      }} />
    )
  }

  if (isAuthenticated && user) {
    const initials = (user.preferred_username ?? user.email ?? '?')
      .charAt(0)
      .toUpperCase()

    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link href="/dashboard" style={{
          fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)',
          padding: '8px 14px',
        }}>
          Dashboard
        </Link>
        <Link href="/account" style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 14, color: '#fff',
          textDecoration: 'none',
        }}>
          {initials}
        </Link>
        <button
          onClick={logout}
          style={{
            fontSize: 13, fontWeight: 500, color: 'var(--text-muted)',
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
          }}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Link href="/auth/login" style={{
        padding: '8px 16px', color: 'var(--text-secondary)',
        fontSize: 14, fontWeight: 500,
      }}>
        Log in
      </Link>
      <Link href="/auth/register" style={{
        padding: '9px 20px', borderRadius: 'var(--radius)',
        background: 'var(--accent)', color: '#fff',
        fontSize: 14, fontWeight: 600, textDecoration: 'none',
      }}>
        Join for Free
      </Link>
    </div>
  )
}

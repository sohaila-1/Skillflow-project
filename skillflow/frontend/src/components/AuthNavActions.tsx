'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useKeycloak } from '../providers/keycloak-provider'
import { apiFetch } from '../lib/api'

export default function AuthNavActions() {
  const { isLoading, isAuthenticated, user, logout } = useKeycloak()
  const [open, setOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    apiFetch<{ avatarUrl?: string | null }>('/auth/profile')
      .then(p => { if (p?.avatarUrl) setAvatarUrl(p.avatarUrl) })
      .catch(() => {})
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        border: '2px solid #E0E0E0',
        borderTopColor: '#0056D2',
        animation: 'spin 0.7s linear infinite',
      }} />
    )
  }

  if (isAuthenticated && user) {
    const initials = (user.preferred_username ?? user.email ?? '?')
      .charAt(0)
      .toUpperCase()
    const displayName = user.preferred_username ?? user.email ?? 'Account'
    const email = user.email ?? ''
    const isAdmin = user.roles?.includes('admin')

    return (
      <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Account menu"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: avatarUrl ? 'transparent' : '#0056D2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 15, color: '#fff',
            border: avatarUrl ? '2px solid #E0E0E0' : 'none',
            cursor: 'pointer', overflow: 'hidden',
            boxShadow: open ? '0 0 0 3px rgba(0,86,210,0.25)' : 'none',
            transition: 'box-shadow 0.15s', padding: 0,
          }}
        >
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials}
        </button>

        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 10px)', right: 0,
            background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: 220, zIndex: 200,
          }}>
            {/* Header — clickable, goes to /account */}
            <Link href="/account" onClick={() => setOpen(false)} style={{ display: 'block', padding: '14px 16px', borderBottom: '1px solid #F0F0F0', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: avatarUrl ? 'transparent' : '#0056D2', border: avatarUrl ? '2px solid #E0E0E0' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
                  {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1F1F1F', marginBottom: 1 }}>{displayName}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{email}</div>
                </div>
              </div>
              {isAdmin && (
                <span style={{
                  display: 'inline-block', marginTop: 8,
                  fontSize: 10, fontWeight: 700, color: '#0056D2',
                  background: '#EFF6FF', border: '1px solid #BFDBFE',
                  borderRadius: 4, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>Admin</span>
              )}
            </Link>

            {/* Links */}
            <div style={{ padding: '6px 0' }}>
              <Link href="/account" onClick={() => setOpen(false)} style={linkStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Profile &amp; Security
              </Link>
              <Link href="/dashboard" onClick={() => setOpen(false)} style={linkStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                Dashboard
              </Link>
              <Link href="/courses" onClick={() => setOpen(false)} style={linkStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                Browse Courses
              </Link>
              <Link href="/certificates" onClick={() => setOpen(false)} style={linkStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
                My Certificates
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)} style={linkStyle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Sign out */}
            <div style={{ borderTop: '1px solid #F0F0F0', padding: '6px 0' }}>
              <button
                onClick={() => { setOpen(false); logout() }}
                style={{
                  ...linkStyle,
                  background: 'none', border: 'none', width: '100%',
                  textAlign: 'left', cursor: 'pointer', color: '#DC2626',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Link href="/auth/login" style={{
        padding: '8px 16px', color: '#5C5C5C',
        fontSize: 14, fontWeight: 500, textDecoration: 'none',
      }}>
        Log in
      </Link>
      <Link href="/auth/register" style={{
        padding: '9px 20px', borderRadius: 4,
        background: '#0056D2', color: '#fff',
        fontSize: 14, fontWeight: 600, textDecoration: 'none',
      }}>
        Join for Free
      </Link>
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '9px 16px', fontSize: 14, color: '#1F1F1F',
  fontWeight: 500, textDecoration: 'none',
  transition: 'background 0.1s',
}

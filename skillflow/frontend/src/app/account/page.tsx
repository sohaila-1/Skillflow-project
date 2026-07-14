'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useKeycloak } from '../../providers/keycloak-provider'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import { apiFetch } from '../../lib/api'

const KEYCLOAK_URL  = process.env.NEXT_PUBLIC_KEYCLOAK_URL  ?? 'http://localhost:8080'
const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? 'skillflow'
const ACCOUNT_URL   = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/account`

function Spinner({ size = 32 }: { size?: number }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      border: '3px solid var(--border)', borderTopColor: 'var(--accent)',
      display: 'inline-block', animation: 'spin 0.7s linear infinite',
    }} />
  )
}

export default function AccountPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const { user, logout }           = useKeycloak()

  const [totpEnabled, setTotpEnabled]   = useState<boolean | null>(null)
  const [totpLoading, setTotpLoading]   = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage]           = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    if (authLoading || !user) return
    apiFetch<{ enabled: boolean }>('/auth/2fa/status')
      .then(r => setTotpEnabled(r.enabled))
      .catch(() => setTotpEnabled(false))
      .finally(() => setTotpLoading(false))
  }, [authLoading, user])

  async function handleDisableTotp() {
    setActionLoading(true)
    setMessage(null)
    try {
      await apiFetch('/auth/2fa', { method: 'DELETE' })
      setTotpEnabled(false)
      setMessage({ text: '2FA removed successfully.', ok: true })
    } catch {
      setMessage({ text: 'Failed to remove 2FA. Please try again.', ok: false })
    } finally {
      setActionLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Spinner />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const displayName = user?.preferred_username ?? user?.email ?? ''
  const initials    = displayName.charAt(0).toUpperCase()

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Nav */}
      <nav style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none' }}>
              ← Dashboard
            </Link>
            <button onClick={logout} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '40px 24px 80px', maxWidth: 720 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6, color: 'var(--text)' }}>
          Account & Security
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
          Manage your profile and authentication settings.
        </p>

        {/* Profile card */}
        <section style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 20,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>Profile</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 24, color: '#fff', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{displayName}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <a
            href={`${ACCOUNT_URL}/#/personal-info`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600,
              color: 'var(--text-secondary)', background: 'var(--bg)', textDecoration: 'none',
            }}
          >
            Edit profile on Keycloak
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </section>

        {/* Password card */}
        <section style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 20,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>Password</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
            Your password is managed by Keycloak. You can change it or request a reset link via email.
          </p>
          <a
            href={`${ACCOUNT_URL}/#/security/signingin`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600,
              color: 'var(--text-secondary)', background: 'var(--bg)', textDecoration: 'none',
            }}
          >
            Change password on Keycloak
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </section>

        {/* 2FA card */}
        <section style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 20,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
              Two-Factor Authentication (2FA)
            </h2>
            {totpLoading ? (
              <Spinner size={20} />
            ) : (
              <span style={{
                padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                background: totpEnabled ? 'var(--green-dim)' : 'var(--bg-subtle)',
                color:      totpEnabled ? 'var(--green)'     : 'var(--text-muted)',
                border: `1px solid ${totpEnabled ? '#BBF7D0' : 'var(--border)'}`,
                flexShrink: 0,
              }}>
                {totpEnabled ? '✓ Enabled' : 'Disabled'}
              </span>
            )}
          </div>

          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
            Protect your account with a time-based one-time password (TOTP).
            Compatible with <strong>Aegis</strong>, Google Authenticator, and any standard TOTP app.
          </p>

          {message && (
            <div style={{
              padding: '10px 16px', borderRadius: 'var(--radius)', marginBottom: 16,
              background: message.ok ? 'var(--green-dim)' : '#FEF2F2',
              border: `1px solid ${message.ok ? '#BBF7D0' : '#FECACA'}`,
              color: message.ok ? 'var(--green)' : '#DC2626',
              fontSize: 13, fontWeight: 600,
            }}>
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {/* Enable — always visible, opens Keycloak account console */}
            <a
              href={`${ACCOUNT_URL}/#/security/signingin`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', background: 'var(--accent)', color: '#fff',
                borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 700,
                textDecoration: 'none',
                opacity: totpEnabled ? 0.5 : 1,
                pointerEvents: totpEnabled ? 'none' : 'auto',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              {totpEnabled ? '2FA already enabled' : 'Set up 2FA'}
            </a>

            {/* Disable — only shown when TOTP is active */}
            {totpEnabled && (
              <button
                onClick={handleDisableTotp}
                disabled={actionLoading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', background: '#FEF2F2', color: '#DC2626',
                  border: '1px solid #FECACA', borderRadius: 'var(--radius)',
                  fontSize: 13, fontWeight: 700, cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                {actionLoading ? <Spinner size={14} /> : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                )}
                Remove 2FA
              </button>
            )}
          </div>
        </section>

        {/* Danger zone */}
        <section style={{
          background: 'var(--bg)', border: '1px solid #FECACA',
          borderRadius: 'var(--radius-xl)', padding: '28px 32px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#DC2626' }}>Sign out</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
            This will end your session on all devices.
          </p>
          <button
            onClick={logout}
            style={{
              padding: '10px 20px', background: '#FEF2F2', color: '#DC2626',
              border: '1px solid #FECACA', borderRadius: 'var(--radius)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Sign out of SkillFlow
          </button>
        </section>
      </div>
    </div>
  )
}

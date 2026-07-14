'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useKeycloak } from '../../../providers/keycloak-provider'

export default function RegisterPage() {
  const { register, login, isLoading, isAuthenticated } = useKeycloak()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard')
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)',
      }}>
        <span style={{
          width: 32, height: 32, border: '3px solid var(--border)',
          borderTopColor: 'var(--green)', borderRadius: '50%',
          display: 'inline-block', animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-heading)', fontSize: 20,
          fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)',
        }}>
          Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
        </Link>
        <Link href="/" className="nav-link" style={{
          fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to home
        </Link>
      </nav>

      {/* Two-column layout */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Left brand panel */}
        <div className="hide-mobile" style={{
          width: 420, background: 'var(--green-dim)',
          borderRight: '1px solid #BBF7D0',
          padding: '64px 48px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-heading)', fontSize: 22,
            fontWeight: 800, color: 'var(--green)', marginBottom: 24,
          }}>
            Start learning today
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36 }}>
            Join 10,000+ learners building the skills they need for tomorrow.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { text: 'Free access to selected courses', icon: '🆓' },
              { text: 'Learn at your own pace, anytime', icon: '⏰' },
              { text: 'Get a certificate on every completion', icon: '📜' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius)',
                  background: 'var(--green)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>{item.icon}</div>
                <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5, paddingTop: 6 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — register card */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '48px 24px',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)', padding: '40px 36px',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h1 style={{
                fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em',
                marginBottom: 8, color: 'var(--text)',
              }}>
                Create your account
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
                You will be redirected to our secure registration page.
              </p>

              <button
                onClick={() => register()}
                className="btn-primary"
                style={{
                  width: '100%', padding: '13px',
                  background: 'var(--green)', color: '#fff',
                  borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 700,
                  border: 'none', cursor: 'pointer', marginBottom: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Create Free Account
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>already have an account?</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              <button
                onClick={() => login()}
                className="btn-outline"
                style={{
                  width: '100%', padding: '12px',
                  background: 'var(--bg)', color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Sign in instead
              </button>

              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Authentication is secured by Keycloak.<br/>
                Your password is never stored by SkillFlow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

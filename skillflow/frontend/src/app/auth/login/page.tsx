'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    window.location.href = '/dashboard'
  }

  return (
    <div style={{
      background: 'var(--bg)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top nav */}
      <nav style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
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
          width: 420, background: 'var(--accent-dim)',
          borderRight: '1px solid #BFDBFE',
          padding: '64px 48px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--accent)', marginBottom: 24 }}>
            Welcome back to SkillFlow
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36 }}>
            Continue your learning journey where you left off.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { text: 'Access 200+ expert-led courses', icon: '🎓' },
              { text: 'Track your progress on every lesson', icon: '📊' },
              { text: 'Earn certificates recognized by top companies', icon: '🏆' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius)',
                  background: 'var(--accent)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>{item.icon}</div>
                <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5, paddingTop: 6 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form area */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '48px 24px',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            {/* Card */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px 36px',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h1 style={{
                fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em',
                marginBottom: 6, color: 'var(--text)',
              }}>
                Sign in to your account
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
                Enter your credentials to continue
              </p>

              {/* OAuth buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                {[
                  {
                    name: 'Google',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    ),
                  },
                  {
                    name: 'GitHub',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    ),
                  },
                ].map(p => (
                  <button key={p.name} className="btn-outline" style={{
                    padding: '10px', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', color: 'var(--text-secondary)',
                    fontSize: 14, fontWeight: 500, background: 'var(--bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                    {p.icon} {p.name}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>or continue with email</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {error && (
                  <div style={{
                    background: 'var(--red-dim)', border: '1px solid #FECACA',
                    borderRadius: 'var(--radius)', padding: '10px 14px',
                    color: 'var(--red)', fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 7, color: 'var(--text)' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="form-input"
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)', color: 'var(--text)',
                      fontSize: 14,
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                      Password
                    </label>
                    <Link href="#" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>Forgot password?</Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)', color: 'var(--text)',
                      fontSize: 14,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: '100%', padding: '12px',
                    background: loading ? 'var(--bg-subtle)' : 'var(--accent)',
                    color: loading ? 'var(--text-muted)' : '#fff',
                    borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 700,
                    marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: 16, height: 16, border: '2px solid var(--border)',
                        borderTopColor: 'var(--accent)', borderRadius: '50%',
                        display: 'inline-block', animation: 'spin 0.7s linear infinite',
                      }} />
                      Signing in…
                    </>
                  ) : 'Sign In'}
                </button>
              </form>
            </div>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

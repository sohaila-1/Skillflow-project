'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'

type Role = 'student' | 'instructor'

export default function RegisterPage() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole]         = useState<Role>('student')
  const [agreed, setAgreed]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) { setError('Please fill in all fields.'); return }
    if (!agreed) { setError('You must accept the Terms of Service.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    window.location.href = '/dashboard'
  }

  const passwordStrong = password.length >= 8

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <nav style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
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
            Start learning today
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36 }}>
            Join thousands of learners who are building in-demand skills with SkillFlow.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { text: 'Free access to select course previews', icon: '🎓' },
              { text: 'Learn at your own pace, any device', icon: '📱' },
              { text: 'Certificate of completion for every course', icon: '🏆' },
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
          <div style={{ width: '100%', maxWidth: 460 }}>
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
                Create your account
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
                Join 10,000+ learners growing their skills daily
              </p>

              {/* Role selector */}
              <div style={{ marginBottom: 26 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                  I&apos;m a…
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {([
                    {
                      id: 'student' as Role,
                      label: "I'm a Student",
                      sub: 'Enroll in courses, track progress, earn certificates',
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                      ),
                    },
                    {
                      id: 'instructor' as Role,
                      label: "I'm an Instructor",
                      sub: 'Create courses, manage students, grow revenue',
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                      ),
                    },
                  ] as const).map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      style={{
                        padding: '14px',
                        border: `2px solid ${role === r.id ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        background: role === r.id ? 'var(--accent-dim)' : 'var(--bg)',
                        textAlign: 'left', cursor: 'pointer',
                        transition: 'var(--transition)',
                        position: 'relative',
                      }}
                    >
                      {role === r.id && (
                        <div style={{
                          position: 'absolute', top: 10, right: 10,
                          width: 18, height: 18, borderRadius: '50%',
                          background: 'var(--accent)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      )}
                      <div style={{
                        color: role === r.id ? 'var(--accent)' : 'var(--text-secondary)',
                        marginBottom: 8,
                      }}>{r.icon}</div>
                      <div style={{
                        fontSize: 13, fontWeight: 700,
                        color: role === r.id ? 'var(--accent)' : 'var(--text)',
                        marginBottom: 3,
                      }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{r.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="form-input"
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14,
                    }}
                  />
                </div>

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
                      borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 7, color: 'var(--text)' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="8+ characters"
                    className="form-input"
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: 'var(--bg)', border: `1px solid ${password.length > 0 ? (passwordStrong ? 'var(--green)' : 'var(--border)') : 'var(--border)'}`,
                      borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14,
                    }}
                  />
                  {password.length > 0 && (
                    <div style={{
                      fontSize: 12, marginTop: 6,
                      color: passwordStrong ? 'var(--green)' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      {passwordStrong ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Password looks good
                        </>
                      ) : `${8 - password.length} more characters needed`}
                    </div>
                  )}
                </div>

                {/* Terms checkbox */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 2 }}>
                  <div
                    onClick={() => setAgreed(!agreed)}
                    style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                      border: `2px solid ${agreed ? 'var(--accent)' : 'var(--border)'}`,
                      background: agreed ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'var(--transition)', cursor: 'pointer',
                    }}
                  >
                    {agreed && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    I agree to the{' '}
                    <Link href="#" style={{ color: 'var(--accent)' }}>Terms of Service</Link>{' '}and{' '}
                    <Link href="#" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>
                  </span>
                </label>

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
                      Creating account…
                    </>
                  ) : `Create ${role === 'instructor' ? 'Instructor' : 'Student'} Account →`}
                </button>
              </form>
            </div>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

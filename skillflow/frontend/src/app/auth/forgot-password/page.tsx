'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [submitting, setSub]  = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSub(true)
    setError('')
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSub(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <nav style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>
          Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
        </Link>
        <Link href="/auth/login" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to login
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '40px 36px', boxShadow: 'var(--shadow-md)' }}>

            {sent ? (
              /* Success state */
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-dim)', border: '1px solid rgba(22,163,74,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>
                  ✉️
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 12, letterSpacing: '-0.02em' }}>
                  Check your inbox
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
                  If <strong style={{ color: 'var(--text)' }}>{email}</strong> is linked to a SkillFlow account, you&apos;ll receive a password reset link shortly.
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                  Didn&apos;t receive it? Check your spam folder or wait a few minutes.
                </p>
                <Link href="/auth/login" style={{ display: 'inline-block', padding: '10px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  Back to login
                </Link>
              </div>
            ) : (
              /* Form state */
              <>
                <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-lg)', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 24 }}>
                  🔑
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text)' }}>
                  Forgot your password?
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65, marginBottom: 28 }}>
                  Enter the email address linked to your account and we&apos;ll send you a reset link.
                </p>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      style={{
                        width: '100%', padding: '10px 12px',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                        fontSize: 14, color: 'var(--text)', background: 'var(--surface)',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{ padding: '10px 14px', background: 'var(--red-dim)', border: '1px solid rgba(220,38,38,0.35)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--red)', marginBottom: 16, fontWeight: 600 }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !email.trim()}
                    style={{
                      width: '100%', padding: '12px',
                      background: submitting || !email.trim() ? 'rgba(0,86,210,0.5)' : 'var(--accent)',
                      color: '#fff', border: 'none', borderRadius: 'var(--radius)',
                      fontSize: 15, fontWeight: 700,
                      cursor: submitting || !email.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    }}
                  >
                    {submitting && (
                      <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    )}
                    {submitting ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>

                <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                  Remember your password?{' '}
                  <Link href="/auth/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

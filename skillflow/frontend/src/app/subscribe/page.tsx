'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiFetch } from '../../lib/api'
import { useKeycloak } from '../../providers/keycloak-provider'
import ThemeToggle from '../../components/ThemeToggle'

const FEATURES = [
  { icon: '👑', label: 'All premium courses', desc: 'Unlimited access to every premium course in the catalog' },
  { icon: '🎓', label: 'Certificates included', desc: 'Earn and share certificates for every completed course' },
  { icon: '🎯', label: 'Quizzes & assessments', desc: 'Test your knowledge and track mastery across topics' },
  { icon: '📈', label: 'Progress tracking', desc: 'Detailed learning analytics and completion dashboards' },
  { icon: '🚀', label: 'New courses monthly', desc: 'Fresh content added every month across all categories' },
  { icon: '💬', label: 'Priority support', desc: 'Get help faster with premium member support' },
]

function SubscribeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useKeycloak()
  const [activating, setActivating] = useState(false)
  const [done, setDone] = useState(false)

  const returnTo = searchParams.get('returnTo') ?? '/courses'

  async function handleActivate() {
    if (!isAuthenticated) {
      router.push(`/auth/login?returnTo=/subscribe?returnTo=${encodeURIComponent(returnTo)}`)
      return
    }
    setActivating(true)
    try {
      await apiFetch('/subscriptions/activate', { method: 'POST' })
      setDone(true)
      setTimeout(() => router.push(returnTo), 1800)
    } catch {
      setActivating(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* Nav */}
      <nav style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 60, gap: 16 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <span style={{ color: 'var(--border)' }}>›</span>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Premium</span>
          <div style={{ marginLeft: 'auto' }}>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '56px 24px 80px', maxWidth: 960 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--orange-dim)', border: '1px solid rgba(217,119,6,0.4)', borderRadius: 100, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ fontSize: 16 }}>👑</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>SkillFlow Premium</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Unlock unlimited learning
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>
            Get full access to all premium courses, certificates, and future content — for one simple monthly price.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>

          {/* Features grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '20px 20px' }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{f.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Pricing card */}
          <div style={{ background: 'var(--surface)', border: '2px solid var(--accent)', borderRadius: 12, padding: '32px 28px', boxShadow: 'var(--shadow)', position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Most popular
            </div>

            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 42, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>$9</span>
              <span style={{ fontSize: 18, color: 'var(--text-secondary)', fontWeight: 500 }}>.99<span style={{ fontSize: 15 }}>/month</span></span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28 }}>30-day free trial · Cancel anytime</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {['All premium courses', 'Certificates of completion', 'Quizzes & progress tracking', 'New courses every month'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text)' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, flexShrink: 0 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            {done ? (
              <div style={{ textAlign: 'center', padding: '16px', background: 'var(--green-dim)', border: '1px solid rgba(22,163,74,0.35)', borderRadius: 8 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>🎉</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green)' }}>Premium activated!</div>
                <div style={{ fontSize: 13, color: 'var(--green)', marginTop: 4 }}>Redirecting you now…</div>
              </div>
            ) : (
              <button
                onClick={handleActivate}
                disabled={activating}
                style={{
                  width: '100%', padding: '14px', borderRadius: 8,
                  background: activating ? 'rgba(0,86,210,0.5)' : 'var(--accent)',
                  color: '#fff', border: 'none',
                  fontSize: 16, fontWeight: 700, cursor: activating ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {activating ? 'Activating…' : isAuthenticated ? 'Start Free Trial' : 'Sign in to Subscribe'}
              </button>
            )}

            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
              No credit card required during the free trial.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-subtle)' }} />}>
      <SubscribeContent />
    </Suspense>
  )
}

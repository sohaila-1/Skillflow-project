'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useKeycloak } from '../providers/keycloak-provider'
import { apiFetch } from '../lib/api'

interface Enrollment {
  courseId: string
}

export default function HomeHero() {
  const { isAuthenticated, isLoading, user } = useKeycloak()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [enrollLoaded, setEnrollLoaded] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    apiFetch<Enrollment[]>('/enrollments/me')
      .then(d => { setEnrollments(d); setEnrollLoaded(true) })
      .catch(() => setEnrollLoaded(true))
  }, [isAuthenticated])

  if (isLoading) {
    return <section style={{ background: 'var(--bg-alt)', padding: '72px 0 64px', borderBottom: '1px solid var(--border)', minHeight: 320 }} />
  }

  /* ── Authenticated hero ── */
  if (isAuthenticated && user) {
    const name = (user.preferred_username || user.email || 'there').split('@')[0]
    const count = enrollments.length

    return (
      <section style={{ background: 'linear-gradient(135deg, #0056D2 0%, #0077CC 60%, #0891B2 100%)', padding: '52px 0 48px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }}>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Welcome back
            </div>
            <h1 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 14, lineHeight: 1.15 }}>
              Hey, {name}! 👋
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: 28, maxWidth: 460 }}>
              {enrollLoaded && count > 0
                ? `You're enrolled in ${count} course${count > 1 ? 's' : ''}. Keep the momentum going!`
                : 'Ready to learn something new? Browse the catalog and enroll in a course.'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/dashboard" style={{ padding: '11px 24px', background: '#fff', color: '#0056D2', borderRadius: 4, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                {enrollLoaded && count > 0 ? 'Continue Learning' : 'My Dashboard'}
              </Link>
              <Link href="/courses" style={{ padding: '11px 24px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 4, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Quick-access cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 230 }}>
            {[
              { href: '/dashboard',    icon: '📖', label: 'Enrolled Courses',    value: enrollLoaded ? count.toString() : '—' },
              { href: '/certificates', icon: '🎓', label: 'My Certificates',      value: '→' },
              { href: '/account',      icon: '⚙️', label: 'Account & Security',   value: '→' },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 8, padding: '11px 16px',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </div>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{item.value}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ── Guest hero + How it works ── */
  return (
    <>
      <style>{`
        @keyframes heroFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .hero-cat { transition: transform .18s ease, box-shadow .18s ease; }
        .hero-cat:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(0,0,0,0.12); }
        .hero-cta-primary { transition: transform .15s ease, box-shadow .15s ease; box-shadow: 0 8px 20px rgba(0,86,210,0.28); }
        .hero-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,86,210,0.38); }
        @media (max-width: 860px) { .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }
      `}</style>
      <section style={{
        position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)',
        padding: '84px 0 76px',
        background: 'radial-gradient(circle at 12% 18%, rgba(0,86,210,0.12), transparent 42%), radial-gradient(circle at 88% 32%, rgba(8,145,178,0.12), transparent 46%), radial-gradient(circle at 50% 100%, rgba(124,58,237,0.08), transparent 55%), var(--bg-alt)',
      }}>
        {/* Decorative dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
          backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(circle at 50% 40%, #000 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 40%, #000 0%, transparent 75%)',
        }} />

        <div className="container hero-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            {/* Eyebrow badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 100, padding: '6px 14px', marginBottom: 22, boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: 13 }}>✨</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)' }}>100% free · Certificates included</span>
            </div>

            <h1 style={{ fontSize: 'clamp(34px, 4.4vw, 58px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 20 }}>
              Learn without{' '}
              <span style={{ background: 'linear-gradient(120deg, #0056D2, #0891B2 60%, #7C3AED)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                limits
              </span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 30, maxWidth: 460 }}>
              Start, switch, or advance your career with free online courses from top instructors. Get certificates and build real skills.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
              <Link href="/auth/register" className="hero-cta-primary" style={{ padding: '13px 28px', background: 'var(--accent)', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                Join for Free
              </Link>
              <Link href="/courses" style={{ padding: '13px 26px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
                Browse Courses
              </Link>
            </div>

            {/* Trust chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              {[
                { value: '10k+', label: 'learners' },
                { value: '4.9★', label: 'avg rating' },
                { value: '100%', label: 'free forever' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>{s.value}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category showcase */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, animation: 'heroFloat 6s ease-in-out infinite' }}>
            {[
              { icon: '💻', label: 'Programming',     color: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
              { icon: '🌐', label: 'Web Development', color: '#F0FDFA', border: '#99F6E4', text: '#0F766E' },
              { icon: '📊', label: 'Data Science',    color: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
              { icon: '🐳', label: 'DevOps',          color: '#FEF2F2', border: '#FECACA', text: '#B91C1C' },
              { icon: '🎨', label: 'Design',          color: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
              { icon: '📚', label: 'General',         color: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
            ].map(cat => (
              <Link key={cat.label} href="/courses" style={{ textDecoration: 'none' }}>
                <div className="hero-cat" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: cat.color, border: `1px solid ${cat.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {cat.icon}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — guests only */}
      <section id="how-it-works" style={{ background: 'var(--surface)', padding: '72px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 700, color: 'var(--text)', marginBottom: 48, letterSpacing: '-0.01em' }}>How SkillFlow works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40 }}>
            {[
              { n: '1', title: 'Create an account',    desc: 'Sign up in seconds, completely free.' },
              { n: '2', title: 'Pick a course',        desc: 'Browse our catalog and enroll instantly.' },
              { n: '3', title: 'Learn at your pace',   desc: 'Go through lessons on your schedule.' },
              { n: '4', title: 'Get your certificate', desc: 'Pass the quiz and receive your certificate.' },
            ].map(s => (
              <div key={s.n}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-heading)', marginBottom: 16 }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

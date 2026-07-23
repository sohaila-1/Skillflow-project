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
    return <section style={{ background: '#F5F7F8', padding: '72px 0 64px', borderBottom: '1px solid #E0E0E0', minHeight: 320 }} />
  }

  /* ── Authenticated hero ── */
  if (isAuthenticated && user) {
    const name = user.preferred_username || user.email || 'there'
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
              {
                href: '/dashboard',
                icon: '📖',
                label: 'Enrolled Courses',
                value: enrollLoaded ? count.toString() : '—',
              },
              {
                href: '/certificates',
                icon: '🎓',
                label: 'My Certificates',
                value: '→',
              },
              {
                href: '/account',
                icon: '⚙️',
                label: 'Account & Security',
                value: '→',
              },
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
      <section style={{ background: '#F5F7F8', padding: '72px 0 64px', borderBottom: '1px solid #E0E0E0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1F1F1F', marginBottom: 20 }}>
              Learn without<br />limits
            </h1>
            <p style={{ fontSize: 16, color: '#5C5C5C', lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Start, switch, or advance your career with free online courses from top instructors. Get certificates and build real skills.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/auth/register" style={{ padding: '12px 24px', background: '#0056D2', color: '#fff', borderRadius: 4, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
                Join for Free
              </Link>
              <Link href="/courses" style={{ padding: '12px 24px', background: '#fff', color: '#1F1F1F', border: '2px solid #1F1F1F', borderRadius: 4, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Mock progress card */}
          <div style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0056D2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Your Learning · Progress</div>
            {[
              { title: 'Python for Beginners', cat: 'Programming',     pct: 65,  color: '#0056D2' },
              { title: 'Web Dev with React',   cat: 'Web Development', pct: 30,  color: '#0891B2' },
              { title: 'Data Science',         cat: 'Data Science',    pct: 100, color: '#16A34A' },
            ].map((c, i) => (
              <div key={i} style={{ paddingBottom: i < 2 ? 18 : 0, marginBottom: i < 2 ? 18 : 0, borderBottom: i < 2 ? '1px solid #F0F0F0' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1F1F1F', marginBottom: 2 }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: '#5C5C5C' }}>{c.cat}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: c.pct === 100 ? '#16A34A' : '#0056D2' }}>{c.pct}%</span>
                </div>
                <div style={{ height: 5, background: '#F0F0F0', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${c.pct}%`, height: '100%', background: c.pct === 100 ? '#16A34A' : c.color, borderRadius: 10 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: '12px 16px', background: '#FFF8E6', border: '1px solid #F59E0B', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>Certificate Earned</div>
                <div style={{ fontSize: 11, color: '#B45309' }}>Data Science · Score 90%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — guests only */}
      <section id="how-it-works" style={{ background: '#fff', padding: '72px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 700, color: '#1F1F1F', marginBottom: 48, letterSpacing: '-0.01em' }}>How SkillFlow works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40 }}>
            {[
              { n: '1', title: 'Create an account',    desc: 'Sign up in seconds, completely free.' },
              { n: '2', title: 'Pick a course',        desc: 'Browse our catalog and enroll instantly.' },
              { n: '3', title: 'Learn at your pace',   desc: 'Go through lessons on your schedule.' },
              { n: '4', title: 'Get your certificate', desc: 'Pass the quiz and receive your certificate.' },
            ].map(s => (
              <div key={s.n}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EFF6FF', border: '2px solid #0056D2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#0056D2', fontFamily: 'var(--font-heading)', marginBottom: 16 }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F1F1F', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#5C5C5C', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

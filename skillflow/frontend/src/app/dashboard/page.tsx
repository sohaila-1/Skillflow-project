'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useKeycloak } from '../../providers/keycloak-provider'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import { apiFetch } from '../../lib/api'

interface Enrollment {
  id: string
  courseId: string
  enrolledAt: string
}

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
}

const BAND_COLORS: Record<string, string> = {
  'Web Dev': '#0056D2', 'AI & ML': '#16A34A', 'Design': '#D97706',
  'Backend': '#7C3AED', 'DevOps': '#DC2626', 'General': '#0891B2',
}

function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)' }}>
      <span style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '3px solid var(--border)', borderTopColor: 'var(--accent)',
        display: 'inline-block', animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function DashboardPage() {
  const { isLoading } = useRequireAuth()
  const { user, logout } = useKeycloak()
  const isInstructor = user?.roles?.includes('instructor') || user?.roles?.includes('admin')
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courses, setCourses]         = useState<Record<string, Course>>({})

  useEffect(() => {
    apiFetch<Enrollment[]>('/enrollments/me').then(async data => {
      setEnrollments(data)
      const courseMap: Record<string, Course> = {}
      await Promise.all(data.map(async e => {
        try {
          const c = await apiFetch<Course>(`/courses/${e.courseId}`)
          courseMap[e.courseId] = c
        } catch {}
      }))
      setCourses(courseMap)
    }).catch(() => {})
  }, [])

  if (isLoading) return <Spinner />

  const displayName = user?.preferred_username ?? user?.email ?? 'there'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/courses" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Browse Courses</Link>
            <Link href="/account" title="Account & Security" style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: '#fff', textDecoration: 'none',
            }}>
              {initials}
            </Link>
            <button
              onClick={logout}
              style={{
                fontSize: 13, color: 'var(--text-muted)', background: 'none',
                border: 'none', cursor: 'pointer', fontWeight: 500,
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '36px 24px 80px' }}>

        {/* Welcome banner */}
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20, boxShadow: 'var(--shadow-sm)',
        }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>Welcome back,</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text)' }}>
              {displayName} 👋
            </h1>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {(user?.roles ?? []).filter(r => ['student','instructor','admin'].includes(r)).map(r => (
                <span key={r} style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
                  background: r === 'admin' ? '#FEF3C7' : r === 'instructor' ? 'var(--accent-dim)' : 'var(--green-dim)',
                  color: r === 'admin' ? '#92400E' : r === 'instructor' ? 'var(--accent)' : 'var(--green)',
                  border: `1px solid ${r === 'admin' ? '#FDE68A' : r === 'instructor' ? '#BFDBFE' : '#BBF7D0'}`,
                  textTransform: 'capitalize',
                }}>{r}</span>
              ))}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--green-dim)', border: '1px solid #BBF7D0', borderRadius: 100, padding: '4px 12px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
              <span style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600 }}>7-day streak — keep it up!</span>
            </div>
          </div>
          <Link href="/courses" style={{
            padding: '11px 20px', background: 'var(--accent)', color: '#fff',
            borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
          }}>
            Explore Courses
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Enrolled Courses', value: enrollments.length.toString(), icon: '📚', color: 'var(--accent)', bg: 'var(--accent-dim)' },
            { label: 'Certificates',     value: '0',                           icon: '🏆', color: '#7C3AED',       bg: '#F5F3FF' },
            { label: 'Hours Learned',    value: '0',                           icon: '⏱',  color: 'var(--orange)', bg: 'var(--orange-dim)' },
            { label: 'Completed',        value: '0',                           icon: '✅', color: 'var(--green)',  bg: 'var(--green-dim)' },
          ].map(s => (
            <div key={s.label} className="card-hover" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 'var(--radius)', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-heading)', color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* My courses */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>My Courses</h2>
                <div style={{ display: 'flex', gap: 12 }}>
                  {isInstructor && (
                    <Link href="/courses/new" style={{ fontSize: 13, color: '#fff', fontWeight: 600, background: 'var(--accent)', padding: '6px 14px', borderRadius: 'var(--radius)', textDecoration: 'none' }}>+ Create Course</Link>
                  )}
                  <Link href="/courses" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Browse →</Link>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {enrollments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>No courses yet</div>
                    <Link href="/courses" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>Browse courses →</Link>
                  </div>
                ) : enrollments.map(e => {
                  const c = courses[e.courseId]
                  const color = BAND_COLORS[c?.category ?? ''] ?? '#0891B2'
                  return (
                    <div key={e.id} className="card-hover" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📚</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: 'var(--text)', marginBottom: 4 }}>{c?.title ?? 'Loading…'}</h3>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{c?.category} · {c?.level}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            Enrolled {new Date(e.enrolledAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Account & Security card */}
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px', boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Account</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 18, color: '#fff', flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{displayName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
                </div>
              </div>
              <Link href="/account" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: 'var(--radius)',
                background: 'var(--accent-dim)', border: '1px solid #BFDBFE',
                fontSize: 13, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none',
              }}>
                Security & 2FA settings
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            {/* Recent enrollments */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>Recent Activity</h3>
              {enrollments.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No activity yet</div>
              ) : enrollments.slice(0, 4).map((e, i) => (
                <div key={e.id} style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: i < 3 ? 14 : 0, marginBottom: i < 3 ? 14 : 0, borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🚀</div>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text)' }}>Enrolled in <strong>{courses[e.courseId]?.title ?? '…'}</strong></div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(e.enrolledAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px', boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text)' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Take a Quiz',        href: '/courses/1/quiz', icon: '🎯', bg: 'var(--accent-dim)', border: '#BFDBFE', color: 'var(--accent)' },
                  { label: 'Browse New Courses', href: '/courses',        icon: '🔍', bg: 'var(--green-dim)',  border: '#BBF7D0', color: 'var(--green)' },
                  { label: 'Account & Security', href: '/account',        icon: '🔐', bg: '#F5F3FF',          border: '#DDD6FE', color: '#7C3AED' },
                ].map(a => (
                  <Link key={a.label} href={a.href} className="card-hover" style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', borderRadius: 'var(--radius)',
                    background: a.bg, border: `1px solid ${a.border}`, textDecoration: 'none',
                  }}>
                    <span style={{ fontSize: 16 }}>{a.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.label}</span>
                    <svg style={{ marginLeft: 'auto' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

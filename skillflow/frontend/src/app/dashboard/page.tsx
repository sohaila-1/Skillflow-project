'use client'

import Link from 'next/link'
import { useKeycloak } from '../../providers/keycloak-provider'
import { useRequireAuth } from '../../hooks/useRequireAuth'

const ENROLLED_COURSES = [
  {
    id: '1', title: 'Complete Web Development Bootcamp', instructor: 'Alex Rivera',
    progress: 68, totalLessons: 186, completedLessons: 126,
    bandColor: '#0056D2', emoji: '💻', timeLeft: '14 hours',
  },
  {
    id: '2', title: 'Machine Learning Fundamentals', instructor: 'Dr. Sarah Chen',
    progress: 32, totalLessons: 124, completedLessons: 40,
    bandColor: '#16A34A', emoji: '🤖', timeLeft: '26 hours',
  },
  {
    id: '3', title: 'UI/UX Design Masterclass', instructor: 'Maya Johnson',
    progress: 100, totalLessons: 98, completedLessons: 98,
    bandColor: '#D97706', emoji: '🎨', timeLeft: '0 hours',
  },
]

const STATS = [
  { label: 'Enrolled Courses', value: '3',   icon: '📚', color: 'var(--accent)',  bg: 'var(--accent-dim)' },
  { label: 'Completed',        value: '1',   icon: '✅', color: 'var(--green)',   bg: 'var(--green-dim)' },
  { label: 'Hours Learned',    value: '127', icon: '⏱',  color: 'var(--orange)',  bg: 'var(--orange-dim)' },
  { label: 'Certificates',     value: '2',   icon: '🏆', color: '#7C3AED',        bg: '#F5F3FF' },
]

const ACTIVITY = [
  { text: 'Completed lesson "DOM Manipulation"',     time: '2 hours ago',  icon: '✅', color: 'var(--green)' },
  { text: 'Scored 85% on JavaScript Quiz',           time: '1 day ago',    icon: '🎯', color: 'var(--accent)' },
  { text: 'Started "Machine Learning Fundamentals"', time: '3 days ago',   icon: '🚀', color: 'var(--orange)' },
  { text: 'Earned UI/UX Design Certificate',         time: '1 week ago',   icon: '🏆', color: '#7C3AED' },
]

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
          {STATS.map(s => (
            <div key={s.label} className="card-hover" style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}>
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
                <Link href="/courses" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Browse more →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ENROLLED_COURSES.map(c => (
                  <div key={c.id} className="card-hover" style={{
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '20px 22px', boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: c.bandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: 'var(--text)' }}>{c.title}</h3>
                          <span style={{
                            background: c.progress === 100 ? 'var(--green-dim)' : 'var(--bg-subtle)',
                            color: c.progress === 100 ? 'var(--green)' : 'var(--text-secondary)',
                            fontSize: 11, fontWeight: 700, padding: '3px 10px',
                            borderRadius: 100, flexShrink: 0,
                            border: `1px solid ${c.progress === 100 ? '#BBF7D0' : 'var(--border)'}`,
                          }}>
                            {c.progress === 100 ? '✓ Done' : `${c.progress}%`}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>by {c.instructor}</div>
                        <div style={{ height: 5, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                          <div style={{ height: '100%', borderRadius: 3, width: `${c.progress}%`, background: c.progress === 100 ? 'var(--green)' : c.bandColor }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {c.completedLessons}/{c.totalLessons} lessons{c.progress < 100 && <> · {c.timeLeft} left</>}
                          </span>
                          {c.progress < 100 ? (
                            <Link href={`/courses/${c.id}`} style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                              </svg>
                              Continue
                            </Link>
                          ) : (
                            <Link href={`/courses/${c.id}/quiz`} style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>Take Quiz →</Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

            {/* Recent activity */}
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px', boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {ACTIVITY.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    paddingBottom: i < ACTIVITY.length - 1 ? 16 : 0,
                    marginBottom: i < ACTIVITY.length - 1 ? 16 : 0,
                    borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{a.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, lineHeight: 1.45, marginBottom: 2, color: 'var(--text)' }}>{a.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
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

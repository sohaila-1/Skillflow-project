import Link from 'next/link'

const ENROLLED_COURSES = [
  {
    id: '1', title: 'Complete Web Development Bootcamp', instructor: 'Alex Rivera',
    progress: 68, totalLessons: 186, completedLessons: 126,
    nextLesson: 'React Hooks Deep Dive', bandColor: '#0056D2', emoji: '💻',
    timeLeft: '14 hours', category: 'Web Dev',
  },
  {
    id: '2', title: 'Machine Learning Fundamentals', instructor: 'Dr. Sarah Chen',
    progress: 32, totalLessons: 124, completedLessons: 40,
    nextLesson: 'Linear Regression', bandColor: '#16A34A', emoji: '🤖',
    timeLeft: '26 hours', category: 'AI & ML',
  },
  {
    id: '3', title: 'UI/UX Design Masterclass', instructor: 'Maya Johnson',
    progress: 100, totalLessons: 98, completedLessons: 98,
    nextLesson: 'Completed!', bandColor: '#D97706', emoji: '🎨',
    timeLeft: '0 hours', category: 'Design',
  },
]

const STATS = [
  { label: 'Enrolled Courses', value: '3',   icon: '📚', color: 'var(--accent)',  bg: 'var(--accent-dim)' },
  { label: 'Completed',        value: '1',   icon: '✅', color: 'var(--green)',   bg: 'var(--green-dim)' },
  { label: 'Hours Learned',    value: '127', icon: '⏱', color: 'var(--orange)',  bg: 'var(--orange-dim)' },
  { label: 'Certificates',     value: '2',   icon: '🏆', color: '#7C3AED',        bg: '#F5F3FF' },
]

const ACTIVITY = [
  { text: 'Completed lesson "DOM Manipulation"',        time: '2 hours ago',  icon: '✅', color: 'var(--green)' },
  { text: 'Scored 85% on JavaScript Quiz',              time: '1 day ago',    icon: '🎯', color: 'var(--accent)' },
  { text: 'Started "Machine Learning Fundamentals"',    time: '3 days ago',   icon: '🚀', color: 'var(--orange)' },
  { text: 'Earned UI/UX Design Certificate',            time: '1 week ago',   icon: '🏆', color: '#7C3AED' },
]

const CERTIFICATES = [
  { title: 'UI/UX Design Masterclass',  date: 'May 28, 2025',   id: 'SF-2025-0328', bandColor: '#D97706' },
  { title: 'CSS Animations & Effects',  date: 'April 10, 2025', id: 'SF-2025-0217', bandColor: '#0056D2' },
]

export default function DashboardPage() {
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
            <Link href="/courses" className="nav-link" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Browse Courses</Link>
            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: '#fff', cursor: 'pointer',
            }}>A</div>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '36px 24px 80px' }}>

        {/* ── Welcome banner ─────────────────────────────────── */}
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>Welcome back,</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text)' }}>
              Alex 👋
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'var(--green-dim)', border: '1px solid #BBF7D0',
                borderRadius: 100, padding: '4px 12px',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
                <span style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600 }}>7-day streak</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Keep it up!</span>
            </div>
          </div>
          <Link href="/courses" className="btn-primary" style={{
            padding: '11px 20px', background: 'var(--accent)', color: '#fff',
            borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none',
          }}>
            Explore More Courses
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* ── Stats row ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {STATS.map(s => (
            <div key={s.label} className="card-hover" style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 'var(--radius)',
                background: s.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 20, marginBottom: 14,
              }}>{s.icon}</div>
              <div style={{
                fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-heading)',
                color: s.color, lineHeight: 1, marginBottom: 4,
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

          {/* ── Left column ───────────────────────────────────── */}
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
                    borderRadius: 'var(--radius-lg)', padding: '20px 22px',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      {/* Course icon */}
                      <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius)',
                        background: c.bandColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, flexShrink: 0,
                      }}>{c.emoji}</div>

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

                        {/* Progress bar */}
                        <div style={{ height: 5, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            width: `${c.progress}%`,
                            background: c.progress === 100 ? 'var(--green)' : c.bandColor,
                          }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {c.completedLessons}/{c.totalLessons} lessons
                            {c.progress < 100 && <> · {c.timeLeft} left</>}
                          </span>
                          {c.progress < 100 ? (
                            <Link href={`/courses/${c.id}`} style={{
                              fontSize: 12, color: 'var(--accent)', fontWeight: 700,
                              display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                              </svg>
                              Continue
                            </Link>
                          ) : (
                            <Link href={`/courses/${c.id}/quiz`} style={{
                              fontSize: 12, color: 'var(--green)', fontWeight: 700,
                            }}>Take Quiz →</Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Certificates</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CERTIFICATES.map(cert => (
                  <div key={cert.id} className="card-hover" style={{
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '18px 22px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 'var(--radius)',
                      background: cert.bandColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                    }}>🏆</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, color: 'var(--text)' }}>{cert.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Earned {cert.date} · ID: {cert.id}
                      </div>
                    </div>
                    <button className="btn-outline" style={{
                      padding: '7px 14px', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)', fontSize: 12, fontWeight: 600,
                      color: 'var(--text-secondary)', background: 'var(--bg)', cursor: 'pointer',
                    }}>Download</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column ──────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Weekly activity chart */}
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>Weekly Activity</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const heights = [40, 70, 55, 90, 65, 30, 80]
                  const active  = i < 6
                  return (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 26, height: heights[i],
                        background: active ? 'var(--accent)' : 'var(--bg-subtle)',
                        borderRadius: 4,
                        opacity: active ? (i === 3 ? 1 : 0.75) : 1,
                        border: active ? 'none' : '1px solid var(--border)',
                      }} />
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{day}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{
                background: 'var(--bg-subtle)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '10px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>This week</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>14.5 hrs</span>
              </div>
            </div>

            {/* Recent activity */}
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px',
              boxShadow: 'var(--shadow-sm)',
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
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--bg-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13,
                    }}>{a.icon}</div>
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
              borderRadius: 'var(--radius-lg)', padding: '22px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text)' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Take a Quiz',         href: '/courses/1/quiz', icon: '🎯', bg: 'var(--accent-dim)',  border: '#BFDBFE', color: 'var(--accent)' },
                  { label: 'Browse New Courses',  href: '/courses',         icon: '🔍', bg: 'var(--green-dim)',  border: '#BBF7D0', color: 'var(--green)' },
                  { label: 'View Certificates',   href: '#',                icon: '🏆', bg: '#F5F3FF',           border: '#DDD6FE', color: '#7C3AED' },
                ].map(a => (
                  <Link key={a.label} href={a.href} className="card-hover" style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', borderRadius: 'var(--radius)',
                    background: a.bg, border: `1px solid ${a.border}`,
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

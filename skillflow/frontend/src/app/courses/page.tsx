'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { apiFetch } from '../../lib/api'
import { useKeycloak } from '../../providers/keycloak-provider'

interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  category: string
  level: string
  isPremium: boolean
  published: boolean
  createdAt: string
}

const BAND_COLORS: Record<string, string> = {
  'Web Dev': '#0056D2', 'AI & ML': '#16A34A', 'Design': '#D97706',
  'Backend': '#7C3AED', 'DevOps': '#DC2626', 'General': '#0891B2',
}

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function CoursesPage() {
  const { isAuthenticated, user } = useKeycloak()
  const [courses, setCourses]         = useState<Course[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [category, setCategory]       = useState('All')
  const [level, setLevel]             = useState('All')
  const [enrolling, setEnrolling]     = useState<string | null>(null)
  const [enrolled, setEnrolled]       = useState<Set<string>>(new Set())
  const [message, setMessage]         = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`)
      .then(r => r.json())
      .then((data: Course[]) => setCourses(data.filter(c => c.published)))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    apiFetch<{ courseId: string }[]>('/enrollments/me')
      .then(data => setEnrolled(new Set(data.map(e => e.courseId))))
      .catch(() => {})
  }, [isAuthenticated])

  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(courses.map(c => c.category)))]
    return cats
  }, [courses])

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchSearch   = c.title.toLowerCase().includes(search.toLowerCase()) ||
                            c.description.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'All' || c.category === category
      const matchLevel    = level === 'All' || c.level === level
      return matchSearch && matchCategory && matchLevel
    })
  }, [courses, search, category, level])

  async function handleEnroll(course: Course) {
    if (!isAuthenticated) { window.location.href = '/auth/login'; return }
    if (course.isPremium) {
      window.location.href = `/subscribe?returnTo=/courses`
      return
    }
    setEnrolling(course.id)
    try {
      await apiFetch('/enrollments', { method: 'POST', body: JSON.stringify({ courseId: course.id }) })
      setEnrolled(prev => new Set(Array.from(prev).concat(course.id)))
      setMessage({ text: 'Enrolled successfully!', ok: true })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error'
      if (msg.includes('402') || msg.includes('PAYMENT')) {
        window.location.href = `/subscribe?returnTo=/courses`
        return
      }
      setMessage({ text: msg.includes('409') ? 'Already enrolled' : 'Failed to enroll', ok: false })
    } finally {
      setEnrolling(null)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', gap: 12 }}>
            {isAuthenticated
              ? <Link href="/dashboard" style={{ padding: '7px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600 }}>Dashboard</Link>
              : <>
                  <Link href="/auth/login" style={{ padding: '7px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', background: 'var(--bg)' }}>Log in</Link>
                  <Link href="/auth/register" style={{ padding: '7px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600 }}>Join for Free</Link>
                </>
            }
          </div>
        </div>
      </nav>

      {/* Toast message */}
      {message && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 999,
          background: message.ok ? '#16A34A' : '#DC2626',
          color: '#fff', padding: '10px 20px', borderRadius: 'var(--radius)',
          fontSize: 14, fontWeight: 600, boxShadow: 'var(--shadow)',
        }}>{message.text}</div>
      )}

      {/* Header */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '40px 0 32px' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6, color: 'var(--text)' }}>All Courses</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 76 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Filters</div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Category</div>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '7px 12px', marginBottom: 4,
                border: `1px solid ${category === c ? 'var(--accent)' : 'transparent'}`,
                borderRadius: 'var(--radius-sm)',
                background: category === c ? 'var(--accent-dim)' : 'transparent',
                color: category === c ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 14, fontWeight: category === c ? 600 : 400, cursor: 'pointer',
              }}>{c}</button>
            ))}
          </div>

          <div style={{ paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Level</div>
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '7px 12px', marginBottom: 4,
                border: `1px solid ${level === l ? 'var(--accent)' : 'transparent'}`,
                borderRadius: 'var(--radius-sm)',
                background: level === l ? 'var(--accent-dim)' : 'transparent',
                color: level === l ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 14, fontWeight: level === l ? 600 : 400, cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search courses…"
              style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14 }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading courses…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>No courses yet</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>Check back soon or clear your filters</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 20 }}>
              {filtered.map(course => {
                const color = BAND_COLORS[course.category] ?? '#0891B2'
                const isEnrolled = enrolled.has(course.id)
                return (
                  <div key={course.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                    <Link href={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ height: 100, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📚</div>
                        {course.isPremium && (
                          <div style={{ position: 'absolute', top: 8, right: 8, background: '#F59E0B', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.04em' }}>
                            👑 PREMIUM
                          </div>
                        )}
                      </div>
                    </Link>
                    <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'inline-block', background: 'var(--bg-subtle)', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 100, marginBottom: 10 }}>{course.category}</div>
                      <Link href={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 5, color: 'var(--text)' }}>{course.title}</h3>
                      </Link>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>{course.level}</div>
                      <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                        {course.instructorId === user?.sub ? (
                          <>
                            <Link href={`/courses/${course.id}/edit`} style={{
                              flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', textAlign: 'center',
                              background: 'var(--accent-dim)', color: 'var(--accent)',
                              border: '1px solid #BFDBFE', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                            }}>Edit</Link>
                            <Link href={`/courses/${course.id}`} style={{
                              flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', textAlign: 'center',
                              background: 'var(--accent)', color: '#fff',
                              border: 'none', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                            }}>View</Link>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course)}
                            disabled={isEnrolled || enrolling === course.id}
                            style={{
                              width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)',
                              background: isEnrolled ? 'var(--green-dim)' : course.isPremium ? '#FFF8E6' : 'var(--accent)',
                              color: isEnrolled ? 'var(--green)' : course.isPremium ? '#92400E' : '#fff',
                              border: isEnrolled ? '1px solid #BBF7D0' : course.isPremium ? '1px solid #F59E0B' : 'none',
                              fontSize: 13, fontWeight: 600, cursor: isEnrolled ? 'default' : 'pointer',
                            }}
                          >
                            {enrolling === course.id ? 'Enrolling…' : isEnrolled ? '✓ Enrolled' : course.isPremium ? '👑 Get Premium' : 'Enroll Free'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

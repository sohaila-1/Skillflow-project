'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { apiFetch } from '../../../lib/api'
import { useKeycloak } from '../../../providers/keycloak-provider'

interface Section {
  title: string
  type: 'youtube' | 'pdf'
  url: string
}

interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  category: string
  level: string
  published: boolean
  sections: Section[]
  createdAt: string
}

const BAND_COLORS: Record<string, string> = {
  'Web Dev': '#0056D2', 'AI & ML': '#16A34A', 'Design': '#D97706',
  'Backend': '#7C3AED', 'DevOps': '#DC2626', 'General': '#0891B2',
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useKeycloak()
  const [course, setCourse]     = useState<Course | null>(null)
  const [loading, setLoading]   = useState(true)
  const [active, setActive]     = useState(0)
  const [enrolled, setEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    apiFetch<Course>(`/courses/${id}`)
      .then(c => { setCourse(c); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!isAuthenticated) return
    apiFetch<{ courseId: string }[]>('/enrollments/me')
      .then(data => setEnrolled(data.some(e => e.courseId === id)))
      .catch(() => {})
  }, [isAuthenticated, id])

  async function handleEnroll() {
    if (!isAuthenticated) { window.location.href = '/auth/login'; return }
    setEnrolling(true)
    try {
      await apiFetch('/enrollments', { method: 'POST', body: JSON.stringify({ courseId: id }) })
      setEnrolled(true)
    } catch {}
    setEnrolling(false)
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>Loading…</div>
  if (!course) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>Course not found</div>

  const color = BAND_COLORS[course.category] ?? '#0891B2'
  const activeSection = course.sections[active]
  const ytId = activeSection?.type === 'youtube' ? getYoutubeId(activeSection.url) : null

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <Link href="/courses" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>← All Courses</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: color, padding: '40px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 100, marginBottom: 14 }}>{course.category} · {course.level}</div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', maxWidth: 700, marginBottom: 16 }}>{course.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 600, lineHeight: 1.6, marginBottom: 24 }}>{course.description}</p>
          <button onClick={handleEnroll} disabled={enrolled || enrolling} style={{
            padding: '12px 28px', borderRadius: 'var(--radius)',
            background: enrolled ? 'rgba(255,255,255,0.2)' : '#fff',
            color: enrolled ? '#fff' : color,
            border: enrolled ? '2px solid rgba(255,255,255,0.5)' : 'none',
            fontSize: 15, fontWeight: 700, cursor: enrolled ? 'default' : 'pointer',
          }}>
            {enrolling ? 'Enrolling…' : enrolled ? '✓ Enrolled' : 'Enroll for Free'}
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        {/* Sidebar — section list */}
        {course.sections.length > 0 && (
          <aside style={{ width: 280, flexShrink: 0, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 76 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
              Course Content · {course.sections.length} section{course.sections.length !== 1 ? 's' : ''}
            </div>
            {course.sections.map((sec, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '14px 20px', textAlign: 'left',
                background: active === i ? 'var(--accent-dim)' : 'transparent',
                border: 'none', borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{sec.type === 'youtube' ? '▶' : '📄'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: active === i ? 700 : 500, color: active === i ? 'var(--accent)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sec.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sec.type === 'youtube' ? 'Video' : 'PDF'}</div>
                </div>
              </button>
            ))}
          </aside>
        )}

        {/* Main content area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {course.sections.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>No content yet</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>The instructor hasn&apos;t added content yet</div>
            </div>
          ) : activeSection ? (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                  Section {active + 1} of {course.sections.length}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{activeSection.title}</h2>
              </div>

              {/* YouTube embed */}
              {activeSection.type === 'youtube' && ytId && (
                <div style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* PDF viewer */}
              {activeSection.type === 'pdf' && (
                <div style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>{activeSection.title}</div>
                  <a href={activeSection.url} target="_blank" rel="noreferrer" style={{
                    display: 'inline-block', padding: '12px 28px',
                    background: 'var(--accent)', color: '#fff',
                    borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  }}>
                    Open PDF →
                  </a>
                </div>
              )}

              {/* Navigation */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0} style={{
                  padding: '8px 18px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                  background: 'var(--bg)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
                  cursor: active === 0 ? 'not-allowed' : 'pointer', opacity: active === 0 ? 0.4 : 1,
                }}>← Previous</button>
                <button onClick={() => setActive(a => Math.min(course.sections.length - 1, a + 1))} disabled={active === course.sections.length - 1} style={{
                  padding: '8px 18px', borderRadius: 'var(--radius)', border: 'none',
                  background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: active === course.sections.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: active === course.sections.length - 1 ? 0.4 : 1,
                }}>Next →</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

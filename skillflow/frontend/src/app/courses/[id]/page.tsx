'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { apiFetch } from '../../../lib/api'
import { useKeycloak } from '../../../providers/keycloak-provider'

interface Lesson {
  title: string
  duration: string
  content: string
}

interface Section {
  title: string
  lessons: Lesson[]
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

const CATEGORY_COLORS: Record<string, string> = {
  'Programming':     '#2563EB',
  'Web Development': '#0891B2',
  'Data Science':    '#16A34A',
  'DevOps':          '#DC2626',
  'Design':          '#D97706',
  'General':         '#7C3AED',
}

const CATEGORY_ICONS: Record<string, string> = {
  'Programming':     '💻',
  'Web Development': '🌐',
  'Data Science':    '📊',
  'DevOps':          '🐳',
  'Design':          '🎨',
  'General':         '📚',
}

function getLessonKey(courseId: string, sectionIdx: number, lessonIdx: number) {
  return `${courseId}-s${sectionIdx}-l${lessonIdx}`
}

function loadProgress(courseId: string): Set<string> {
  try {
    const raw = localStorage.getItem(`progress-${courseId}`)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveProgress(courseId: string, done: Set<string>) {
  localStorage.setItem(`progress-${courseId}`, JSON.stringify(Array.from(done)))
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated, user } = useKeycloak()

  const [course, setCourse]         = useState<Course | null>(null)
  const [loading, setLoading]       = useState(true)
  const [enrolled, setEnrolled]     = useState(false)
  const [enrolling, setEnrolling]   = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [hasQuiz, setHasQuiz]       = useState(false)

  const [activeSection, setActiveSection] = useState(0)
  const [activeLesson, setActiveLesson]   = useState(0)
  const [completed, setCompleted]         = useState<Set<string>>(new Set())

  useEffect(() => {
    apiFetch<Course>(`/courses/${id}`)
      .then(c => {
        setCourse(c)
        setCompleted(loadProgress(id))
        setLoading(false)
      })
      .catch(() => setLoading(false))

    apiFetch(`/courses/${id}/quiz`)
      .then(() => setHasQuiz(true))
      .catch(() => setHasQuiz(false))
  }, [id])

  useEffect(() => {
    if (!isAuthenticated) return
    apiFetch<{ courseId: string }[]>('/enrollments/me')
      .then(data => setEnrolled(data.some(e => e.courseId === id)))
      .catch(() => {})
  }, [isAuthenticated, id])

  const markComplete = useCallback(() => {
    if (!course) return
    const key = getLessonKey(id, activeSection, activeLesson)
    const next = new Set(completed)
    next.add(key)
    setCompleted(next)
    saveProgress(id, next)

    const section = course.sections[activeSection]
    if (activeLesson < section.lessons.length - 1) {
      setActiveLesson(l => l + 1)
    } else if (activeSection < course.sections.length - 1) {
      setActiveSection(s => s + 1)
      setActiveLesson(0)
    }
  }, [id, activeSection, activeLesson, completed, course])

  async function handleEnroll() {
    if (!isAuthenticated) { router.push('/auth/login'); return }
    setEnrolling(true)
    try {
      await apiFetch('/enrollments', { method: 'POST', body: JSON.stringify({ courseId: id }) })
      setEnrolled(true)
    } catch {}
    setEnrolling(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this course? This cannot be undone.')) return
    setDeleting(true)
    try {
      await apiFetch(`/courses/${id}`, { method: 'DELETE' })
      router.push('/courses')
    } catch { setDeleting(false) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)' }}>
      <span style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!course) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>📭</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Course not found</div>
      <Link href="/courses" style={{ color: 'var(--accent)', fontWeight: 600 }}>Browse courses →</Link>
    </div>
  )

  const color = CATEGORY_COLORS[course.category] ?? '#0891B2'
  const icon  = CATEGORY_ICONS[course.category] ?? '📚'
  const isOwner = user?.sub === course.instructorId

  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0)
  const completedCount = completed.size
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const currentLesson = course.sections[activeSection]?.lessons[activeLesson]
  const currentKey    = getLessonKey(id, activeSection, activeLesson)
  const isCurrentDone = completed.has(currentKey)

  const flatLessons: { sIdx: number; lIdx: number }[] = []
  course.sections.forEach((s, sIdx) => s.lessons.forEach((_, lIdx) => flatLessons.push({ sIdx, lIdx })))
  const flatIndex = flatLessons.findIndex(f => f.sIdx === activeSection && f.lIdx === activeLesson)
  const prevLesson = flatLessons[flatIndex - 1]
  const nextLesson = flatLessons[flatIndex + 1]

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/courses" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none' }}>← All Courses</Link>
            {isOwner && (
              <>
                <Link href={`/courses/${id}/edit`} style={{ padding: '6px 14px', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600, background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid #BFDBFE', textDecoration: 'none' }}>Edit</Link>
                <button onClick={handleDelete} disabled={deleting} style={{ padding: '6px 14px', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', cursor: 'pointer' }}>
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`, padding: '40px 0 36px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 100 }}>{course.category}</span>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 100 }}>{course.level}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(20px,3.5vw,32px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 12, maxWidth: 700 }}>{course.title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, maxWidth: 600, lineHeight: 1.6, marginBottom: 20 }}>{course.description}</p>

              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                  📖 {course.sections.length} sections · {totalLessons} lessons
                </div>
                {enrolled && totalLessons > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 120, height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 3 }}>
                      <div style={{ width: `${progressPct}%`, height: '100%', background: '#fff', borderRadius: 3, transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{progressPct}%</span>
                  </div>
                )}
                {!isOwner && (
                  <button onClick={handleEnroll} disabled={enrolled || enrolling} style={{
                    padding: '10px 24px', borderRadius: 'var(--radius)',
                    background: enrolled ? 'rgba(255,255,255,0.15)' : '#fff',
                    color: enrolled ? '#fff' : color,
                    border: enrolled ? '2px solid rgba(255,255,255,0.5)' : 'none',
                    fontSize: 14, fontWeight: 700, cursor: enrolled ? 'default' : 'pointer',
                  }}>
                    {enrolling ? 'Enrolling…' : enrolled ? '✓ Enrolled' : 'Enroll for Free'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container" style={{ padding: '28px 24px 80px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <aside style={{ width: 300, flexShrink: 0, position: 'sticky', top: 76, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>

          {/* Progress card */}
          {enrolled && (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 12, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Your progress</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{completedCount}/{totalLessons}</span>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ width: `${progressPct}%`, height: '100%', background: progressPct === 100 ? 'var(--green)' : 'var(--accent)', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
              {progressPct === 100 && hasQuiz && (
                <Link href={`/courses/${id}/quiz`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 700, textDecoration: 'none', marginTop: 8 }}>
                  🎯 Take the Quiz
                </Link>
              )}
            </div>
          )}

          {/* Curriculum */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
              Course Content
            </div>
            {course.sections.map((sec, sIdx) => (
              <div key={sIdx}>
                <div style={{ padding: '10px 18px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {sec.title}
                </div>
                {sec.lessons.map((lesson, lIdx) => {
                  const key     = getLessonKey(id, sIdx, lIdx)
                  const isDone  = completed.has(key)
                  const isActive = activeSection === sIdx && activeLesson === lIdx
                  return (
                    <button
                      key={lIdx}
                      onClick={() => { setActiveSection(sIdx); setActiveLesson(lIdx) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '10px 18px', textAlign: 'left',
                        background: isActive ? 'var(--accent-dim)' : 'transparent',
                        border: 'none', borderBottom: '1px solid var(--border)',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                        background: isDone ? 'var(--green)' : isActive ? 'var(--accent)' : 'var(--border)',
                        color: isDone || isActive ? '#fff' : 'var(--text-muted)',
                        fontWeight: 700,
                      }}>
                        {isDone ? '✓' : lIdx + 1}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--accent)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lesson.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lesson.duration}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ))}

            {/* Quiz entry point */}
            {hasQuiz && (
              <Link href={`/courses/${id}/quiz`} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '12px 18px', textDecoration: 'none',
                background: 'var(--accent-dim)', borderTop: '2px solid var(--accent)',
              }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', flexShrink: 0 }}>🎯</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>Final Quiz</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pass with 70% to earn a certificate</div>
                </div>
              </Link>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {totalLessons === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>No content yet</div>
            </div>
          ) : currentLesson ? (
            <div>
              {/* Lesson header */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
                <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Section {activeSection + 1} · Lesson {activeLesson + 1}
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 8 }}>
                    {currentLesson.title}
                  </h2>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      ⏱ {currentLesson.duration}
                    </span>
                    {isCurrentDone && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', background: 'var(--green-dim)', padding: '2px 10px', borderRadius: 100, border: '1px solid #BBF7D0' }}>
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Lesson content */}
                <div style={{ padding: '32px 28px' }}>
                  <div style={{
                    fontSize: 16, lineHeight: 1.9, color: 'var(--text)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {currentLesson.content}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => prevLesson && (setActiveSection(prevLesson.sIdx), setActiveLesson(prevLesson.lIdx))}
                    disabled={!prevLesson}
                    style={{
                      padding: '9px 18px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                      background: 'var(--bg)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
                      cursor: prevLesson ? 'pointer' : 'not-allowed', opacity: prevLesson ? 1 : 0.4,
                    }}
                  >← Previous</button>

                  <div style={{ display: 'flex', gap: 10 }}>
                    {!isCurrentDone && (
                      <button onClick={markComplete} style={{
                        padding: '9px 20px', borderRadius: 'var(--radius)', border: 'none',
                        background: 'var(--green)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      }}>✓ Mark Complete</button>
                    )}
                    {nextLesson ? (
                      <button onClick={() => { setActiveSection(nextLesson.sIdx); setActiveLesson(nextLesson.lIdx) }} style={{
                        padding: '9px 20px', borderRadius: 'var(--radius)', border: 'none',
                        background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      }}>Next →</button>
                    ) : hasQuiz ? (
                      <Link href={`/courses/${id}/quiz`} style={{
                        padding: '9px 20px', borderRadius: 'var(--radius)',
                        background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                      }}>Take Quiz 🎯</Link>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* About this course card (shown at first lesson) */}
              {activeSection === 0 && activeLesson === 0 && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>About this course</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{course.description}</p>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Sections',  value: course.sections.length.toString() },
                      { label: 'Lessons',   value: totalLessons.toString() },
                      { label: 'Level',     value: course.level },
                      { label: 'Category',  value: course.category },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

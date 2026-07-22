'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useKeycloak } from '../../providers/keycloak-provider'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import { apiFetch } from '../../lib/api'
import AuthNavActions from '../../components/AuthNavActions'

interface Lesson   { title: string; duration: string; content?: string }
interface Section  { title: string; lessons: Lesson[] }
interface CourseEnrollment {
  id: string
  title: string
  description: string
  category: string
  level: string
  sections: Section[]
}

const CAT_COLOR: Record<string, string> = {
  'Programming': '#0056D2', 'Web Development': '#0891B2',
  'Data Science': '#16A34A', 'DevOps': '#DC2626',
  'Design': '#D97706', 'General': '#7C3AED',
}

function parseMins(dur: string) {
  const m = dur?.match(/(\d+)/)
  return m ? parseInt(m[1]) : 0
}

function getProgress(courseId: string): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem(`progress-${courseId}`)
    if (!raw) return 0
    const data = JSON.parse(raw) as Record<string, boolean>
    return Object.values(data).filter(Boolean).length
  } catch { return 0 }
}

function Shimmer({ w = '100%', h = 16, r = 4 }: { w?: string | number; h?: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg,#F5F5F5 25%,#EBEBEB 50%,#F5F5F5 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite'
    }} />
  )
}

function ProgressBar({ pct, color = '#0056D2' }: { pct: number; color?: string }) {
  return (
    <div style={{ height: 6, background: '#F0F0F0', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#16A34A' : color, borderRadius: 10, transition: 'width 0.4s' }} />
    </div>
  )
}

export default function DashboardPage() {
  useRequireAuth()
  const { user } = useKeycloak()

  const [enrolled, setEnrolled]   = useState<CourseEnrollment[]>([])
  const [all, setAll]             = useState<CourseEnrollment[]>([])
  const [loading, setLoading]     = useState(true)
  const [progress, setProgress]   = useState<Record<string, { done: number; total: number; pct: number }>>({})

  useEffect(() => {
    Promise.all([
      apiFetch<{ courseId: string }[]>('/enrollments/me').catch(() => []),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`).then(r => r.json()).catch(() => []),
    ]).then(([enrollRes, allRes]: [{ courseId: string }[], CourseEnrollment[]]) => {
      const allCourses      = Array.isArray(allRes) ? allRes : []
      const enrolledIds     = new Set((Array.isArray(enrollRes) ? enrollRes : []).map(e => e.courseId))
      const enrolledCourses = allCourses.filter(c => enrolledIds.has(c.id))

      setEnrolled(enrolledCourses)
      setAll(allCourses)

      const prog: Record<string, { done: number; total: number; pct: number }> = {}
      enrolledCourses.forEach((c: CourseEnrollment) => {
        const total = c.sections?.reduce((a: number, s: Section) => a + s.lessons.length, 0) ?? 0
        const done  = getProgress(c.id)
        prog[c.id]  = { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
      })
      setProgress(prog)
    }).finally(() => setLoading(false))
  }, [])

  const completedCount = Object.values(progress).filter(p => p.pct >= 100).length
  const inProgress     = enrolled.filter(c => (progress[c.id]?.pct ?? 0) < 100 && (progress[c.id]?.pct ?? 0) > 0)
  const notStarted     = enrolled.filter(c => (progress[c.id]?.pct ?? 0) === 0)
  const recommended    = all.filter(c => !enrolled.find(e => e.id === c.id)).slice(0, 3)
  const resumeCourse   = inProgress[0] ?? notStarted[0]

  const totalHours = enrolled.reduce((acc, c) => {
    const mins = c.sections?.reduce((s, sec) => s + sec.lessons.reduce((a, l) => a + parseMins(l.duration), 0), 0) ?? 0
    return acc + mins
  }, 0)

  const firstName = user?.preferred_username ?? ''

  return (
    <div style={{ background: '#F5F7F8', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      {/* ── Top bar ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E0E0E0', height: 56, display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: '#1F1F1F', textDecoration: 'none' }}>
            Skill<span style={{ color: '#0056D2' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link href="/courses" style={{ fontSize: 14, color: '#5C5C5C', fontWeight: 500, textDecoration: 'none' }}>Browse</Link>
            {(user?.roles ?? []).includes('instructor') && (
              <Link href="/courses/new" style={{ fontSize: 14, color: '#0056D2', fontWeight: 600, textDecoration: 'none' }}>+ Create Course</Link>
            )}
            <AuthNavActions />
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 36, alignItems: 'start' }}>

          {/* ── Left column ── */}
          <div>

            {/* Welcome */}
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1F1F1F', letterSpacing: '-0.02em', marginBottom: 4 }}>
                {loading ? 'My Learning' : `Welcome back${firstName ? `, ${firstName}` : ''}!`}
              </h1>
              <p style={{ fontSize: 14, color: '#5C5C5C' }}>Track your progress and continue where you left off.</p>
            </div>

            {/* Stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 36 }}>
              {loading
                ? [1,2,3,4].map(i => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, padding: '20px 20px' }}>
                    <Shimmer w="50%" h={28} r={4} />
                    <div style={{ marginTop: 8 }}><Shimmer w="80%" h={12} /></div>
                  </div>
                ))
                : [
                    { value: enrolled.length,                    label: 'Enrolled' },
                    { value: completedCount,                     label: 'Completed' },
                    { value: completedCount,                     label: 'Certificates' },
                    { value: `${Math.round(totalHours / 60)}h`, label: 'Hours learned' },
                  ].map(s => (
                  <div key={s.label} style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, padding: '16px 20px' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#1F1F1F', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))
              }
            </div>

            {/* Continue Learning */}
            {!loading && resumeCourse && (
              <div style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, padding: 24, marginBottom: 36 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#5C5C5C', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>
                  Continue Learning
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ width: 6, height: 72, borderRadius: 4, background: CAT_COLOR[resumeCourse.category] ?? '#0056D2', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: CAT_COLOR[resumeCourse.category] ?? '#0056D2', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                      {resumeCourse.category}
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#1F1F1F', marginBottom: 10 }}>{resumeCourse.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <ProgressBar pct={progress[resumeCourse.id]?.pct ?? 0} color={CAT_COLOR[resumeCourse.category]} />
                      </div>
                      <span style={{ fontSize: 12, color: '#5C5C5C', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {progress[resumeCourse.id]?.pct ?? 0}% complete
                      </span>
                    </div>
                  </div>
                  <Link href={`/courses/${resumeCourse.id}`} style={{ flexShrink: 0, padding: '10px 20px', background: '#0056D2', color: '#fff', borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Resume
                  </Link>
                </div>
              </div>
            )}

            {/* My Courses */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                <h2 style={{ fontSize: 19, fontWeight: 700, color: '#1F1F1F', letterSpacing: '-0.01em' }}>My Courses</h2>
                {enrolled.length > 0 && (
                  <span style={{ fontSize: 13, color: '#5C5C5C' }}>{enrolled.length} course{enrolled.length !== 1 ? 's' : ''} enrolled</span>
                )}
              </div>

              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: 5 }}><Shimmer h={5} /></div>
                      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Shimmer w="30%" h={10} /><Shimmer w="85%" h={14} /><Shimmer w="60%" h={10} /><Shimmer h={6} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : enrolled.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, padding: '52px 32px', textAlign: 'center' }}>
                  <div style={{ fontSize: 15, color: '#5C5C5C', marginBottom: 20 }}>You haven't enrolled in any courses yet.</div>
                  <Link href="/courses" style={{ padding: '10px 24px', background: '#0056D2', color: '#fff', borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {enrolled.map(course => {
                    const color    = CAT_COLOR[course.category] ?? '#7C3AED'
                    const prog     = progress[course.id] ?? { done: 0, total: 0, pct: 0 }
                    const isDone   = prog.pct >= 100
                    const total    = course.sections?.reduce((a,s) => a + s.lessons.length, 0) ?? 0

                    return (
                      <Link key={course.id} href={`/courses/${course.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                        <div
                          style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
                          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
                        >
                          <div style={{ height: 5, background: isDone ? '#16A34A' : color }} />
                          <div style={{ padding: '18px 18px 20px' }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                              {course.category}
                            </div>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F1F1F', lineHeight: 1.4, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {course.title}
                            </h3>

                            <div style={{ marginBottom: 8 }}>
                              <ProgressBar pct={prog.pct} color={color} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 12, color: '#9CA3AF' }}>{prog.done}/{total} lessons</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: isDone ? '#16A34A' : color }}>
                                {isDone ? 'Completed' : `${prog.pct}%`}
                              </span>
                            </div>

                            {isDone && (
                              <div style={{ marginTop: 12, padding: '8px 12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                                </svg>
                                <span style={{ fontSize: 12, color: '#15803D', fontWeight: 600 }}>Certificate earned</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Recommended */}
            {!loading && recommended.length > 0 && (
              <div>
                <h2 style={{ fontSize: 19, fontWeight: 700, color: '#1F1F1F', letterSpacing: '-0.01em', marginBottom: 20 }}>Recommended for you</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recommended.map(course => {
                    const color = CAT_COLOR[course.category] ?? '#7C3AED'
                    return (
                      <Link key={course.id} href={`/courses/${course.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                        <div
                          style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, display: 'flex', alignItems: 'center', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
                          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
                        >
                          <div style={{ width: 5, alignSelf: 'stretch', background: color, flexShrink: 0 }} />
                          <div style={{ padding: '16px 20px', flex: 1 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{course.category}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1F1F1F', marginBottom: 4 }}>{course.title}</div>
                            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{course.level}</div>
                          </div>
                          <div style={{ padding: '0 20px', flexShrink: 0 }}>
                            <span style={{ fontSize: 13, color: '#0056D2', fontWeight: 600 }}>Enroll →</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Profile card */}
            <div style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#0056D2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
                  {firstName?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1F1F1F' }}>{user?.preferred_username ?? 'Learner'}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{user?.email ?? ''}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 16, borderTop: '1px solid #F0F0F0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1F1F1F', fontFamily: 'var(--font-heading)' }}>{enrolled.length}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Courses</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid #F0F0F0' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1F1F1F', fontFamily: 'var(--font-heading)' }}>{completedCount}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Completed</div>
                </div>
              </div>
            </div>

            {/* Learning overview */}
            {!loading && enrolled.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1F1F1F', marginBottom: 18 }}>Learning Overview</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {enrolled.slice(0, 4).map(c => {
                    const prog  = progress[c.id] ?? { pct: 0 }
                    const color = CAT_COLOR[c.category] ?? '#7C3AED'
                    return (
                      <div key={c.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: '#5C5C5C', fontWeight: 500, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{c.title}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: prog.pct >= 100 ? '#16A34A' : color, marginLeft: 8, flexShrink: 0 }}>{prog.pct}%</span>
                        </div>
                        <ProgressBar pct={prog.pct} color={color} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Browse CTA */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 4, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1E3A8A', marginBottom: 8 }}>Discover more</div>
              <p style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.6, marginBottom: 16 }}>
                Explore our full course catalog and find your next skill.
              </p>
              <Link href="/courses" style={{ display: 'block', textAlign: 'center', padding: '10px 0', background: '#0056D2', color: '#fff', borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                Browse All Courses
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

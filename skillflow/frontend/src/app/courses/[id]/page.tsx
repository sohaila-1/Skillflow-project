'use client'

import { useState } from 'react'
import Link from 'next/link'

const COURSE_DATA: Record<string, {
  id: string; title: string; instructor: string; instructorRole: string;
  category: string; description: string; price: number; originalPrice: number;
  rating: number; reviews: number; students: number; duration: string;
  level: string; bandColor: string; emoji: string; lastUpdated: string;
  includes: string[]; modules: { title: string; lessons: { title: string; duration: string; free: boolean }[] }[];
}> = {
  '1': {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    instructor: 'Alex Rivera',
    instructorRole: 'Senior Engineer @ Google',
    category: 'Web Development',
    description: 'Become a full-stack web developer from scratch. Master HTML, CSS, JavaScript, React, Node.js, and databases through 186 hands-on lessons and real-world projects.',
    price: 89,
    originalPrice: 199,
    rating: 4.8,
    reviews: 3241,
    students: 12430,
    duration: '42 hours',
    level: 'Beginner',
    bandColor: '#0056D2',
    emoji: '💻',
    lastUpdated: 'May 2025',
    includes: ['186 video lessons', 'Downloadable source code', 'Certificate of completion', 'Lifetime access', '12 coding projects', 'Community Discord'],
    modules: [
      { title: 'HTML & CSS Foundations', lessons: [
        { title: 'Welcome & Course Overview', duration: '5:20', free: true },
        { title: 'Setting Up Your Environment', duration: '12:40', free: true },
        { title: 'HTML Essentials', duration: '28:15', free: false },
        { title: 'CSS Styling & Layout', duration: '34:50', free: false },
      ]},
      { title: 'JavaScript Mastery', lessons: [
        { title: 'JS Fundamentals', duration: '42:10', free: false },
        { title: 'DOM Manipulation', duration: '31:20', free: false },
        { title: 'Async JavaScript & Promises', duration: '38:45', free: false },
      ]},
      { title: 'React & Modern Frontend', lessons: [
        { title: 'React Basics & JSX', duration: '36:00', free: false },
        { title: 'React Hooks Deep Dive', duration: '44:30', free: false },
        { title: 'State Management', duration: '29:15', free: false },
      ]},
      { title: 'Backend with Node.js', lessons: [
        { title: 'Node.js & Express', duration: '48:00', free: false },
        { title: 'REST APIs', duration: '41:20', free: false },
        { title: 'Databases & PostgreSQL', duration: '52:10', free: false },
      ]},
    ],
  },
}

const FALLBACK_COURSE = COURSE_DATA['1']

function StarRating({ rating, large }: { rating: number; large?: boolean }) {
  const size = large ? 14 : 11
  return (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#F59E0B' : 'none'}
          stroke="#F59E0B" strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </span>
  )
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = COURSE_DATA[params.id] ?? FALLBACK_COURSE
  const [tab, setTab]                       = useState<'overview' | 'curriculum' | 'reviews'>('overview')
  const [expandedModule, setExpandedModule] = useState<number | null>(0)
  const [enrolled, setEnrolled]             = useState(false)

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0)

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
            <Link href="/courses" className="nav-link" style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              All Courses
            </Link>
            <Link href="/dashboard" className="btn-primary" style={{ padding: '7px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600 }}>Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Top banner — dark navy */}
      <div style={{
        background: '#0F172A',
        padding: '48px 0 40px',
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 48, alignItems: 'start' }}>
          {/* Left */}
          <div>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13 }}>
              <Link href="/courses" style={{ color: '#94A3B8' }}>Courses</Link>
              <span style={{ color: '#475569' }}>›</span>
              <span style={{ color: '#94A3B8' }}>{course.category}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 16, color: '#fff' }}>
              {course.title}
            </h1>
            <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, marginBottom: 24, maxWidth: 580 }}>
              {course.description}
            </p>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <StarRating rating={course.rating} large />
                <span style={{ fontWeight: 700, color: '#F59E0B', fontSize: 14 }}>{course.rating}</span>
                <span style={{ color: '#64748B', fontSize: 13 }}>({course.reviews.toLocaleString()} reviews)</span>
              </div>
              <span style={{ color: '#475569', fontSize: 13 }}>·</span>
              <span style={{ color: '#94A3B8', fontSize: 13 }}>{course.students.toLocaleString()} students</span>
              <span style={{ color: '#475569', fontSize: 13 }}>·</span>
              <span style={{ color: '#94A3B8', fontSize: 13 }}>Updated {course.lastUpdated}</span>
            </div>

            {/* Instructor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: course.bandColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, color: '#fff',
              }}>
                {course.instructor[0]}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{course.instructor}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{course.instructorRole}</div>
              </div>
            </div>
          </div>

          {/* Sticky enrollment card */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: '24px',
            position: 'sticky', top: 76,
            boxShadow: 'var(--shadow-lg)',
          }}>
            {/* Course image/emoji */}
            <div style={{
              height: 140, borderRadius: 'var(--radius-lg)',
              background: course.bandColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20, fontSize: 52,
            }}>{course.emoji}</div>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>${course.price}</span>
              <span style={{ fontSize: 15, color: 'var(--text-muted)', textDecoration: 'line-through' }}>${course.originalPrice}</span>
              <span style={{
                background: 'var(--green-dim)', color: 'var(--green)',
                fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
              }}>{Math.round((1 - course.price / course.originalPrice) * 100)}% off</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 500, marginBottom: 18 }}>Offer ends soon</div>

            <button
              onClick={() => setEnrolled(true)}
              className={enrolled ? 'btn-green' : 'btn-primary'}
              style={{
                width: '100%', padding: '13px',
                background: enrolled ? 'var(--green)' : 'var(--accent)',
                color: '#fff',
                borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 700,
                marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                border: 'none', cursor: 'pointer',
              }}
            >
              {enrolled ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Enrolled
                </>
              ) : 'Enroll Now'}
            </button>

            {enrolled && (
              <Link href={`/courses/${course.id}/quiz`} className="btn-outline" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                width: '100%', padding: '11px', textAlign: 'center',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginBottom: 10, background: 'var(--bg)',
              }}>
                Take Course Quiz →
              </Link>
            )}

            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 18 }}>
              30-day money-back guarantee
            </div>

            {/* Includes */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                This course includes
              </div>
              {course.includes.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs bar */}
      <div style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 60, zIndex: 90,
      }}>
        <div className="container" style={{ display: 'flex', gap: 0 }}>
          {(['overview', 'curriculum', 'reviews'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="tab-btn"
              style={{
                padding: '16px 24px', fontSize: 14, fontWeight: tab === t ? 700 : 400,
                color: tab === t ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,
                background: 'none', cursor: 'pointer', textTransform: 'capitalize',
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 780 }}>

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div>
              <div style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: 24,
                boxShadow: 'var(--shadow-sm)',
              }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>What you&apos;ll learn</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 32px' }}>
                  {[
                    'Build modern websites from scratch',
                    'Master React and component architecture',
                    'Create REST APIs with Node.js',
                    'Work with PostgreSQL databases',
                    'Deploy apps to the cloud',
                    'Write clean, maintainable code',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '28px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Requirements</h2>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['No prior coding experience required', 'A laptop or desktop computer', 'Motivation to learn and build projects'].map(r => (
                    <li key={r} style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700, marginTop: 1 }}>→</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── Curriculum ── */}
          {tab === 'curriculum' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Course curriculum</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  {course.modules.length} modules · {totalLessons} lessons · {course.duration}
                </span>
              </div>
              {course.modules.map((module, mi) => (
                <div key={mi} style={{
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden', marginBottom: 10,
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <button
                    onClick={() => setExpandedModule(expandedModule === mi ? null : mi)}
                    style={{
                      width: '100%', padding: '16px 20px',
                      background: 'var(--bg)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      border: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: 'var(--accent-dim)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 800, color: 'var(--accent)',
                      }}>{mi + 1}</div>
                      <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{module.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{module.lessons.length} lessons</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: expandedModule === mi ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </button>

                  {expandedModule === mi && (
                    <div style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
                      {module.lessons.map((lesson, li) => (
                        <div key={li} className="lesson-row" style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 20px 12px 56px',
                          borderBottom: li < module.lessons.length - 1 ? '1px solid var(--border)' : 'none',
                          background: 'var(--bg)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              {lesson.free
                                ? <><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></>
                                : <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>
                              }
                            </svg>
                            <span style={{ fontSize: 13, color: lesson.free ? 'var(--text)' : 'var(--text-secondary)' }}>
                              {lesson.title}
                            </span>
                            {lesson.free && (
                              <span style={{
                                background: 'var(--green-dim)', color: 'var(--green)',
                                fontSize: 10, fontWeight: 700, padding: '1px 8px', borderRadius: 100,
                              }}>FREE</span>
                            )}
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Reviews ── */}
          {tab === 'reviews' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--text)' }}>Student Reviews</h2>
              <div style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: 24,
                display: 'flex', alignItems: 'center', gap: 32,
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 56, fontWeight: 800, fontFamily: 'var(--font-heading)',
                    color: '#92400E', lineHeight: 1, marginBottom: 6,
                  }}>{course.rating}</div>
                  <StarRating rating={course.rating} large />
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Course rating</div>
                </div>
                <div style={{ flex: 1 }}>
                  {[5,4,3,2,1].map(star => {
                    const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 2 : 1
                    return (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 8 }}>{star}</span>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                        <div style={{ flex: 1, height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#F59E0B', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 28 }}>{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {[
                { name: 'Jamie L.', date: 'April 2025', rating: 5, text: "Best web dev course I've taken. Alex explains complex topics with incredible clarity. The projects are real-world and super satisfying to build." },
                { name: 'Priya N.', date: 'March 2025', rating: 5, text: 'Went from zero coding knowledge to building full-stack apps in 6 weeks. The structure is perfect — every lesson builds on the last.' },
                { name: 'Marco F.', date: 'February 2025', rating: 4, text: "Excellent content and great pacing. Would love more coverage on TypeScript and testing, but overall it's a phenomenal course." },
              ].map(r => (
                <div key={r.name} style={{
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 14,
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'var(--accent-dim)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 14, color: 'var(--accent)',
                    }}>{r.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}><StarRating rating={r.rating} /></div>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

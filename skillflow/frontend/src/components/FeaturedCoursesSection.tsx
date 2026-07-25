'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
  isPremium: boolean
  sections: { title: string; lessons: { title: string; duration: string }[] }[]
}

const CAT_COLOR: Record<string, string> = {
  'Programming': '#0056D2', 'Web Development': '#0891B2',
  'Data Science': '#16A34A', 'DevOps': '#DC2626',
  'Design': '#D97706', 'General': '#7C3AED',
}

const LEVEL_BADGE: Record<string, { bg: string; text: string }> = {
  'Beginner':     { bg: '#DCFCE7', text: '#15803D' },
  'Intermediate': { bg: '#FEF9C3', text: '#A16207' },
  'Advanced':     { bg: '#FEE2E2', text: '#B91C1C' },
}

function StarRating({ rating = 4.5 }: { rating?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ color: '#F59E0B', fontSize: 13, letterSpacing: 1 }}>
        {'★'.repeat(Math.floor(rating))}
        {rating % 1 >= 0.5 ? '★' : ''}
      </span>
      <span style={{ fontSize: 12, color: '#5C5C5C', fontWeight: 600 }}>{rating.toFixed(1)}</span>
      <span style={{ fontSize: 12, color: '#9CA3AF' }}>(1,243)</span>
    </span>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ height: 8, background: '#E0E0E0' }} />
      <div style={{ padding: '16px 16px 20px' }}>
        {[75, 55, 40, 30].map((w, i) => (
          <div key={i} style={{
            height: i === 0 ? 18 : 12, width: `${w}%`,
            background: 'linear-gradient(90deg, #F5F5F5 25%, #EBEBEB 50%, #F5F5F5 75%)',
            backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
            borderRadius: 3, marginBottom: i < 3 ? 10 : 0
          }} />
        ))}
      </div>
    </div>
  )
}

export default function FeaturedCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`)
      .then(r => r.json())
      .then((data: Course[]) => {
        const published = (data as Course[]).filter(c => (c as any).published !== false)
        // Pick 1-2 free + 1-2 premium from different categories for variety
        const free = published.filter(c => !c.isPremium)
        const premium = published.filter(c => c.isPremium)
        const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5)
        const picks = [...shuffle(free).slice(0, 2), ...shuffle(premium).slice(0, 1)]
        setCourses(shuffle(picks))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
        .course-card { transition: box-shadow 0.15s; }
        .course-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {loading
          ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
          : courses.map(course => {
              const color     = CAT_COLOR[course.category] ?? '#7C3AED'
              const badge     = LEVEL_BADGE[course.level] ?? { bg: '#F3F4F6', text: '#374151' }
              const lessons   = course.sections?.reduce((a, s) => a + s.lessons.length, 0) ?? 0
              const sectionCount = course.sections?.length ?? 0

              return (
                <Link key={course.id} href={`/courses/${course.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div className="course-card" style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%' }}>
                    {/* Color band */}
                    <div style={{ height: 8, background: color }} />

                    <div style={{ padding: '16px 16px 20px' }}>
                      {/* Category */}
                      <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                        {course.category}
                      </div>

                      {/* Title */}
                      <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: '#1F1F1F', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p style={{ fontSize: 13, color: '#5C5C5C', lineHeight: 1.55, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {course.description}
                      </p>

                      {/* Rating */}
                      <div style={{ marginBottom: 14 }}>
                        <StarRating />
                      </div>

                      {/* Meta row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, background: badge.bg, color: badge.text, padding: '2px 8px', borderRadius: 3 }}>
                          {course.level}
                        </span>
                        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{sectionCount} sections · {lessons} lessons</span>
                      </div>

                      {/* Pricing badge */}
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {course.isPremium ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#92400E', background: '#FFF8E6', border: '1px solid #F59E0B', padding: '3px 10px', borderRadius: 4 }}>
                            👑 Premium
                          </span>
                        ) : (
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#16A34A' }}>Free</span>
                        )}
                        <span style={{ fontSize: 13, color: '#0056D2', fontWeight: 600 }}>Enroll →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
        }
      </div>
    </>
  )
}

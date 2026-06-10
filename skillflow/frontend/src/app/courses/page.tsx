'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

const ALL_COURSES = [
  { id: '1', title: 'Complete Web Development Bootcamp', instructor: 'Alex Rivera', category: 'Web Dev', price: 89, rating: 4.8, reviews: 3241, students: 12430, duration: '42h', level: 'Beginner', bandColor: '#0056D2', emoji: '💻', bestseller: true },
  { id: '2', title: 'Machine Learning Fundamentals',     instructor: 'Dr. Sarah Chen', category: 'AI & ML', price: 79, rating: 4.9, reviews: 2108, students: 8200, duration: '38h', level: 'Intermediate', bandColor: '#16A34A', emoji: '🤖', bestseller: true },
  { id: '3', title: 'UI/UX Design Masterclass',          instructor: 'Maya Johnson', category: 'Design', price: 69, rating: 4.7, reviews: 1580, students: 5600, duration: '28h', level: 'Beginner', bandColor: '#D97706', emoji: '🎨', bestseller: false },
  { id: '4', title: 'Advanced React & Next.js',          instructor: 'Jordan Park', category: 'Web Dev', price: 99, rating: 4.8, reviews: 980, students: 3100, duration: '32h', level: 'Advanced', bandColor: '#0056D2', emoji: '⚛️', bestseller: false },
  { id: '5', title: 'Python for Data Science',           instructor: 'Prof. Lee Wang', category: 'AI & ML', price: 74, rating: 4.6, reviews: 1230, students: 6700, duration: '35h', level: 'Beginner', bandColor: '#16A34A', emoji: '🐍', bestseller: false },
  { id: '6', title: 'Brand Identity & Strategy',         instructor: 'Cleo Watts', category: 'Design', price: 59, rating: 4.5, reviews: 760, students: 2200, duration: '22h', level: 'Intermediate', bandColor: '#D97706', emoji: '✏️', bestseller: false },
  { id: '7', title: 'Node.js & Express API Development', instructor: 'Dev Santos', category: 'Backend', price: 84, rating: 4.7, reviews: 870, students: 2900, duration: '30h', level: 'Intermediate', bandColor: '#7C3AED', emoji: '🟩', bestseller: false },
  { id: '8', title: 'Cloud Architecture with AWS',       instructor: 'Priya Mehta', category: 'DevOps', price: 109, rating: 4.8, reviews: 640, students: 1800, duration: '45h', level: 'Advanced', bandColor: '#DC2626', emoji: '☁️', bestseller: false },
]

const CATEGORIES = ['All', 'Web Dev', 'AI & ML', 'Design', 'Backend', 'DevOps']
const LEVELS     = ['All', 'Beginner', 'Intermediate', 'Advanced']

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#F59E0B' : 'none'}
          stroke="#F59E0B" strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </span>
  )
}

export default function CoursesPage() {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel]       = useState('All')
  const [sort, setSort]         = useState('popular')
  const [price, setPrice]       = useState('all')

  const filtered = useMemo(() => {
    let list = ALL_COURSES.filter(c => {
      const matchSearch   = c.title.toLowerCase().includes(search.toLowerCase()) ||
                            c.instructor.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'All' || c.category === category
      const matchLevel    = level === 'All' || c.level === level
      const matchPrice    = price === 'all' || (price === 'under60' && c.price < 60) || (price === 'under80' && c.price < 80) || (price === 'over80' && c.price >= 80)
      return matchSearch && matchCategory && matchLevel && matchPrice
    })
    if (sort === 'popular')  list = [...list].sort((a,b) => b.students - a.students)
    if (sort === 'rating')   list = [...list].sort((a,b) => b.rating - a.rating)
    if (sort === 'price-lo') list = [...list].sort((a,b) => a.price - b.price)
    if (sort === 'price-hi') list = [...list].sort((a,b) => b.price - a.price)
    return list
  }, [search, category, level, sort, price])

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/auth/login" className="btn-outline" style={{
              padding: '7px 16px', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500,
              color: 'var(--text-secondary)', background: 'var(--bg)',
            }}>Log in</Link>
            <Link href="/dashboard" className="btn-primary" style={{
              padding: '7px 16px', background: 'var(--accent)',
              color: '#fff', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600,
            }}>Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Page header */}
      <div style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 0 32px',
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6, color: 'var(--text)' }}>
            All Courses
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        {/* ── Sidebar filters ───────────────────────────────── */}
        <aside style={{
          width: 260, flexShrink: 0,
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky', top: 76,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Filters</div>

          {/* Category */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Category
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="filter-chip"
                  style={{
                    padding: '7px 12px',
                    border: `1px solid ${category === c ? 'var(--accent)' : 'transparent'}`,
                    borderRadius: 'var(--radius-sm)',
                    background: category === c ? 'var(--accent-dim)' : 'transparent',
                    color: category === c ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: 14, fontWeight: category === c ? 600 : 400,
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div style={{ marginBottom: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Level
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className="filter-chip"
                  style={{
                    padding: '7px 12px',
                    border: `1px solid ${level === l ? 'var(--accent)' : 'transparent'}`,
                    borderRadius: 'var(--radius-sm)',
                    background: level === l ? 'var(--accent-dim)' : 'transparent',
                    color: level === l ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: 14, fontWeight: level === l ? 600 : 400,
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >{l}</button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Price
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { id: 'all', label: 'All prices' },
                { id: 'under60', label: 'Under $60' },
                { id: 'under80', label: 'Under $80' },
                { id: 'over80', label: '$80 and above' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPrice(p.id)}
                  className="filter-chip"
                  style={{
                    padding: '7px 12px',
                    border: `1px solid ${price === p.id ? 'var(--accent)' : 'transparent'}`,
                    borderRadius: 'var(--radius-sm)',
                    background: price === p.id ? 'var(--accent-dim)' : 'transparent',
                    color: price === p.id ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: 14, fontWeight: price === p.id ? 600 : 400,
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >{p.label}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top bar: search + sort */}
          <div style={{
            display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap',
          }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search courses or instructors…"
                className="form-input"
                style={{
                  width: '100%', padding: '10px 14px 10px 38px',
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14,
                }}
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                padding: '10px 14px', background: 'var(--bg)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer',
                minWidth: 180,
              }}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-lo">Price: Low to High</option>
              <option value="price-hi">Price: High to Low</option>
            </select>
          </div>

          {/* Results count */}
          <div style={{ marginBottom: 20, color: 'var(--text-secondary)', fontSize: 14 }}>
            Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> course{filtered.length !== 1 ? 's' : ''}
            {search && <> for &ldquo;<em style={{ color: 'var(--text)' }}>{search}</em>&rdquo;</>}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 0',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>No courses match your search</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Try adjusting your filters or search term</div>
              <button onClick={() => { setSearch(''); setCategory('All'); setLevel('All'); setPrice('all') }}
                style={{
                  color: 'var(--accent)', background: 'var(--accent-dim)',
                  border: '1px solid #BFDBFE', borderRadius: 'var(--radius)',
                  padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 20 }}>
              {filtered.map(course => (
                <Link key={course.id} href={`/courses/${course.id}`} className="course-card" style={{
                  display: 'block', background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  {/* Colored header */}
                  <div style={{
                    height: 110, background: course.bandColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {course.bestseller && (
                      <div style={{
                        position: 'absolute', top: 10, left: 10,
                        background: '#F59E0B', color: '#1C1917',
                        fontSize: 10, fontWeight: 800, padding: '3px 9px',
                        borderRadius: 100, letterSpacing: '0.05em',
                      }}>BESTSELLER</div>
                    )}
                    <div style={{
                      width: 48, height: 48, borderRadius: 'var(--radius)',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24,
                    }}>{course.emoji}</div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '16px 18px 18px' }}>
                    <div style={{
                      display: 'inline-block',
                      background: 'var(--bg-subtle)',
                      color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600,
                      padding: '2px 10px', borderRadius: 100, marginBottom: 10,
                    }}>{course.category}</div>

                    <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 5, color: 'var(--text)' }}>{course.title}</h3>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>by {course.instructor}</div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                      <StarRating rating={course.rating} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>{course.rating}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({course.reviews.toLocaleString()})</span>
                    </div>

                    <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)', marginBottom: 14, flexWrap: 'wrap' }}>
                      <span>{course.duration}</span>
                      <span>·</span>
                      <span>{course.level}</span>
                      <span>·</span>
                      <span>{course.students.toLocaleString()} students</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>${course.price}</span>
                      <span style={{
                        background: 'var(--accent)', color: '#fff',
                        fontSize: 12, fontWeight: 600, padding: '5px 12px',
                        borderRadius: 'var(--radius-sm)',
                      }}>Enroll</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

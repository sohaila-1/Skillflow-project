'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '../../../lib/api'
import { useRequireAuth } from '../../../hooks/useRequireAuth'
import ThemeToggle from '../../../components/ThemeToggle'

interface Lesson  { title: string; duration: string; content: string }
interface Section { title: string; lessons: Lesson[] }

const INPUT: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 14, color: 'var(--text)', background: 'var(--surface)', boxSizing: 'border-box' }
const LABEL: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }

function emptyLesson(): Lesson { return { title: '', duration: '10 min', content: '' } }
function emptySection(): Section { return { title: '', lessons: [emptyLesson()] } }

export default function NewCoursePage() {
  const router = useRouter()
  const { isLoading } = useRequireAuth()

  const [form, setForm]         = useState({ title: '', description: '', category: 'Programming', level: 'Beginner', published: true, isPremium: false })
  const [sections, setSections] = useState<Section[]>([emptySection()])
  const [error, setError]       = useState('')
  const [submitting, setSub]    = useState(false)

  if (isLoading) return null

  function addSection() { setSections(s => [...s, emptySection()]) }
  function removeSection(si: number) { setSections(s => s.filter((_, i) => i !== si)) }
  function updateSection(si: number, title: string) {
    setSections(s => s.map((sec, i) => i === si ? { ...sec, title } : sec))
  }
  function addLesson(si: number) {
    setSections(s => s.map((sec, i) => i === si ? { ...sec, lessons: [...sec.lessons, emptyLesson()] } : sec))
  }
  function removeLesson(si: number, li: number) {
    setSections(s => s.map((sec, i) => i === si ? { ...sec, lessons: sec.lessons.filter((_, j) => j !== li) } : sec))
  }
  function updateLesson(si: number, li: number, field: keyof Lesson, value: string) {
    setSections(s => s.map((sec, i) => i === si
      ? { ...sec, lessons: sec.lessons.map((l, j) => j === li ? { ...l, [field]: value } : l) }
      : sec
    ))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) { setError('Title and description are required'); return }
    const badSection = sections.find(s => !s.title.trim())
    if (badSection) { setError('All sections must have a title'); return }
    setSub(true)
    setError('')
    try {
      const course = await apiFetch<{ id: string }>('/courses', { method: 'POST', body: JSON.stringify({ ...form, sections }) })
      router.push(`/courses/${course.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create course')
    } finally {
      setSub(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <nav style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', height: 56, display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <ThemeToggle />
            <Link href="/courses" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none' }}>← All courses</Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>Create a New Course</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 36 }}>Add course details, organize it into sections, and publish for learners.</p>

        <form onSubmit={handleSubmit}>
          {/* ── Course Info ── */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Course Info</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={LABEL}>Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={INPUT} placeholder="e.g. Python for Beginners" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={LABEL}>Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} style={{ ...INPUT, resize: 'vertical' }} placeholder="What will students learn? What is covered?" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={LABEL}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={INPUT}>
                  {['Programming', 'Web Development', 'Data Science', 'DevOps', 'Design', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={LABEL}>Level</label>
                <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} style={INPUT}>
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
              <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Publish immediately (visible to all learners)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isPremium} onChange={e => setForm(f => ({ ...f, isPremium: e.target.checked }))} style={{ width: 16, height: 16, accentColor: '#D97706' }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>👑 Premium course (requires an active subscription to enroll)</span>
            </label>
          </div>

          {/* ── Sections & Lessons ── */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>Sections & Lessons</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Organize your course into sections, each with lessons.</p>
              </div>
              <button type="button" onClick={addSection} style={{ padding: '7px 16px', background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                + Add Section
              </button>
            </div>

            {sections.map((sec, si) => (
              <div key={si} style={{ border: '1px solid var(--border)', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: 3, flexShrink: 0 }}>
                    Section {si + 1}
                  </span>
                  <input
                    value={sec.title}
                    onChange={e => updateSection(si, e.target.value)}
                    placeholder="Section title (e.g. Getting Started)"
                    style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 14, color: 'var(--text)', background: 'var(--surface)' }}
                  />
                  {sections.length > 1 && (
                    <button type="button" onClick={() => removeSection(si)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>Remove</button>
                  )}
                </div>

                <div style={{ padding: '16px 16px 12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px auto', gap: 0, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lesson</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Duration</span>
                    <span />
                  </div>

                  {sec.lessons.map((lesson, li) => (
                    <div key={li} style={{ display: 'grid', gridTemplateColumns: '1fr 110px auto', gap: 8, marginBottom: 10, alignItems: 'start' }}>
                      <div>
                        <input
                          value={lesson.title}
                          onChange={e => updateLesson(si, li, 'title', e.target.value)}
                          placeholder={`Lesson ${li + 1} title`}
                          style={{ ...INPUT, marginBottom: 6 }}
                        />
                        <textarea
                          value={lesson.content}
                          onChange={e => updateLesson(si, li, 'content', e.target.value)}
                          placeholder="Lesson content / notes"
                          rows={2}
                          style={{ ...INPUT, resize: 'vertical', fontSize: 13 }}
                        />
                      </div>
                      <input
                        value={lesson.duration}
                        onChange={e => updateLesson(si, li, 'duration', e.target.value)}
                        placeholder="10 min"
                        style={INPUT}
                      />
                      {sec.lessons.length > 1 && (
                        <button type="button" onClick={() => removeLesson(si, li)} title="Remove lesson" style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 20, lineHeight: 1, paddingTop: 8 }}>×</button>
                      )}
                    </div>
                  ))}

                  <button type="button" onClick={() => addLesson(si)} style={{ background: 'none', border: '1px dashed var(--border)', borderRadius: 4, color: 'var(--accent)', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '6px 14px', width: '100%' }}>
                    + Add Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(220,38,38,0.35)', borderRadius: 4, padding: '10px 14px', marginBottom: 16, fontSize: 14, color: 'var(--red)' }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Creating…' : 'Create Course'}
            </button>
            <Link href="/courses" style={{ padding: '12px 20px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', background: 'var(--bg-alt)', textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

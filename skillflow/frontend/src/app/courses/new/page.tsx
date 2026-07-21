'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '../../../lib/api'
import { useRequireAuth } from '../../../hooks/useRequireAuth'

interface Section {
  title: string
  type: 'youtube' | 'pdf'
  url: string
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function NewCoursePage() {
  const router = useRouter()
  const { isLoading } = useRequireAuth()
  const [form, setForm] = useState({
    title: '', description: '', category: 'General', level: 'Beginner', published: true,
  })
  const [sections, setSections] = useState<Section[]>([])
  const [error, setError]       = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isLoading) return null

  function addSection() {
    setSections(s => [...s, { title: '', type: 'youtube', url: '' }])
  }

  function updateSection(i: number, field: keyof Section, value: string) {
    setSections(s => s.map((sec, idx) => idx === i ? { ...sec, [field]: value } : sec))
  }

  function removeSection(i: number) {
    setSections(s => s.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) { setError('Title and description are required'); return }
    const invalidSection = sections.find(s => !s.title.trim() || !s.url.trim())
    if (invalidSection) { setError('All sections must have a title and URL'); return }
    setSubmitting(true)
    setError('')
    try {
      await apiFetch('/courses', { method: 'POST', body: JSON.stringify({ ...form, sections }) })
      router.push('/courses')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create course')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>← Dashboard</Link>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: 700, padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text)' }}>Create a Course</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 36 }}>Add course details and content sections below.</p>

        <form onSubmit={handleSubmit}>

          {/* ── Course Info ─────────────────────────── */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Course Info</h2>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. NestJS from Zero to Hero"
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14 }} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="What will students learn?" rows={3}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14 }}>
                  {['General', 'Web Dev', 'Backend', 'AI & ML', 'Design', 'DevOps'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Level</label>
                <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14 }}>
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Publish immediately</span>
            </label>
          </div>

          {/* ── Content Sections ────────────────────── */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Content Sections</h2>
              <button type="button" onClick={addSection} style={{
                padding: '7px 16px', background: 'var(--accent-dim)', color: 'var(--accent)',
                border: '1px solid #BFDBFE', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>+ Add Section</button>
            </div>

            {sections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', fontSize: 14 }}>
                No sections yet — click "Add Section" to add YouTube videos or PDF links
              </div>
            ) : sections.map((sec, i) => {
              const ytId = sec.type === 'youtube' ? getYoutubeId(sec.url) : null
              return (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px', marginBottom: 12, background: 'var(--bg-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Section {i + 1}</span>
                    <button type="button" onClick={() => removeSection(i)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Remove</button>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <input value={sec.title} onChange={e => updateSection(i, 'title', e.target.value)}
                      placeholder="Section title (e.g. Introduction)"
                      style={{ width: '100%', padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14 }} />
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    {(['youtube', 'pdf'] as const).map(t => (
                      <button key={t} type="button" onClick={() => updateSection(i, 'type', t)} style={{
                        padding: '7px 16px', borderRadius: 'var(--radius)',
                        border: `1px solid ${sec.type === t ? 'var(--accent)' : 'var(--border)'}`,
                        background: sec.type === t ? 'var(--accent-dim)' : 'var(--bg)',
                        color: sec.type === t ? 'var(--accent)' : 'var(--text-secondary)',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}>
                        {t === 'youtube' ? '▶ YouTube' : '📄 PDF'}
                      </button>
                    ))}
                  </div>

                  <input value={sec.url} onChange={e => updateSection(i, 'url', e.target.value)}
                    placeholder={sec.type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://example.com/file.pdf'}
                    style={{ width: '100%', padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14 }} />

                  {/* YouTube preview */}
                  {ytId && (
                    <div style={{ marginTop: 12, borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '16/9' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* PDF preview link */}
                  {sec.type === 'pdf' && sec.url && (
                    <a href={sec.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
                      📄 Preview PDF →
                    </a>
                  )}
                </div>
              )
            })}
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16, fontSize: 14, color: '#DC2626' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: '12px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
            }}>
              {submitting ? 'Creating…' : 'Create Course'}
            </button>
            <Link href="/courses" style={{ padding: '12px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', background: 'var(--bg)', textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

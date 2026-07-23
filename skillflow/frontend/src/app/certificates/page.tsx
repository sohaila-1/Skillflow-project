'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '../../lib/api'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import AuthNavActions from '../../components/AuthNavActions'

interface Certificate {
  id: string
  courseId: string
  courseTitle: string
  studentName: string
  score: number
  totalQuestions: number
  issuedAt: string
}

export default function CertificatesPage() {
  useRequireAuth()
  const [certs, setCerts]   = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<Certificate[]>('/certificates/me')
      .then(setCerts)
      .catch(() => setCerts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>

      <nav className="no-print" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', height: 60, display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none' }}>← Dashboard</Link>
            <AuthNavActions />
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 6 }}>My Certificates</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Certificates earned by passing course quizzes with 70% or higher.</p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', height: 180, opacity: 0.5 }} />
            ))}
          </div>
        ) : certs.length === 0 ? (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '64px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No certificates yet</div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
              Complete a course and pass the final quiz with 70% or higher to earn a certificate.
            </p>
            <Link href="/courses" style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
            {certs.map(cert => {
              const pct = Math.round((cert.score / cert.totalQuestions) * 100)
              const date = new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              return (
                <div key={cert.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                  {/* Decorative header */}
                  <div style={{ background: 'linear-gradient(135deg,#7C3AED 0%,#6D28D9 100%)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                      🏅
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                        Certificate of Completion
                      </div>
                      <div style={{ color: '#fff', fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{cert.courseTitle}</div>
                    </div>
                  </div>

                  <div style={{ padding: '16px 24px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Score</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: pct >= 90 ? '#16A34A' : pct >= 70 ? '#0056D2' : 'var(--text)' }}>
                          {pct}%
                          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>({cert.score}/{cert.totalQuestions})</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Issued</div>
                        <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{date}</div>
                      </div>
                    </div>

                    <Link
                      href={`/certificates/${cert.id}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 0', background: '#7C3AED', color: '#fff', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      View & Download
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

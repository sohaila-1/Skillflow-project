'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { apiFetch } from '../../../lib/api'
import { useRequireAuth } from '../../../hooks/useRequireAuth'

interface Certificate {
  id: string
  courseId: string
  courseTitle: string
  studentName: string
  score: number
  totalQuestions: number
  issuedAt: string
}

export default function CertificatePage() {
  useRequireAuth()
  const { id } = useParams<{ id: string }>()
  const [cert, setCert]     = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)

  useEffect(() => {
    apiFetch<Certificate>(`/certificates/${id}`)
      .then(setCert)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0FF' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #DDD6FE', borderTopColor: '#7C3AED', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error || !cert) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F5F0FF', gap: 16 }}>
      <div style={{ fontSize: 48 }}>📭</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>Certificate not found</div>
      <Link href="/certificates" style={{ color: '#7C3AED', fontWeight: 600 }}>← Back to certificates</Link>
    </div>
  )

  const pct = Math.round((cert.score / cert.totalQuestions) * 100)
  const date = new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ background: '#F5F0FF', minHeight: '100vh', padding: '32px 24px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          .no-print { display: none !important; }
          body { background: #F5F0FF !important; }
          .cert-card { box-shadow: none !important; }
        }
      `}</style>

      {/* Action bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 860, margin: '0 auto 28px' }}>
        <Link href="/certificates" style={{ fontSize: 14, color: '#7C3AED', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          ← My Certificates
        </Link>
        <button
          onClick={() => window.print()}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* Certificate */}
      <div className="cert-card" style={{
        maxWidth: 860,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(124,58,237,0.15)',
        overflow: 'hidden',
        border: '3px solid #7C3AED',
      }}>
        {/* Top accent */}
        <div style={{ height: 8, background: 'linear-gradient(90deg,#7C3AED,#A78BFA,#7C3AED)' }} />

        <div style={{ padding: '56px 72px 60px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 900, color: '#7C3AED', letterSpacing: '-0.02em', marginBottom: 4 }}>
              SkillFlow
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Certificate of Completion
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
            <div style={{ flex: 1, height: 1, background: '#EDE9FE' }} />
            <div style={{ fontSize: 20 }}>🏅</div>
            <div style={{ flex: 1, height: 1, background: '#EDE9FE' }} />
          </div>

          {/* Body text */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 12 }}>This is to certify that</p>
            <div style={{ fontSize: 38, fontWeight: 900, color: '#111827', fontFamily: 'Georgia, serif', letterSpacing: '-0.01em', marginBottom: 12 }}>
              {cert.studentName}
            </div>
            <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 14 }}>has successfully completed the course</p>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#7C3AED', letterSpacing: '-0.01em', marginBottom: 20 }}>
              {cert.courseTitle}
            </div>

            {/* Score badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 100, padding: '8px 24px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#7C3AED">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#7C3AED' }}>
                Score: {cert.score}/{cert.totalQuestions} &nbsp;·&nbsp; {pct}%
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
            <div style={{ flex: 1, height: 1, background: '#EDE9FE' }} />
            <div style={{ flex: 1, height: 1, background: '#EDE9FE' }} />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Date Issued</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>{date}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Certificate ID</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{cert.id}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {/* Signature area */}
              <div style={{ borderBottom: '2px solid #374151', width: 160, marginBottom: 4, marginLeft: 'auto' }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>SkillFlow Team</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Authorized Signature</div>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div style={{ height: 8, background: 'linear-gradient(90deg,#7C3AED,#A78BFA,#7C3AED)' }} />
      </div>
    </div>
  )
}

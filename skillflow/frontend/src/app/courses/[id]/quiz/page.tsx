'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

interface Question {
  id: string
  text: string
  options: string[]
}

interface Quiz {
  id: string
  title: string
  courseId: string
  questions: Question[]
}

interface SubmitResult {
  score: number
  total: number
  percentage: number
  passed: boolean
}

type Phase = 'loading' | 'no-quiz' | 'intro' | 'quiz' | 'result'

export default function QuizPage({ params }: { params: { id: string } }) {
  const [phase, setPhase]         = useState<Phase>('loading')
  const [quiz, setQuiz]           = useState<Quiz | null>(null)
  const [current, setCurrent]     = useState(0)
  const [selected, setSelected]   = useState<number | null>(null)
  const [revealed, setRevealed]   = useState(false)
  const [answers, setAnswers]     = useState<number[]>([])
  const [result, setResult]       = useState<SubmitResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    apiFetch<Quiz>(`/courses/${params.id}/quiz`)
      .then(q => { setQuiz(q); setAnswers(Array(q.questions.length).fill(-1)); setPhase('intro') })
      .catch(() => setPhase('no-quiz'))
  }, [params.id])

  function handleSelect(idx: number) {
    if (revealed) return
    setSelected(idx)
  }

  function handleReveal() {
    if (selected === null) return
    setRevealed(true)
    const next = [...answers]
    next[current] = selected
    setAnswers(next)
  }

  function handleNext() {
    if (!quiz) return
    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      submitQuiz()
    }
  }

  async function submitQuiz() {
    setSubmitting(true)
    try {
      const res = await apiFetch<SubmitResult>(`/courses/${params.id}/quiz/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      })
      setResult(res)
      setPhase('result')
    } catch {
      setPhase('result')
    } finally {
      setSubmitting(false)
    }
  }

  function handleRestart() {
    if (!quiz) return
    setPhase('intro')
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setAnswers(Array(quiz.questions.length).fill(-1))
    setResult(null)
  }

  const pct          = result?.percentage ?? 0
  const resultColor  = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--orange)' : 'var(--red)'
  const resultLabel  = result?.passed ? 'Quiz Passed!' : 'Keep Practicing'

  const q = quiz?.questions[current]

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      <nav style={{
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
          Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
        </Link>
        <Link href={`/courses/${params.id}`} style={{
          fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to course
        </Link>
      </nav>

      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)', padding: '48px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 680 }}>

          {/* Loading */}
          {phase === 'loading' && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
              Loading quiz...
            </div>
          )}

          {/* No quiz */}
          {phase === 'no-quiz' && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No Quiz Yet</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>The instructor hasn&apos;t added a quiz for this course yet.</p>
              <Link href={`/courses/${params.id}`} style={{
                padding: '11px 24px', background: 'var(--accent)', color: '#fff',
                borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600, display: 'inline-block',
              }}>Back to Course</Link>
            </div>
          )}

          {/* Intro */}
          {phase === 'intro' && quiz && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 80, height: 80, borderRadius: 'var(--radius-xl)',
                background: 'var(--accent-dim)', border: '1px solid #BFDBFE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', fontSize: 36,
              }}>🎯</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--text)' }}>
                {quiz.title}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 36 }}>
                Test your knowledge with {quiz.questions.length} questions.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
                {[
                  { icon: '❓', label: `${quiz.questions.length} Questions`, bg: 'var(--accent-dim)', border: '#BFDBFE' },
                  { icon: '⏱', label: 'No time limit', bg: 'var(--green-dim)', border: '#BBF7D0' },
                  { icon: '✅', label: '70% to pass', bg: 'var(--orange-dim)', border: '#FDE68A' },
                ].map(s => (
                  <div key={s.label} style={{
                    background: s.bg, border: `1px solid ${s.border}`,
                    borderRadius: 'var(--radius-lg)', padding: '22px 16px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setPhase('quiz')} style={{
                padding: '13px 36px', background: 'var(--accent)', color: '#fff',
                borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 700,
                border: 'none', cursor: 'pointer',
              }}>
                Start Quiz →
              </button>
            </div>
          )}

          {/* Quiz */}
          {phase === 'quiz' && quiz && q && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                    Question {current + 1} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>of {quiz.questions.length}</span>
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${((current + (revealed ? 1 : 0)) / quiz.questions.length) * 100}%`,
                    background: 'var(--accent)', transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>

              <div style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)', padding: '36px 32px',
                marginBottom: 20, boxShadow: 'var(--shadow-sm)',
              }}>
                <h2 style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.5, marginBottom: 28, color: 'var(--text)' }}>
                  {q.text}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {q.options.map((opt, i) => {
                    const isSelected = selected === i
                    let borderColor = 'var(--border)', bgColor = 'var(--bg)', textColor = 'var(--text)'
                    if (!revealed && isSelected) { borderColor = 'var(--accent)'; bgColor = 'var(--accent-dim)'; textColor = 'var(--accent)' }
                    return (
                      <button key={i} onClick={() => handleSelect(i)} style={{
                        width: '100%', padding: '14px 16px',
                        border: `2px solid ${borderColor}`, borderRadius: 'var(--radius-lg)',
                        background: bgColor, color: textColor,
                        textAlign: 'left', fontSize: 14,
                        fontWeight: isSelected ? 600 : 400,
                        cursor: revealed ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <span style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${borderColor}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700,
                          background: isSelected ? borderColor : 'transparent',
                          color: isSelected ? '#fff' : borderColor,
                        }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {quiz.questions.map((_, i) => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: i < current ? 'var(--green)' : i === current ? 'var(--accent)' : 'var(--border)',
                    }} />
                  ))}
                </div>
                {!revealed ? (
                  <button onClick={handleReveal} disabled={selected === null} style={{
                    padding: '11px 24px',
                    background: selected === null ? 'var(--bg-subtle)' : 'var(--accent)',
                    color: selected === null ? 'var(--text-muted)' : '#fff',
                    borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 700,
                    border: `1px solid ${selected === null ? 'var(--border)' : 'transparent'}`,
                    cursor: selected === null ? 'not-allowed' : 'pointer',
                  }}>Check Answer</button>
                ) : (
                  <button onClick={handleNext} disabled={submitting} style={{
                    padding: '11px 24px', background: 'var(--accent)', color: '#fff',
                    borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                  }}>
                    {current < quiz.questions.length - 1 ? 'Next →' : submitting ? 'Submitting…' : 'See Results →'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Result */}
          {phase === 'result' && result && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 32px' }}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r="68" fill="none" stroke="var(--border)" strokeWidth="10"/>
                  <circle cx="80" cy="80" r="68" fill="none"
                    stroke={resultColor} strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 68}`}
                    strokeDashoffset={`${2 * Math.PI * 68 * (1 - pct / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 34, fontWeight: 800, color: resultColor }}>{pct}%</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Score</span>
                </div>
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: resultColor }}>
                {resultLabel}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 36 }}>
                You got <strong style={{ color: 'var(--text)' }}>{result.score} out of {result.total}</strong> correct.
                {result.passed
                  ? ' Great work!'
                  : ` Need ${Math.ceil(result.total * 0.7)} correct to pass.`}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={handleRestart} style={{
                  padding: '12px 24px', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600,
                  color: 'var(--text)', background: 'var(--bg)', cursor: 'pointer',
                }}>Retake Quiz</button>
                <Link href={`/courses/${params.id}`} style={{
                  padding: '12px 24px', background: 'var(--accent)', color: '#fff',
                  borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600, display: 'inline-block',
                }}>Back to Course →</Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

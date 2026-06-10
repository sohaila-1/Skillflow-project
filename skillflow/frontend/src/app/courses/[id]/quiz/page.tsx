'use client'

import { useState } from 'react'
import Link from 'next/link'

const QUESTIONS = [
  {
    question: 'What does HTML stand for?',
    options: [
      'HyperText Markup Language',
      'High Tech Modern Language',
      'HyperText Machine Language',
      'HyperTransfer Markup Language',
    ],
    correct: 0,
    explanation: 'HTML stands for HyperText Markup Language — the standard language used to create and structure web pages.',
  },
  {
    question: 'Which CSS property controls the space between the border and the content?',
    options: ['margin', 'padding', 'spacing', 'border-gap'],
    correct: 1,
    explanation: "padding controls the space between an element's border and its content. margin controls the space outside the border.",
  },
  {
    question: 'In JavaScript, which method adds an element to the end of an array?',
    options: ['unshift()', 'append()', 'push()', 'insert()'],
    correct: 2,
    explanation: 'push() adds one or more elements to the end of an array and returns the new length.',
  },
  {
    question: 'What is the correct React hook for managing local component state?',
    options: ['useEffect', 'useContext', 'useRef', 'useState'],
    correct: 3,
    explanation: 'useState is the React hook for declaring and managing local state within a functional component.',
  },
  {
    question: 'Which HTTP status code indicates a resource was not found?',
    options: ['200', '301', '404', '500'],
    correct: 2,
    explanation: '404 Not Found means the server could not locate the requested resource.',
  },
]

type Phase = 'intro' | 'quiz' | 'result'

export default function QuizPage({ params }: { params: { id: string } }) {
  const [phase, setPhase]       = useState<Phase>('intro')
  const [current, setCurrent]   = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers]   = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null))

  const q     = QUESTIONS[current]
  const score = answers.filter((a, i) => a === QUESTIONS[i].correct).length
  const pct   = Math.round((score / QUESTIONS.length) * 100)

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
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      setPhase('result')
    }
  }

  function handleRestart() {
    setPhase('intro')
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setAnswers(Array(QUESTIONS.length).fill(null))
  }

  const resultColor = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--orange)' : 'var(--red)'
  const resultLabel = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : 'Keep practicing'

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
          Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
        </Link>
        <Link href={`/courses/${params.id}`} className="nav-link" style={{
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

          {/* ── Intro ────────────────────────────────────────── */}
          {phase === 'intro' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 80, height: 80, borderRadius: 'var(--radius-xl)',
                background: 'var(--accent-dim)', border: '1px solid #BFDBFE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', fontSize: 36,
              }}>🎯</div>

              <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12, color: 'var(--text)' }}>
                Course Quiz
              </h1>
              <p style={{
                color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7,
                maxWidth: 400, margin: '0 auto 36px',
              }}>
                Test your knowledge with {QUESTIONS.length} questions covering key concepts from this course.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
                {[
                  { icon: '❓', label: `${QUESTIONS.length} Questions`, bg: 'var(--accent-dim)', border: '#BFDBFE' },
                  { icon: '⏱', label: 'No time limit',    bg: 'var(--green-dim)', border: '#BBF7D0' },
                  { icon: '🔁', label: 'Retake anytime',  bg: 'var(--orange-dim)', border: '#FDE68A' },
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

              <button
                onClick={() => setPhase('quiz')}
                className="btn-primary"
                style={{
                  padding: '13px 36px', background: 'var(--accent)', color: '#fff',
                  borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                }}
              >
                Start Quiz →
              </button>
            </div>
          )}

          {/* ── Quiz ─────────────────────────────────────────── */}
          {phase === 'quiz' && (
            <div>
              {/* Progress */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                    Question {current + 1} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>of {QUESTIONS.length}</span>
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {answers.filter(a => a !== null).length} answered
                  </span>
                </div>
                {/* Blue progress bar */}
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div className="progress-bar-fill" style={{
                    height: '100%', borderRadius: 3,
                    width: `${((current + (revealed ? 1 : 0)) / QUESTIONS.length) * 100}%`,
                    background: 'var(--accent)',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>

              {/* Question card */}
              <div style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)', padding: '36px 32px',
                marginBottom: 20, boxShadow: 'var(--shadow-sm)',
              }}>
                <h2 style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.5, marginBottom: 28, color: 'var(--text)' }}>
                  {q.question}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {q.options.map((opt, i) => {
                    const isSelected = selected === i
                    const isCorrect  = i === q.correct
                    const isWrong    = revealed && isSelected && !isCorrect

                    let borderColor = 'var(--border)'
                    let bgColor     = 'var(--bg)'
                    let textColor   = 'var(--text)'

                    if (revealed) {
                      if (isCorrect) { borderColor = 'var(--green)'; bgColor = 'var(--green-dim)'; textColor = 'var(--green)' }
                      else if (isWrong) { borderColor = 'var(--red)'; bgColor = 'var(--red-dim)'; textColor = 'var(--red)' }
                    } else if (isSelected) {
                      borderColor = 'var(--accent)'; bgColor = 'var(--accent-dim)'; textColor = 'var(--accent)'
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        className={!revealed ? 'answer-option' : ''}
                        style={{
                          width: '100%', padding: '14px 16px',
                          border: `2px solid ${borderColor}`,
                          borderRadius: 'var(--radius-lg)',
                          background: bgColor, color: textColor,
                          textAlign: 'left', fontSize: 14,
                          fontWeight: isSelected || (revealed && isCorrect) ? 600 : 400,
                          cursor: revealed ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', gap: 12,
                        }}
                      >
                        <span style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${borderColor}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700,
                          background: (isSelected || (revealed && isCorrect)) ? borderColor : 'transparent',
                          color: (isSelected || (revealed && isCorrect)) ? '#fff' : borderColor,
                        }}>
                          {revealed && isCorrect ? '✓' : revealed && isWrong ? '✗' : String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {revealed && (
                  <div style={{
                    marginTop: 20, padding: '14px 16px',
                    background: 'var(--accent-dim)',
                    border: '1px solid #BFDBFE',
                    borderRadius: 'var(--radius)',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Explanation
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Dot indicators */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {QUESTIONS.map((_, i) => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: i < current ? 'var(--green)'
                        : i === current ? 'var(--accent)'
                        : 'var(--border)',
                    }} />
                  ))}
                </div>

                {!revealed ? (
                  <button
                    onClick={handleReveal}
                    disabled={selected === null}
                    className="btn-primary"
                    style={{
                      padding: '11px 24px',
                      background: selected === null ? 'var(--bg-subtle)' : 'var(--accent)',
                      color: selected === null ? 'var(--text-muted)' : '#fff',
                      borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 700,
                      border: `1px solid ${selected === null ? 'var(--border)' : 'transparent'}`,
                      cursor: selected === null ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="btn-primary"
                    style={{
                      padding: '11px 24px', background: 'var(--accent)', color: '#fff',
                      borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 700,
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    {current < QUESTIONS.length - 1 ? 'Next Question →' : 'See Results →'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Result ───────────────────────────────────────── */}
          {phase === 'result' && (
            <div style={{ textAlign: 'center' }}>
              {/* SVG score circle */}
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
                  <span style={{ fontSize: 34, fontWeight: 800, fontFamily: 'var(--font-heading)', color: resultColor }}>{pct}%</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Score</span>
                </div>
              </div>

              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: resultColor }}>
                {resultLabel}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 36 }}>
                You got <strong style={{ color: 'var(--text)' }}>{score} out of {QUESTIONS.length}</strong> questions correct.
              </p>

              {/* Per-question breakdown */}
              <div style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: 28,
                textAlign: 'left', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Question Breakdown
                </div>
                {QUESTIONS.map((qItem, i) => {
                  const correct = answers[i] === qItem.correct
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      paddingBottom: i < QUESTIONS.length - 1 ? 14 : 0,
                      marginBottom: i < QUESTIONS.length - 1 ? 14 : 0,
                      borderBottom: i < QUESTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        background: correct ? 'var(--green-dim)' : 'var(--red-dim)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {correct
                          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{qItem.question}</div>
                        {!correct && (
                          <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 3, fontWeight: 500 }}>
                            Correct: {qItem.options[qItem.correct]}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={handleRestart}
                  className="btn-outline"
                  style={{
                    padding: '12px 24px', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600,
                    color: 'var(--text)', background: 'var(--bg)', cursor: 'pointer',
                  }}
                >Retake Quiz</button>
                <Link href={`/courses/${params.id}`} className="btn-primary" style={{
                  padding: '12px 24px', background: 'var(--accent)', color: '#fff',
                  borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  Back to Course →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

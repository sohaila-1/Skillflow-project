import Link from 'next/link'

const COURSES = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    instructor: 'Alex Rivera',
    category: 'Web Development',
    price: 89,
    originalPrice: 199,
    rating: 4.8,
    reviews: 3241,
    students: 12430,
    duration: '42 hours',
    level: 'Beginner',
    bandColor: '#0056D2',
    emoji: '💻',
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    instructor: 'Dr. Sarah Chen',
    category: 'AI & Machine Learning',
    price: 79,
    originalPrice: 179,
    rating: 4.9,
    reviews: 2108,
    students: 8200,
    duration: '38 hours',
    level: 'Intermediate',
    bandColor: '#16A34A',
    emoji: '🤖',
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    instructor: 'Maya Johnson',
    category: 'Design',
    price: 69,
    originalPrice: 149,
    rating: 4.7,
    reviews: 1580,
    students: 5600,
    duration: '28 hours',
    level: 'Beginner',
    bandColor: '#D97706',
    emoji: '🎨',
  },
]

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with proven track records at top companies around the world.',
    iconBg: '#EFF6FF',
    iconColor: '#0056D2',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Interactive Quizzes',
    description: 'Reinforce concepts with hands-on projects and instant-feedback quizzes after every lesson.',
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Progress Tracking',
    description: 'Visual dashboards show exactly where you stand and highlight your next learning milestone.',
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    title: 'Earn Certificates',
    description: 'Receive verifiable certificates on completion — recognized by hiring managers across the industry.',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
  },
]

const STATS = [
  { value: '10,000+', label: 'Students' },
  { value: '200+',    label: 'Courses' },
  { value: '95%',     label: 'Completion' },
  { value: '4.9',     label: 'Rating' },
]

const FOOTER_COLS = [
  {
    heading: 'Courses',
    links: ['Web Development', 'AI & Machine Learning', 'UI/UX Design', 'Backend & APIs', 'DevOps & Cloud'],
  },
  {
    heading: 'Company',
    links: ['About Us', 'Blog', 'Careers', 'Press', 'Partners'],
  },
  {
    heading: 'Support',
    links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Accessibility'],
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#F59E0B' : 'none'}
          stroke="#F59E0B" strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </span>
  )
}

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Navbar ───────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: 64,
        }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-heading)', fontSize: 22,
            fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)',
          }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>

          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <Link href="/courses" className="nav-link" style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500 }}>Explore</Link>
            <Link href="#features" className="nav-link" style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500 }}>About</Link>
            <Link href="/dashboard" className="nav-link" style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500 }}>For Business</Link>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/auth/login" className="nav-link" style={{
              padding: '8px 16px',
              color: 'var(--text-secondary)',
              fontSize: 14, fontWeight: 500,
            }}>Log in</Link>
            <Link href="/auth/register" className="btn-primary" style={{
              padding: '9px 20px', borderRadius: 'var(--radius)',
              background: 'var(--accent)', color: '#fff',
              fontSize: 14, fontWeight: 600,
            }}>Join for Free</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-alt)', padding: '80px 0 72px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 64, alignItems: 'center',
        }}>
          {/* Left */}
          <div className="fade-in-up">
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--accent-dim)',
              border: '1px solid #BFDBFE',
              borderRadius: 100, padding: '5px 14px', marginBottom: 28,
            }}>
              <span style={{ color: 'var(--accent)', fontSize: 13 }}>✦</span>
              <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>#1 Learning Platform</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 24,
              color: 'var(--text)',
            }}>
              Master In-Demand Skills<br />
              at Your Own Pace
            </h1>

            <p style={{
              fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.75,
              marginBottom: 36, maxWidth: 460,
            }}>
              Learn from industry experts with hands-on projects, interactive quizzes,
              and personalized feedback that accelerates your career.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link href="/auth/register" className="btn-primary" style={{
                padding: '12px 24px', background: 'var(--accent)', color: '#fff',
                borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                Start Learning Free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/courses" className="btn-outline" style={{
                padding: '12px 24px', borderRadius: 'var(--radius)',
                border: '1px solid var(--border)', color: 'var(--text)',
                fontSize: 15, fontWeight: 500, background: 'var(--bg)',
              }}>
                Browse Catalog
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex' }}>
                {['#0056D2','#16A34A','#D97706','#DC2626'].map((bg, i) => (
                  <div key={i} style={{
                    width: 34, height: 34, borderRadius: '50%', background: bg,
                    border: '2px solid var(--bg)', marginLeft: i > 0 ? -10 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, color: '#fff', fontWeight: 700,
                  }}>
                    {['A','B','C','D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <StarRating rating={5} />
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                  Join <strong style={{ color: 'var(--text)' }}>10,000+</strong> learners already enrolled
                </div>
              </div>
            </div>
          </div>

          {/* Right — dashboard preview card */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Course progress card */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '24px',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius)',
                  background: 'var(--accent-dim)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Currently Learning</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Web Dev Bootcamp</div>
                </div>
                <div style={{
                  marginLeft: 'auto', background: 'var(--green-dim)',
                  color: 'var(--green)', fontSize: 12, fontWeight: 600,
                  padding: '3px 10px', borderRadius: 100,
                }}>In Progress</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Module 5 of 8 — React Hooks</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>68%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: '68%', borderRadius: 3,
                    background: 'var(--accent)',
                  }} />
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>14 hours remaining</div>
            </div>

            {/* Mini stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { label: 'Courses', value: '3', emoji: '📚', bg: 'var(--accent-dim)', color: 'var(--accent)' },
                { label: 'Hours',   value: '127', emoji: '⏱', bg: 'var(--green-dim)', color: 'var(--green)' },
                { label: 'Certs',   value: '2', emoji: '🏆', bg: '#FFFBEB', color: 'var(--orange)' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '18px 14px', textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 'var(--radius)',
                    background: s.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 10px', fontSize: 18,
                  }}>{s.emoji}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted by ───────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
            Trusted by learners from
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Stripe'].map(name => (
              <span key={name} style={{
                padding: '5px 14px', borderRadius: 100,
                border: '1px solid var(--border)', background: 'var(--bg-subtle)',
                fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
              }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features / Why SkillFlow ─────────────────────────── */}
      <section id="features" style={{ background: 'var(--bg-subtle)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-block', color: 'var(--accent)', fontSize: 13,
              fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: 14,
            }}>Why SkillFlow</div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              Everything you need to<br />level up your career
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card-hover" style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '28px 24px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius)',
                  background: f.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.iconColor, marginBottom: 18,
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: 'var(--text)' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ─────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <div style={{
                color: 'var(--green)', fontSize: 13, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
              }}>Top Picks</div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                Featured Courses
              </h2>
            </div>
            <Link href="/courses" className="btn-outline" style={{
              padding: '9px 18px', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', fontSize: 14, fontWeight: 500,
              color: 'var(--accent)', background: 'var(--bg)',
            }}>View all →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {COURSES.map(course => (
              <Link key={course.id} href={`/courses/${course.id}`} className="course-card" style={{
                display: 'block', background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}>
                {/* Colored header band */}
                <div style={{
                  height: 120, background: course.bandColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 100, padding: '3px 10px',
                    fontSize: 11, color: '#fff', fontWeight: 700,
                  }}>{course.category}</div>
                  <div style={{
                    width: 52, height: 52, borderRadius: 'var(--radius-lg)',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26,
                  }}>{course.emoji}</div>
                </div>

                {/* Card body */}
                <div style={{ padding: '18px 20px 20px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.35, marginBottom: 6, color: 'var(--text)' }}>{course.title}</h3>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>by {course.instructor}</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <StarRating rating={course.rating} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>{course.rating}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({course.reviews.toLocaleString()})</span>
                  </div>

                  <div style={{
                    display: 'flex', gap: 14, fontSize: 12,
                    color: 'var(--text-muted)', marginBottom: 16, flexWrap: 'wrap',
                  }}>
                    <span>{course.duration}</span>
                    <span>{course.level}</span>
                    <span>{course.students.toLocaleString()} students</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>${course.price}</span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through' }}>${course.originalPrice}</span>
                    </div>
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
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--accent)', padding: '48px 0' }}>
        <div className="container" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800,
                fontFamily: 'var(--font-heading)', color: '#fff',
                letterSpacing: '-0.02em', marginBottom: 4,
              }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA section ──────────────────────────────────────── */}
      <section style={{
        background: 'var(--accent-dim)',
        borderTop: '1px solid #BFDBFE',
        borderBottom: '1px solid #BFDBFE',
        padding: '80px 0', textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: 16, color: 'var(--text)',
          }}>
            Ready to start your learning journey?
          </h2>
          <p style={{
            fontSize: 17, color: 'var(--text-secondary)', maxWidth: 460,
            margin: '0 auto 36px', lineHeight: 1.7,
          }}>
            Join over 10,000 students already building the skills they need for tomorrow.
          </p>
          <Link href="/auth/register" className="btn-primary" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 30px', background: 'var(--accent)', color: '#fff',
            borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 700,
          }}>
            Create Free Account
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <div style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 13 }}>
            No credit card required · Cancel anytime
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: '56px 0 32px',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            {/* Brand column */}
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, marginBottom: 14, color: 'var(--text)' }}>
                Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 220 }}>
                The professional learning platform helping you master in-demand skills at your own pace.
              </p>
            </div>
            {/* Link columns */}
            {FOOTER_COLS.map(col => (
              <div key={col.heading}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {col.heading}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(link => (
                    <Link key={link} href="#" className="nav-link" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{link}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div style={{
            borderTop: '1px solid var(--border)', paddingTop: 24,
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              © 2025 SkillFlow. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(l => (
                <Link key={l} href="#" className="nav-link" style={{ color: 'var(--text-muted)', fontSize: 13 }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

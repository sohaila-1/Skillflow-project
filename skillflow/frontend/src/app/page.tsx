import Link from 'next/link'
import AuthNavActions from '../components/AuthNavActions'
import FeaturedCoursesSection from '../components/FeaturedCoursesSection'
import CTAButtons from '../components/CTAButtons'
import HomeHero from '../components/HomeHero'
import HomeNavLinks from '../components/HomeNavLinks'
import ThemeToggle from '../components/ThemeToggle'

const CATEGORIES = [
  { icon: '💻', label: 'Programming',     color: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
  { icon: '🌐', label: 'Web Development', color: '#F0FDFA', border: '#99F6E4', text: '#0F766E' },
  { icon: '📊', label: 'Data Science',    color: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
  { icon: '🐳', label: 'DevOps',          color: '#FEF2F2', border: '#FECACA', text: '#B91C1C' },
  { icon: '🎨', label: 'Design',          color: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
]

const TESTIMONIALS = [
  {
    quote: "I landed my first dev job after finishing the Python and Web Dev courses. The certificate really helped my resume stand out.",
    name: 'Marcus T.',
    role: 'Junior Developer',
    initials: 'MT',
    color: '#0056D2',
  },
  {
    quote: "The quizzes are tough but fair. I loved that I couldn't skip to the quiz — finishing every lesson made the difference.",
    name: 'Isabelle M.',
    role: 'Data Analyst',
    initials: 'IM',
    color: '#16A34A',
  },
  {
    quote: "Free, structured, and the certificates look great on LinkedIn. I've completed 3 courses and already got a promotion.",
    name: 'Carlos R.',
    role: 'DevOps Engineer',
    initials: 'CR',
    color: '#7C3AED',
  },
]

const FEATURES = [
  {
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with real-world experience in top companies.',
    iconBg: '#EFF6FF', iconColor: '#1D4ED8',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Interactive Quizzes',
    description: 'Test what you know with instant-feedback quizzes after each section.',
    iconBg: '#F0FDF4', iconColor: '#15803D',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    title: 'Track Your Progress',
    description: 'Visual progress tracking shows exactly where you stand lesson by lesson.',
    iconBg: '#F5F3FF', iconColor: '#6D28D9',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    title: 'Earn Certificates',
    description: 'Receive a certificate when you pass the final quiz — shareable on LinkedIn.',
    iconBg: '#FFFBEB', iconColor: '#B45309',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
]

const PARTNERS = ['Google', 'Microsoft', 'IBM', 'Meta', 'Amazon', 'Stripe']

async function getCourseCount(): Promise<number> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, { next: { revalidate: 60 } })
    const data = await res.json() as { published?: boolean }[]
    return data.filter(c => c.published !== false).length
  } catch { return 0 }
}

export default async function HomePage() {
  const courseCount = await getCourseCount()
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ── Nav ── */}
      <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 40 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none', flexShrink: 0 }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <HomeNavLinks />
          <ThemeToggle />
          <AuthNavActions />
        </div>
      </nav>

      {/* ── Hero (auth-aware) ── */}
      <HomeHero />

      {/* ── Partners ── */}
      <section style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)', padding: '18px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>Trusted by learners from</span>
          {PARTNERS.map(name => (
            <span key={name} style={{ fontSize: 15, fontWeight: 800, color: 'var(--border-hover)', letterSpacing: '-0.02em' }}>{name}</span>
          ))}
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section style={{ background: 'var(--surface)', padding: '64px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
            <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Featured courses</h2>
            <Link href="/courses" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>See all courses</Link>
          </div>
          <FeaturedCoursesSection />
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)', padding: '64px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 36 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 6 }}>Browse by category</h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Find the right course for where you want to go</p>
            </div>
            <Link href="/courses" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>All courses →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.label} href="/courses" style={{ textDecoration: 'none' }}>
                <div className="card-hover" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 20px', textAlign: 'center', borderTop: `3px solid ${cat.text}` }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: cat.color, border: `1.5px solid ${cat.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 16px' }}>
                    {cat.icon}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: cat.text, marginBottom: 6 }}>{cat.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>View courses →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '52px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {[
            { value: '10,000+',                      label: 'Active learners' },
            { value: courseCount > 0 ? `${courseCount}+` : '12+', label: 'Available courses' },
            { value: '100%',                          label: 'Free access' },
            { value: '4.9',                           label: 'Average rating' },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0 24px', borderRight: i < 3 ? `1px solid var(--border)` : 'none' }}>
              <div style={{ fontSize: 'clamp(28px,3vw,40px)', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why ── */}
      <section style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)', padding: '72px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 700, color: 'var(--text)', marginBottom: 48, textAlign: 'center', letterSpacing: '-0.01em' }}>
            Why learners choose SkillFlow
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card-hover" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 24px' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.iconColor, marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '72px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 700, color: 'var(--text)', marginBottom: 8, textAlign: 'center', letterSpacing: '-0.01em' }}>
            What learners say
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 48 }}>
            Real outcomes from real students
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 28px 24px' }}>
                <div style={{ color: '#F59E0B', fontSize: 14, marginBottom: 16, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(120deg, #0056D2 0%, #0770CE 45%, #0891B2 100%)', padding: '80px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '26px 26px', opacity: 0.4 }} />
        <div className="container" style={{ maxWidth: 560, position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Start learning today
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 36, lineHeight: 1.6 }}>
            Join thousands of learners building their skills for free.
          </p>
          <CTAButtons />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: 'var(--footer-bg)', padding: '52px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48, marginBottom: 40 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
                Skill<span style={{ color: '#60A5FA' }}>Flow</span>
              </div>
              <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.7, maxWidth: 220 }}>
                Professional online learning platform. Build real skills, earn certificates, advance your career.
              </p>
            </div>
            {[
              { title: 'Courses',  links: ['Programming', 'Web Development', 'Data Science', 'DevOps', 'Design'] },
              { title: 'Company',  links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support',  links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(link => (
                    <Link key={link} href="/courses" style={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'none' }}>{link}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #374151', paddingTop: 24, color: '#6B7280', fontSize: 13 }}>
            © 2026 SkillFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

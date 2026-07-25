import Link from 'next/link'
import AuthNavActions from '../components/AuthNavActions'
import FeaturedCoursesSection from '../components/FeaturedCoursesSection'
import CTAButtons from '../components/CTAButtons'
import HomeHero from '../components/HomeHero'
import HomeNavLinks from '../components/HomeNavLinks'

const FEATURES = [
  {
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with real-world experience in top companies.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Interactive Quizzes',
    description: 'Test what you know with instant-feedback quizzes after each section.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    title: 'Track Your Progress',
    description: 'Visual progress tracking shows exactly where you stand lesson by lesson.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    title: 'Earn Certificates',
    description: 'Receive a certificate when you pass the final quiz — shareable on LinkedIn.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ── Nav ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E0E0E0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 40 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#1F1F1F', textDecoration: 'none', flexShrink: 0 }}>
            Skill<span style={{ color: '#0056D2' }}>Flow</span>
          </Link>
          <HomeNavLinks />
          <AuthNavActions />
        </div>
      </nav>

      {/* ── Hero (auth-aware) ── */}
      <HomeHero />

      {/* ── Partners ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #E0E0E0', padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: 13, color: '#A0A0A0', fontWeight: 500 }}>Trusted by learners from</span>
          {PARTNERS.map(name => (
            <span key={name} style={{ fontSize: 14, fontWeight: 700, color: '#5C5C5C', letterSpacing: '-0.01em' }}>{name}</span>
          ))}
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section style={{ background: '#fff', padding: '64px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
            <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 700, color: '#1F1F1F', letterSpacing: '-0.01em' }}>Featured courses</h2>
            <Link href="/courses" style={{ fontSize: 14, color: '#0056D2', fontWeight: 600, textDecoration: 'none' }}>See all courses</Link>
          </div>
          <FeaturedCoursesSection />
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: '#F5F7F8', borderTop: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0', padding: '52px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {[
            { value: '10,000+',                      label: 'Active learners' },
            { value: courseCount > 0 ? `${courseCount}+` : '12+', label: 'Available courses' },
            { value: '100%',                          label: 'Free access' },
            { value: '4.9',                           label: 'Average rating' },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0 24px', borderRight: i < 3 ? '1px solid #E0E0E0' : 'none' }}>
              <div style={{ fontSize: 'clamp(28px,3vw,40px)', fontWeight: 800, color: '#0056D2', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: '#5C5C5C' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why ── */}
      <section style={{ background: '#F5F7F8', borderTop: '1px solid #E0E0E0', padding: '72px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 700, color: '#1F1F1F', marginBottom: 48, textAlign: 'center', letterSpacing: '-0.01em' }}>
            Why learners choose SkillFlow
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card-hover" style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, padding: '28px 24px' }}>
                <div style={{ color: '#0056D2', marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F1F1F', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#5C5C5C', lineHeight: 1.65 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0056D2', padding: '72px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 560 }}>
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
      <footer style={{ background: '#1F1F1F', padding: '52px 0 32px' }}>
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

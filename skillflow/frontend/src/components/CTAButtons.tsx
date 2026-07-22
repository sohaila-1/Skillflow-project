'use client'

import Link from 'next/link'
import { useKeycloak } from '../providers/keycloak-provider'

export default function CTAButtons() {
  const { isAuthenticated } = useKeycloak()

  if (isAuthenticated) {
    return (
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/dashboard" style={{ padding: '13px 28px', background: '#fff', color: '#0056D2', borderRadius: 4, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
          Go to Dashboard
        </Link>
        <Link href="/courses" style={{ padding: '13px 28px', background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.6)', borderRadius: 4, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
          Browse Courses
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      <Link href="/auth/register" style={{ padding: '13px 28px', background: '#fff', color: '#0056D2', borderRadius: 4, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
        Join for Free
      </Link>
      <Link href="/courses" style={{ padding: '13px 28px', background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.6)', borderRadius: 4, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
        Browse Courses
      </Link>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useKeycloak } from '../../providers/keycloak-provider'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import { apiFetch } from '../../lib/api'
import ThemeToggle from '../../components/ThemeToggle'

interface ManagedUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  roles: string[]
}

export default function AdminPage() {
  useRequireAuth()
  const { user } = useKeycloak()

  const [users, setUsers]   = useState<ManagedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [error, setError]   = useState('')

  const isAdmin = user?.roles?.includes('admin')

  useEffect(() => {
    if (!isAdmin) return
    apiFetch<ManagedUser[]>('/admin/users')
      .then(setUsers)
      .catch(() => setError('Failed to load users. Make sure you have admin role.'))
      .finally(() => setLoading(false))
  }, [isAdmin])

  async function toggleRole(userId: string, roleName: string, hasRole: boolean) {
    setToggling(`${userId}-${roleName}`)
    try {
      await apiFetch(`/admin/users/${userId}/roles/${roleName}`, {
        method: hasRole ? 'DELETE' : 'POST',
      })
      setUsers(prev => prev.map(u => u.id === userId
        ? { ...u, roles: hasRole ? u.roles.filter(r => r !== roleName) : [...u.roles, roleName] }
        : u
      ))
    } catch {
      setError('Failed to update role. Please try again.')
    } finally {
      setToggling(null)
    }
  }

  if (!isAdmin) {
    return (
      <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '48px 40px', textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Access Denied</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>You need the <strong>admin</strong> role to access this page.</p>
          <Link href="/dashboard" style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <nav style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', height: 56, display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <ThemeToggle />
            <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none' }}>← Dashboard</Link>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', background: 'var(--red-dim)', padding: '3px 10px', borderRadius: 3, border: '1px solid rgba(220,38,38,0.35)' }}>Admin</span>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 900 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>User Management</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Manage roles for all registered users. Admin can create/edit/delete courses. Instructor can create and edit their own courses.</p>
        </div>

        {/* Role legend */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { role: 'admin',      color: 'var(--red)', bg: 'var(--red-dim)', border: 'rgba(220,38,38,0.35)', desc: 'Full access — create, edit, delete any course + manage users' },
            { role: 'instructor', color: 'var(--accent)', bg: 'var(--accent-dim)', border: 'var(--border)', desc: 'Can create courses and edit their own courses' },
          ].map(r => (
            <div key={r.role} style={{ background: r.bg, border: `1px solid ${r.border}`, borderRadius: 4, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: r.color, textTransform: 'capitalize' }}>{r.role}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.desc}</span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Quick actions:</div>
          <Link href="/courses/new" style={{ padding: '7px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            + Create Course
          </Link>
          <Link href="/courses" style={{ padding: '7px 16px', background: 'var(--bg-alt)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Manage Courses
          </Link>
        </div>

        {error && (
          <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(220,38,38,0.35)', borderRadius: 4, padding: '10px 16px', marginBottom: 20, fontSize: 14, color: 'var(--red)' }}>
            {error}
          </div>
        )}

        {/* Users table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>All Users</div>
            {!loading && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{users.length} user{users.length !== 1 ? 's' : ''}</div>}
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Loading users…</div>
          ) : users.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No users found</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)' }}>
                  {['User', 'Email', 'Current Roles', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 20px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isMe = u.id === user?.sub
                  const hasAdmin      = u.roles.includes('admin')
                  const hasInstructor = u.roles.includes('instructor')

                  return (
                    <tr key={u.id} style={{ borderTop: '1px solid var(--border)', background: isMe ? 'var(--orange-dim)' : undefined }}>
                      {/* User */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: hasAdmin ? 'var(--red)' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                            {(u.firstName?.[0] ?? u.username?.[0] ?? '?').toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                              {u.firstName || u.lastName ? `${u.firstName} ${u.lastName}`.trim() : u.username}
                              {isMe && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--text-muted)' }}>(you)</span>}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{u.username}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.email || '—'}</span>
                      </td>

                      {/* Roles badges */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {hasAdmin && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', background: 'var(--red-dim)', padding: '2px 8px', borderRadius: 3, border: '1px solid rgba(220,38,38,0.35)' }}>admin</span>
                          )}
                          {hasInstructor && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: 3, border: '1px solid var(--border)' }}>instructor</span>
                          )}
                          {!hasAdmin && !hasInstructor && (
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>learner</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button
                            disabled={toggling === `${u.id}-admin`}
                            onClick={() => toggleRole(u.id, 'admin', hasAdmin)}
                            style={{
                              padding: '5px 12px', fontSize: 12, fontWeight: 600, borderRadius: 3, cursor: 'pointer', border: '1px solid',
                              ...(hasAdmin
                                ? { background: 'var(--red-dim)', color: 'var(--red)', borderColor: 'rgba(220,38,38,0.35)' }
                                : { background: 'var(--bg-alt)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }
                              ),
                              opacity: toggling === `${u.id}-admin` ? 0.5 : 1,
                            }}
                          >
                            {hasAdmin ? 'Revoke admin' : 'Make admin'}
                          </button>

                          <button
                            disabled={toggling === `${u.id}-instructor`}
                            onClick={() => toggleRole(u.id, 'instructor', hasInstructor)}
                            style={{
                              padding: '5px 12px', fontSize: 12, fontWeight: 600, borderRadius: 3, cursor: 'pointer', border: '1px solid',
                              ...(hasInstructor
                                ? { background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--border)' }
                                : { background: 'var(--bg-alt)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }
                              ),
                              opacity: toggling === `${u.id}-instructor` ? 0.5 : 1,
                            }}
                          >
                            {hasInstructor ? 'Revoke instructor' : 'Make instructor'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Info box */}
        <div style={{ marginTop: 24, background: 'var(--accent-dim)', border: '1px solid var(--border)', borderRadius: 4, padding: '14px 20px', fontSize: 13, color: 'var(--accent)', lineHeight: 1.7 }}>
          <strong>Note:</strong> Role changes take effect at the user's next login (when their JWT is refreshed). You can also manage roles directly in the{' '}
          <strong>Keycloak Admin Console</strong> at <code style={{ background: 'var(--bg-subtle)', padding: '1px 5px', borderRadius: 3, color: 'var(--text)' }}>localhost:8080</code> → Skillflow realm → Users.
        </div>
      </div>
    </div>
  )
}

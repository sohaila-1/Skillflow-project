'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useKeycloak } from '../../providers/keycloak-provider'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import { apiFetch } from '../../lib/api'
import ThemeToggle from '../../components/ThemeToggle'

interface Profile {
  username: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string | null
}

type Msg = { text: string; ok: boolean }

function Spinner({ size = 28 }: { size?: number }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      border: '3px solid var(--border)', borderTopColor: 'var(--accent)',
      display: 'inline-block', animation: 'spin 0.7s linear infinite', flexShrink: 0,
    }} />
  )
}

function Card({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <section style={{
      background: 'var(--surface)',
      border: `1px solid ${danger ? 'rgba(220,38,38,0.3)' : 'var(--border)'}`,
      borderRadius: 8, padding: '28px 32px', marginBottom: 20,
      boxShadow: 'var(--shadow-sm)',
    }}>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid var(--border)',
  borderRadius: 6, fontSize: 14, color: 'var(--text)',
  background: 'var(--surface)',
  outline: 'none', boxSizing: 'border-box',
}

function Alert({ msg }: { msg: Msg }) {
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 13, fontWeight: 600,
      background: msg.ok ? 'var(--green-dim)' : 'var(--red-dim)',
      border: `1px solid ${msg.ok ? 'rgba(22,163,74,0.35)' : 'rgba(220,38,38,0.35)'}`,
      color: msg.ok ? 'var(--green)' : 'var(--red)',
    }}>
      {msg.text}
    </div>
  )
}

export default function AccountPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const { user, logout } = useKeycloak()

  // Avatar state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null)
  const [avatarSaving, setAvatarSaving] = useState(false)
  const [avatarMsg, setAvatarMsg] = useState<Msg | null>(null)

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [profileMsg, setProfileMsg] = useState<Msg | null>(null)
  const [profileSaving, setProfileSaving] = useState(false)

  // Password state
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState<Msg | null>(null)
  const [pwdSaving, setPwdSaving] = useState(false)
  const [showCurrentPwd, setShowCurrentPwd] = useState(false)
  const [showNewPwd, setShowNewPwd] = useState(false)

  // 2FA state
  const [totpEnabled, setTotpEnabled] = useState<boolean | null>(null)
  const [totpLoading, setTotpLoading] = useState(true)
  const [totpMsg, setTotpMsg] = useState<Msg | null>(null)
  const [totpSaving, setTotpSaving] = useState(false)

  // Delete account state
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteMsg, setDeleteMsg] = useState<Msg | null>(null)

  useEffect(() => {
    if (authLoading || !user) return
    apiFetch<Profile>('/auth/profile')
      .then(p => {
        setProfile(p)
        setFirstName(p.firstName)
        setLastName(p.lastName)
        setAvatarUrl(p.avatarUrl)
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false))

    apiFetch<{ enabled: boolean }>('/auth/2fa/status')
      .then(r => setTotpEnabled(r.enabled))
      .catch(() => setTotpEnabled(false))
      .finally(() => setTotpLoading(false))
  }, [authLoading, user])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMsg(null)
    try {
      await apiFetch('/auth/profile', { method: 'PATCH', body: JSON.stringify({ firstName, lastName }) })
      setProfileMsg({ text: 'Profile updated successfully.', ok: true })
    } catch {
      setProfileMsg({ text: 'Failed to update profile. Please try again.', ok: false })
    } finally {
      setProfileSaving(false)
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPwd !== confirmPwd) {
      setPwdMsg({ text: 'New passwords do not match.', ok: false })
      return
    }
    if (newPwd.length < 8) {
      setPwdMsg({ text: 'New password must be at least 8 characters.', ok: false })
      return
    }
    setPwdSaving(true)
    setPwdMsg(null)
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      })
      setPwdMsg({ text: 'Password changed successfully.', ok: true })
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message.includes('401')
        ? 'Current password is incorrect.'
        : 'Failed to change password. Please try again.'
      setPwdMsg({ text: msg, ok: false })
    } finally {
      setPwdSaving(false)
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2_000_000) {
      setAvatarMsg({ text: 'Image too large — max 2 MB.', ok: false })
      return
    }
    setAvatarMsg(null)
    const reader = new FileReader()
    reader.onload = () => {
      setPendingAvatar(reader.result as string)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function saveAvatar() {
    if (!pendingAvatar) return
    setAvatarSaving(true)
    setAvatarMsg(null)
    try {
      await apiFetch('/auth/avatar', { method: 'POST', body: JSON.stringify({ avatarUrl: pendingAvatar }) })
      setAvatarUrl(pendingAvatar)
      setPendingAvatar(null)
      setAvatarMsg({ text: 'Profile picture saved.', ok: true })
    } catch {
      setAvatarMsg({ text: 'Failed to save picture. Please try again.', ok: false })
    } finally {
      setAvatarSaving(false)
    }
  }

  function cancelAvatar() {
    setPendingAvatar(null)
    setAvatarMsg(null)
  }

  async function removeAvatar() {
    setAvatarSaving(true)
    setAvatarMsg(null)
    try {
      await apiFetch('/auth/avatar', { method: 'DELETE' })
      setAvatarUrl(null)
      setPendingAvatar(null)
      setAvatarMsg({ text: 'Profile picture removed.', ok: true })
    } catch {
      setAvatarMsg({ text: 'Failed to remove picture.', ok: false })
    } finally {
      setAvatarSaving(false)
    }
  }

  async function setupTotp() {
    setTotpSaving(true)
    setTotpMsg(null)
    try {
      const { loginUrl } = await apiFetch<{ loginUrl: string }>('/auth/2fa/setup', { method: 'POST' })
      window.location.href = loginUrl
    } catch {
      setTotpMsg({ text: 'Failed to initiate 2FA setup. Please try again.', ok: false })
      setTotpSaving(false)
    }
  }

  async function disableTotp() {
    setTotpSaving(true)
    setTotpMsg(null)
    try {
      await apiFetch('/auth/2fa', { method: 'DELETE' })
      setTotpEnabled(false)
      setTotpMsg({ text: '2FA removed successfully.', ok: true })
    } catch {
      setTotpMsg({ text: 'Failed to remove 2FA. Please try again.', ok: false })
    } finally {
      setTotpSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    setDeleteMsg(null)
    try {
      await apiFetch('/auth/account', { method: 'DELETE' })
      // Account gone — end the session and send the user home.
      logout()
    } catch {
      setDeleteMsg({ text: 'Failed to delete account. Please try again.', ok: false })
      setDeleting(false)
    }
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Spinner size={36} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const displayName = profile?.username ?? user?.preferred_username ?? ''
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div style={{ background: 'var(--bg-subtle)', minHeight: '100vh' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px var(--accent-dim); }
      `}</style>

      {/* Nav */}
      <nav style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <ThemeToggle />
            <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none' }}>
              ← Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '40px 24px 80px', maxWidth: 680 }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 32 }}>
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 10 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: (pendingAvatar ?? avatarUrl) ? 'transparent' : 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 30, color: '#fff',
                overflow: 'hidden', border: '3px solid var(--border)',
              }}>
                {(pendingAvatar ?? avatarUrl)
                  ? <img src={pendingAvatar ?? avatarUrl!} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initials}
              </div>
              {avatarUrl && !pendingAvatar && (
                <button onClick={removeAvatar} disabled={avatarSaving} title="Remove photo" style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--red)', border: '2px solid var(--bg)',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>×</button>
              )}
            </div>

            {pendingAvatar ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  onClick={saveAvatar}
                  disabled={avatarSaving}
                  style={{
                    padding: '7px 16px', background: 'var(--accent)', color: '#fff',
                    border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700,
                    cursor: avatarSaving ? 'not-allowed' : 'pointer',
                    opacity: avatarSaving ? 0.7 : 1,
                    display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                  }}
                >
                  {avatarSaving ? <Spinner size={12} /> : null}
                  Save photo
                </button>
                <button
                  onClick={cancelAvatar}
                  disabled={avatarSaving}
                  style={{
                    padding: '7px 16px', background: 'var(--bg-alt)', color: 'var(--text)',
                    border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarSaving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', background: 'var(--bg-alt)',
                  border: '1px solid var(--border)', borderRadius: 6,
                  fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer',
                  width: 80,
                }}
              >
                <CameraIcon /> Edit
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ paddingTop: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 4 }}>
              Account &amp; Security
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 4 }}>{profile?.email ?? user?.email}</p>
            {pendingAvatar && !avatarSaving && (
              <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>New photo selected — click Save photo to confirm.</p>
            )}
            {avatarMsg && !pendingAvatar && (
              <p style={{ fontSize: 12, fontWeight: 600, color: avatarMsg.ok ? 'var(--green)' : 'var(--red)' }}>
                {avatarMsg.text}
              </p>
            )}
          </div>
        </div>

        {/* ── Profile ── */}
        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Profile</h2>
          {profileLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spinner /></div>
          ) : (
            <form onSubmit={saveProfile}>
              {profileMsg && <Alert msg={profileMsg} />}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Field label="First name">
                  <input
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="First name"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Last name">
                  <input
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last name"
                    style={inputStyle}
                  />
                </Field>
              </div>
              <Field label="Username">
                <input value={profile?.username ?? ''} disabled style={{ ...inputStyle, background: 'var(--bg-subtle)', color: 'var(--text-muted)' }} />
              </Field>
              <Field label="Email">
                <input value={profile?.email ?? ''} disabled style={{ ...inputStyle, background: 'var(--bg-subtle)', color: 'var(--text-muted)' }} />
              </Field>
              <button
                type="submit"
                disabled={profileSaving}
                style={{
                  marginTop: 4, padding: '10px 24px', background: 'var(--accent)', color: '#fff',
                  border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700,
                  cursor: profileSaving ? 'not-allowed' : 'pointer', opacity: profileSaving ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {profileSaving && <Spinner size={14} />}
                Save changes
              </button>
            </form>
          )}
        </Card>

        {/* ── Password ── */}
        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Change Password</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Must be at least 8 characters.
          </p>
          <form onSubmit={changePassword}>
            {pwdMsg && <Alert msg={pwdMsg} />}
            <Field label="Current password">
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPwd ? 'text' : 'password'}
                  value={currentPwd}
                  onChange={e => setCurrentPwd(e.target.value)}
                  placeholder="Your current password"
                  required
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowCurrentPwd(v => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showCurrentPwd ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </Field>
            <Field label="New password">
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  placeholder="New password (min. 8 chars)"
                  required
                  minLength={8}
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowNewPwd(v => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showNewPwd ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </Field>
            <Field label="Confirm new password">
              <input
                type="password"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                placeholder="Repeat new password"
                required
                style={{
                  ...inputStyle,
                  borderColor: confirmPwd && confirmPwd !== newPwd ? 'var(--red)' : 'var(--border)',
                }}
              />
              {confirmPwd && confirmPwd !== newPwd && (
                <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>Passwords do not match</p>
              )}
            </Field>
            <button
              type="submit"
              disabled={pwdSaving || (!!confirmPwd && confirmPwd !== newPwd)}
              style={{
                marginTop: 4, padding: '10px 24px', background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700,
                cursor: pwdSaving ? 'not-allowed' : 'pointer', opacity: pwdSaving ? 0.7 : 1,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {pwdSaving && <Spinner size={14} />}
              Update password
            </button>
          </form>
        </Card>

        {/* ── 2FA ── */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Two-Factor Authentication</h2>
            {totpLoading ? <Spinner size={18} /> : (
              <span style={{
                padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                background: totpEnabled ? 'var(--green-dim)' : 'var(--bg-subtle)',
                color: totpEnabled ? 'var(--green)' : 'var(--text-muted)',
                border: `1px solid ${totpEnabled ? 'rgba(22,163,74,0.35)' : 'var(--border)'}`,
              }}>
                {totpEnabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Use an authenticator app (Google Authenticator, Aegis…) to add an extra layer of security.
          </p>
          {totpMsg && <Alert msg={totpMsg} />}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {!totpEnabled && (
              <button
                onClick={setupTotp}
                disabled={totpSaving}
                style={{
                  padding: '10px 20px', background: 'var(--accent)', color: '#fff',
                  border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700,
                  cursor: totpSaving ? 'not-allowed' : 'pointer', opacity: totpSaving ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {totpSaving ? <Spinner size={14} /> : <LockIcon />}
                {totpSaving ? 'Redirecting…' : 'Set up 2FA'}
              </button>
            )}
            {totpEnabled && (
              <button
                onClick={disableTotp}
                disabled={totpSaving}
                style={{
                  padding: '10px 20px', background: 'var(--red-dim)', color: 'var(--red)',
                  border: '1px solid rgba(220,38,38,0.35)', borderRadius: 6, fontSize: 13, fontWeight: 700,
                  cursor: totpSaving ? 'not-allowed' : 'pointer', opacity: totpSaving ? 0.6 : 1,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {totpSaving ? <Spinner size={14} /> : <TrashIcon />}
                Remove 2FA
              </button>
            )}
          </div>
        </Card>

        {/* ── Sign out ── */}
        <Card danger>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--red)', marginBottom: 6 }}>Sign out</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 18 }}>End your current session.</p>
          <button
            onClick={logout}
            style={{
              padding: '10px 20px', background: 'var(--red-dim)', color: 'var(--red)',
              border: '1px solid rgba(220,38,38,0.35)', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Sign out of SkillFlow
          </button>
        </Card>

        {/* ── Delete account ── */}
        <Card danger>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--red)', marginBottom: 6 }}>Delete account</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Permanently delete your SkillFlow account and all associated data. This action <strong>cannot be undone</strong>.
            Type <strong style={{ color: 'var(--red)' }}>DELETE</strong> below to confirm.
          </p>
          {deleteMsg && <Alert msg={deleteMsg} />}
          <input
            value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
            placeholder="Type DELETE to confirm"
            style={{
              width: '100%', maxWidth: 260, padding: '9px 12px', marginBottom: 14,
              border: '1px solid var(--border)', borderRadius: 6, fontSize: 14,
              color: 'var(--text)', background: 'var(--surface)', boxSizing: 'border-box', display: 'block',
            }}
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirm !== 'DELETE' || deleting}
            style={{
              padding: '10px 20px',
              background: deleteConfirm === 'DELETE' && !deleting ? 'var(--red)' : 'var(--red-dim)',
              color: deleteConfirm === 'DELETE' && !deleting ? '#fff' : 'var(--red)',
              border: '1px solid rgba(220,38,38,0.35)', borderRadius: 6, fontSize: 13, fontWeight: 700,
              cursor: deleteConfirm === 'DELETE' && !deleting ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {deleting && <Spinner size={14} />}
            {deleting ? 'Deleting…' : 'Permanently delete my account'}
          </button>
        </Card>
      </div>
    </div>
  )
}

function Eye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}

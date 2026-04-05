'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Помилка входу'); return }
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      window.location.href = '/dashboard'
    } catch { setError('Помилка з\'єднання з сервером') }
    finally { setLoading(false) }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="url(#g1)" />
              <rect x="10" y="14" width="28" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="8" y="20" width="22" height="3" rx="1.5" fill="white" opacity="0.8"/>
              <rect x="10" y="26" width="28" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="18" y="32" width="22" height="3" rx="1.5" fill="white" opacity="0.7"/>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient></defs>
            </svg>
            <span style={{ fontSize: 24, fontWeight: 700, background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earthify</span>
          </Link>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Увійдіть у свій акаунт</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 40 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 15 }}
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Пароль</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 15 }}
              />
            </div>
            {error && <p style={{ color: 'var(--accent-red)', fontSize: 14, marginBottom: 16, padding: '10px 14px', background: '#ef444420', borderRadius: 'var(--radius-sm)', border: '1px solid #ef444440' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--gradient)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 600, opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 24, textAlign: 'center' }}>
            Немає акаунту?{' '}
            <Link href="/register" style={{ color: 'var(--accent-purple)', fontWeight: 500 }}>Зареєструватись</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

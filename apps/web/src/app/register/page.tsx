'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', businessName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, businessType: 'hotel' }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Помилка реєстрації'); return }
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      window.location.href = '/dashboard'
    } catch { setError('Помилка з\'єднання з сервером') }
    finally { setLoading(false) }
  }

  const fields = [
    { label: "Ваше ім'я", name: 'name', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Пароль (мін. 8 символів)', name: 'password', type: 'password' },
    { label: 'Назва бізнесу', name: 'businessName', type: 'text' },
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="url(#g2)" />
              <rect x="10" y="14" width="28" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="8" y="20" width="22" height="3" rx="1.5" fill="white" opacity="0.8"/>
              <rect x="10" y="26" width="28" height="3" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="18" y="32" width="22" height="3" rx="1.5" fill="white" opacity="0.7"/>
              <defs><linearGradient id="g2" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient></defs>
            </svg>
            <span style={{ fontSize: 24, fontWeight: 700, background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earthify</span>
          </Link>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Створіть акаунт — 14 днів безкоштовно</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 40 }}>
          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <div key={f.name} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>{f.label}</label>
                <input
                  type={f.type} name={f.name}
                  value={form[f.name as keyof typeof form]}
                  onChange={handleChange} required
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 15 }}
                />
              </div>
            ))}
            {error && <p style={{ color: 'var(--accent-red)', fontSize: 14, marginBottom: 16, padding: '10px 14px', background: '#ef444420', borderRadius: 'var(--radius-sm)', border: '1px solid #ef444440' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--gradient)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 600, opacity: loading ? 0.7 : 1, marginTop: 8 }}>
              {loading ? 'Реєстрація...' : 'Зареєструватись'}
            </button>
          </form>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 24, textAlign: 'center' }}>
            Вже є акаунт?{' '}
            <Link href="/login" style={{ color: 'var(--accent-purple)', fontWeight: 500 }}>Увійти</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

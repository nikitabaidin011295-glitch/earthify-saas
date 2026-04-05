import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="url(#grad1)" />
          <rect x="10" y="14" width="28" height="3" rx="1.5" fill="white" opacity="0.9"/>
          <rect x="8" y="20" width="22" height="3" rx="1.5" fill="white" opacity="0.8"/>
          <rect x="10" y="26" width="28" height="3" rx="1.5" fill="white" opacity="0.9"/>
          <rect x="18" y="32" width="22" height="3" rx="1.5" fill="white" opacity="0.7"/>
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="#7c3aed"/>
              <stop offset="100%" stopColor="#06b6d4"/>
            </linearGradient>
          </defs>
        </svg>
        <span style={{
          fontSize: 40, fontWeight: 700,
          background: 'var(--gradient-text)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Earthify</span>
      </div>

      <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16, maxWidth: 600, lineHeight: 1.2 }}>
        Управляйте бізнесом<br />
        <span style={{ background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          в одному місці
        </span>
      </h1>

      <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 48, maxWidth: 480 }}>
        Модульна платформа для готелів, спа, салонів, ресторанів та басейнів. Вмикай тільки те, що потрібно.
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/register" style={{
          padding: '14px 32px',
          background: 'var(--gradient)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: 16,
          transition: 'opacity 0.2s',
        }}>
          Почати безкоштовно
        </Link>
        <Link href="/login" style={{
          padding: '14px 32px',
          background: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: 16,
        }}>
          Увійти
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 64, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['🏨 Готель', '💆 СПА', '💇 Салон', '🏊 Басейн', '🍽️ Ресторан', '☕ Кафе'].map(m => (
          <span key={m} style={{
            padding: '8px 16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontSize: 14,
          }}>{m}</span>
        ))}
      </div>
    </main>
  )
}

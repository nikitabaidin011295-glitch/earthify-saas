'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  id: string; name: string; email: string; role: string
  tenant: { id: string; name: string; plan: string; modulesEnabled: string[]; subscription?: any }
}

const MODULE_INFO: Record<string, { label: string; icon: string; desc: string; href: string; color: string }> = {
  core:       { label: 'Core',      icon: '⚙️',  desc: 'Базові налаштування',     href: '/dashboard/settings', color: '#6b7280' },
  hotel:      { label: 'Готель',    icon: '🏨',  desc: 'PMS, номери, check-in',  href: '/dashboard/hotel',    color: '#7c3aed' },
  spa:        { label: 'СПА',       icon: '💆',  desc: 'Записи, майстри',         href: '/dashboard/spa',      color: '#06b6d4' },
  salon:      { label: 'Салон',     icon: '💇',  desc: 'Послуги краси',           href: '/dashboard/salon',    color: '#ec4899' },
  pool:       { label: 'Басейн',    icon: '🏊',  desc: 'Абонементи, сесії',       href: '/dashboard/pool',     color: '#10b981' },
  restaurant: { label: 'Ресторан',  icon: '🍽️', desc: 'Меню, столики',           href: '/dashboard/restaurant', color: '#f59e0b' },
  cafe:       { label: 'Кафе',      icon: '☕',  desc: 'Бар, напої',             href: '/dashboard/restaurant', color: '#92400e' },
}

const STATS = [
  { label: 'Гостей сьогодні', value: '0', icon: '👥', color: '#7c3aed' },
  { label: 'Бронювань',       value: '0', icon: '📅', color: '#06b6d4' },
  { label: 'Виторг',          value: '₴0', icon: '💰', color: '#10b981' },
  { label: 'Повідомлень',     value: '0', icon: '💬', color: '#f59e0b' },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { window.location.href = '/login'; return }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { if (data.id) setUser(data); else window.location.href = '/login' })
      .catch(() => window.location.href = '/login')
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--accent-purple)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
    </div>
  )

  if (!user) return null

  const activeModules = user.tenant.modulesEnabled.filter(m => m !== 'core')

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Привіт, {user.name}! 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{user.tenant.name} · {user.role}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 28, opacity: 0.2 }}>{s.icon}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Активні модулі</h2>
          <Link href="/dashboard/settings" style={{ color: 'var(--accent-purple)', fontSize: 13 }}>Налаштувати →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {activeModules.map(mod => {
            const info = MODULE_INFO[mod]
            if (!info) return null
            return (
              <Link key={mod} href={info.href} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: 20, display: 'block',
                transition: 'all 0.2s', textDecoration: 'none',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = info.color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{info.icon}</div>
                <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>{info.label}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{info.desc}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Швидкі дії</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: '➕ Новий гість', href: '/dashboard/guests' },
            { label: '📅 Бронювання', href: '/dashboard/hotel' },
            { label: '💬 Inbox', href: '/dashboard/inbox' },
            { label: '⚙️ Налаштування', href: '/dashboard/settings' },
          ].map(a => (
            <Link key={a.label} href={a.href} style={{
              padding: '10px 20px', background: 'var(--bg-secondary)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)', fontSize: 14, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-purple)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

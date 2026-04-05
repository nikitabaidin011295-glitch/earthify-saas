'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard', label: 'Дашборд', icon: '◻' },
  { href: '/dashboard/guests', label: 'Гості', icon: '👥' },
  { href: '/dashboard/hotel', label: 'Готель', icon: '🏨' },
  { href: '/dashboard/spa', label: 'СПА', icon: '💆' },
  { href: '/dashboard/salon', label: 'Салон', icon: '💇' },
  { href: '/dashboard/pool', label: 'Басейн', icon: '🏊' },
  { href: '/dashboard/restaurant', label: 'Ресторан', icon: '🍽️' },
  { href: '/dashboard/inbox', label: 'Inbox', icon: '💬' },
  { href: '/dashboard/settings', label: 'Налаштування', icon: '⚙️' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [userName, setUserName] = useState('')
  const [tenantName, setTenantName] = useState('')
  const [modules, setModules] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { window.location.href = '/login'; return }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (!data.id) { window.location.href = '/login'; return }
        setUserName(data.name)
        setTenantName(data.tenant?.name || '')
        setModules(data.tenant?.modulesEnabled || [])
      })
      .catch(() => window.location.href = '/login')
  }, [])

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  const moduleMap: Record<string, string> = {
    hotel: '/dashboard/hotel',
    spa: '/dashboard/spa',
    salon: '/dashboard/salon',
    pool: '/dashboard/pool',
    restaurant: '/dashboard/restaurant',
    cafe: '/dashboard/restaurant',
  }

  const visibleNav = NAV.filter(item => {
    if (['/dashboard', '/dashboard/guests', '/dashboard/inbox', '/dashboard/settings'].includes(item.href)) return true
    const mod = Object.entries(moduleMap).find(([, path]) => path === item.href)?.[0]
    return mod ? modules.includes(mod) : true
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64, minHeight: '100vh',
        background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.2s ease', overflow: 'hidden', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="24" cy="24" r="24" fill="url(#gl)" />
            <rect x="10" y="14" width="28" height="3" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="8" y="20" width="22" height="3" rx="1.5" fill="white" opacity="0.8"/>
            <rect x="10" y="26" width="28" height="3" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="18" y="32" width="22" height="3" rx="1.5" fill="white" opacity="0.7"/>
            <defs><linearGradient id="gl" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient></defs>
          </svg>
          {sidebarOpen && (
            <span style={{ fontSize: 18, fontWeight: 700, background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
              Earthify
            </span>
          )}
        </div>

        {/* Business name */}
        {sidebarOpen && tenantName && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Бізнес</p>
            <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tenantName}</p>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {visibleNav.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: 2,
                background: active ? '#7c3aed20' : 'transparent',
                color: active ? 'var(--accent-purple)' : 'var(--text-secondary)',
                fontWeight: active ? 600 : 400, fontSize: 14,
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && <span style={{ fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</span>}
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '8px 12px', background: 'transparent',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)', fontSize: 13, transition: 'all 0.2s',
          }}>
            {sidebarOpen ? '🚪 Вийти' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 10 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', color: 'var(--text-secondary)', fontSize: 20, padding: 4 }}>☰</button>
          <div style={{ flex: 1 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Trial · 14 днів</span>
        </header>
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

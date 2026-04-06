'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const modules = [
  { id: 'hotel',      label: 'Готель',    icon: '🏨', path: '/dashboard/hotel' },
  { id: 'spa',        label: 'СПА',       icon: '💆', path: '/dashboard/spa' },
  { id: 'salon',      label: 'Салон',     icon: '✂️',  path: '/dashboard/salon' },
  { id: 'restaurant', label: 'Ресторан',  icon: '🍽️', path: '/dashboard/restaurant' },
  { id: 'cafe',       label: 'Кафе/Бар',  icon: '☕', path: '/dashboard/cafe' },
  { id: 'pool',       label: 'Басейн',    icon: '🏊', path: '/dashboard/pool' },
]

const navItems = [
  { label: 'Огляд',    icon: '📊', path: '/dashboard' },
  { label: 'Гості',    icon: '👥', path: '/dashboard/guests' },
  { label: 'Каса',     icon: '💳', path: '/dashboard/billing' },
  { label: 'Налаштування', icon: '⚙️', path: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [tenant, setTenant] = useState<{ businessName: string } | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setTenant({ businessName: payload.businessName || 'Мій бізнес' })
    } catch { router.push('/login') }
  }, [router])

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/')
  }

  const isActive = (path: string) =>
    path === '/dashboard' ? pathname === path : pathname.startsWith(path)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f7' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: collapsed ? 64 : 240,
        background: '#fff',
        borderRight: '1px solid #ebebeb',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" fill="#534AB7"/>
                <ellipse cx="14" cy="14" rx="13" ry="5.5" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
                <ellipse cx="14" cy="14" rx="5.5" ry="13" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
              </svg>
              <span style={{ fontWeight: 600, fontSize: 15, color: '#111' }}>Earthify</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#999', fontSize: 16 }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Business name */}
        {!collapsed && tenant && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>Бізнес</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tenant.businessName}</div>
          </div>
        )}

        {/* Main nav */}
        <nav style={{ padding: '8px 8px', flex: 1, overflow: 'auto' }}>
          {navItems.map(item => (
            <Link key={item.path} href={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px 0' : '9px 12px',
              borderRadius: 8, marginBottom: 2,
              background: isActive(item.path) ? '#EEEDFE' : 'transparent',
              color: isActive(item.path) ? '#534AB7' : '#555',
              textDecoration: 'none', fontSize: 13, fontWeight: isActive(item.path) ? 600 : 400,
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'background 0.15s',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {!collapsed && item.label}
            </Link>
          ))}

          {/* Modules divider */}
          {!collapsed && <div style={{ fontSize: 11, color: '#aaa', padding: '12px 12px 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Модулі</div>}
          {collapsed && <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }}/>}

          {modules.map(mod => (
            <Link key={mod.path} href={mod.path} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px 0' : '9px 12px',
              borderRadius: 8, marginBottom: 2,
              background: isActive(mod.path) ? '#EEEDFE' : 'transparent',
              color: isActive(mod.path) ? '#534AB7' : '#555',
              textDecoration: 'none', fontSize: 13, fontWeight: isActive(mod.path) ? 600 : 400,
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'background 0.15s',
            }}>
              <span style={{ fontSize: 16 }}>{mod.icon}</span>
              {!collapsed && mod.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid #f0f0f0' }}>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px 0' : '9px 12px',
            borderRadius: 8, width: '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#999', fontSize: 13,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <span style={{ fontSize: 16 }}>🚪</span>
            {!collapsed && 'Вийти'}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>

    </div>
  )
}

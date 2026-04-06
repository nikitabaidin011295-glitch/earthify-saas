'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { label: 'Огляд', icon: '📊', path: '/dashboard' },
  { label: 'Гості', icon: '👥', path: '/dashboard/guests' },
  { label: 'Аналітика', icon: '📈', path: '/dashboard/analytics' },
  { label: 'Каса', icon: '💳', path: '/dashboard/billing' },
  { label: 'Налаштування', icon: '⚙️', path: '/dashboard/settings' },
]

const modules = [
  {
    id: 'hotel', label: 'Готель', icon: '🏨', path: '/dashboard/hotel',
    sub: [
      { label: 'Тарифи', path: '/dashboard/hotel/pricing' },
      { label: 'Housekeeping', path: '/dashboard/hotel/housekeeping' },
    ],
  },
  { id: 'spa', label: 'СПА', icon: '💆', path: '/dashboard/spa', sub: [] },
  { id: 'salon', label: 'Салон', icon: '✂️', path: '/dashboard/salon', sub: [] },
  { id: 'restaurant', label: 'Ресторан', icon: '🍽️', path: '/dashboard/restaurant', sub: [] },
  { id: 'cafe', label: 'Кафе/Бар', icon: '☕', path: '/dashboard/cafe', sub: [] },
  { id: 'pool', label: 'Басейн', icon: '🏊', path: '/dashboard/pool', sub: [] },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [tenant, setTenant] = useState<{ businessName: string } | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [expandedModule, setExpandedModule] = useState<string | null>('hotel')

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
        width: collapsed ? 64 : 220,
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
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" fill="#534AB7"/>
                <ellipse cx="14" cy="14" rx="13" ry="5.5" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
                <ellipse cx="14" cy="14" rx="5.5" ry="13" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
              </svg>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Earthify</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#bbb', fontSize: 14 }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Business name */}
        {!collapsed && tenant && (
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 10, color: '#bbb', marginBottom: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Бізнес</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tenant.businessName}</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ padding: '8px 6px', flex: 1, overflowY: 'auto' }}>
          {navItems.map(item => (
            <Link key={item.path} href={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: collapsed ? '9px 0' : '8px 10px',
              borderRadius: 8, marginBottom: 1,
              background: isActive(item.path) ? '#EEEDFE' : 'transparent',
              color: isActive(item.path) ? '#534AB7' : '#666',
              textDecoration: 'none', fontSize: 13, fontWeight: isActive(item.path) ? 600 : 400,
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {!collapsed && item.label}
            </Link>
          ))}

          {/* Modules divider */}
          {!collapsed && <div style={{ fontSize: 10, color: '#bbb', padding: '10px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Модулі</div>}
          {collapsed && <div style={{ borderTop: '1px solid #f0f0f0', margin: '6px 0' }}/>}

          {modules.map(mod => (
            <div key={mod.path}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href={mod.path} style={{
                  display: 'flex', alignItems: 'center', gap: 8, flex: 1,
                  padding: collapsed ? '9px 0' : '8px 10px',
                  borderRadius: 8, marginBottom: 1,
                  background: pathname === mod.path ? '#EEEDFE' : 'transparent',
                  color: pathname === mod.path ? '#534AB7' : '#666',
                  textDecoration: 'none', fontSize: 13, fontWeight: pathname === mod.path ? 600 : 400,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}>
                  <span style={{ fontSize: 15 }}>{mod.icon}</span>
                  {!collapsed && mod.label}
                </Link>
                {!collapsed && mod.sub.length > 0 && (
                  <button onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 10, padding: '0 8px', lineHeight: 1 }}>
                    {expandedModule === mod.id ? '▼' : '▶'}
                  </button>
                )}
              </div>
              {/* Submenu */}
              {!collapsed && expandedModule === mod.id && mod.sub.map(sub => (
                <Link key={sub.path} href={sub.path} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px 6px 28px', borderRadius: 8, marginBottom: 1,
                  background: pathname === sub.path ? '#EEEDFE' : 'transparent',
                  color: pathname === sub.path ? '#534AB7' : '#888',
                  textDecoration: 'none', fontSize: 12, fontWeight: pathname === sub.path ? 600 : 400,
                }}>
                  · {sub.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '10px 6px', borderTop: '1px solid #f0f0f0' }}>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: collapsed ? '9px 0' : '8px 10px',
            borderRadius: 8, width: '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#aaa', fontSize: 13,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <span style={{ fontSize: 15 }}>🚪</span>
            {!collapsed && 'Вийти'}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>

    </div>
  )
}

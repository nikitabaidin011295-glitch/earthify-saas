'use client'
import { useEffect, useState } from 'react'

interface Stats {
  bookingsToday: number
  revenue: number
  guests: number
  occupancy: number
}

const quickActions = [
  { label: 'Нове бронювання', icon: '📅', href: '/dashboard/hotel/new-booking', color: '#534AB7' },
  { label: 'Новий запис СПА', icon: '💆', href: '/dashboard/spa/new-appointment', color: '#0F6E56' },
  { label: 'Запис в салон', icon: '✂️', href: '/dashboard/salon/new-appointment', color: '#7c3aed' },
  { label: 'Резерв столика', icon: '🍽️', href: '/dashboard/restaurant/new-booking', color: '#D85A30' },
]

const recentBookings = [
  { id: 'B001', guest: 'Олексій Коваль', service: 'Номер Делюкс', date: '05.04.2026', status: 'confirmed', amount: 2400 },
  { id: 'B002', guest: 'Марія Петренко', service: 'СПА — Масаж', date: '05.04.2026', status: 'pending', amount: 850 },
  { id: 'B003', guest: 'Іван Сидоренко', service: 'Столик на 4', date: '05.04.2026', status: 'confirmed', amount: 0 },
  { id: 'B004', guest: 'Анна Мельник', service: 'Стрижка + фарба', date: '05.04.2026', status: 'completed', amount: 1200 },
  { id: 'B005', guest: 'Дмитро Бондар', service: 'Басейн — абонемент', date: '04.04.2026', status: 'confirmed', amount: 1500 },
]

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  confirmed: { bg: '#E1F5EE', color: '#0F6E56', label: 'Підтверджено' },
  pending:   { bg: '#FAEEDA', color: '#854F0B', label: 'Очікує' },
  completed: { bg: '#EEEDFE', color: '#3C3489', label: 'Завершено' },
  cancelled: { bg: '#FCEBEB', color: '#A32D2D', label: 'Скасовано' },
}

export default function DashboardPage() {
  const [stats] = useState<Stats>({ bookingsToday: 12, revenue: 18400, guests: 47, occupancy: 78 })
  const [greeting, setGreeting] = useState('Доброго дня')

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting('Доброго ранку')
    else if (h < 18) setGreeting('Доброго дня')
    else setGreeting('Доброго вечора')
  }, [])

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: '#111', marginBottom: 4 }}>{greeting}! 👋</h1>
        <p style={{ color: '#888', fontSize: 14 }}>Ось що відбувається сьогодні у вашому бізнесі</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: '2rem' }}>
        {[
          { label: 'Бронювань сьогодні', value: stats.bookingsToday, icon: '📅', color: '#534AB7', bg: '#EEEDFE' },
          { label: 'Виторг сьогодні', value: `₴${stats.revenue.toLocaleString()}`, icon: '💰', color: '#0F6E56', bg: '#E1F5EE' },
          { label: 'Активних гостей', value: stats.guests, icon: '👥', color: '#D85A30', bg: '#FAECE7' },
          { label: 'Завантаженість', value: `${stats.occupancy}%`, icon: '📊', color: '#7c3aed', bg: '#F5F0FF' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>{s.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111', marginBottom: '1rem' }}>Швидкі дії</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {quickActions.map((a, i) => (
            <a key={i} href={a.href} style={{
              background: '#fff', border: '1px solid #ebebeb', borderRadius: 12,
              padding: '1rem', display: 'flex', alignItems: 'center', gap: 10,
              textDecoration: 'none', color: '#111', fontSize: 13, fontWeight: 500,
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = a.color; (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px ${a.color}20` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ebebeb'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
            >
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              {a.label}
            </a>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Останні бронювання</h2>
          <a href="/dashboard/bookings" style={{ fontSize: 13, color: '#534AB7', textDecoration: 'none' }}>Всі →</a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              {['ID', 'Гість', 'Послуга', 'Дата', 'Статус', 'Сума'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((b, i) => (
              <tr key={b.id} style={{ borderBottom: i < recentBookings.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#aaa', fontFamily: 'monospace' }}>{b.id}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>{b.guest}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{b.service}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{b.date}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: statusColors[b.status].bg, color: statusColors[b.status].color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                    {statusColors[b.status].label}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#111' }}>
                  {b.amount > 0 ? `₴${b.amount.toLocaleString()}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

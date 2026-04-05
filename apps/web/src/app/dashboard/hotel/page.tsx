'use client'
import { useEffect, useState } from 'react'

interface Booking { id: string; guest: { name: string; phone: string }; room: { number: string; type: string }; checkIn: string; checkOut: string; status: string; totalAmount: number; paidAmount: number }

const STATUS_COLOR: Record<string, string> = {
  confirmed: '#06b6d4', checked_in: '#10b981', checked_out: '#6b7280', cancelled: '#ef4444',
}
const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Підтверджено', checked_in: 'Заселено', checked_out: 'Виїхав', cancelled: 'Скасовано',
}

export default function HotelPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'checkin' | 'checkout'>('all')

  async function load() {
    setLoading(true)
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotel/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setBookings(data.bookings || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function checkin(id: string) {
    const token = localStorage.getItem('accessToken')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotel/bookings/${id}/checkin`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` },
    })
    load()
  }

  async function checkout(id: string) {
    const token = localStorage.getItem('accessToken')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotel/bookings/${id}/checkout`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` },
    })
    load()
  }

  const today = new Date().toDateString()
  const filtered = bookings.filter(b => {
    if (activeTab === 'today') return new Date(b.checkIn).toDateString() === today || new Date(b.checkOut).toDateString() === today
    if (activeTab === 'checkin') return new Date(b.checkIn).toDateString() === today && b.status === 'confirmed'
    if (activeTab === 'checkout') return new Date(b.checkOut).toDateString() === today && b.status === 'checked_in'
    return true
  })

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>🏨 Готель</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Управління номерами та бронюваннями</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['all', 'Всі'], ['today', 'Сьогодні'], ['checkin', 'Check-in'], ['checkout', 'Check-out']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key as any)} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: 14,
            background: activeTab === key ? 'var(--accent-purple)' : 'var(--bg-card)',
            color: activeTab === key ? 'white' : 'var(--text-secondary)',
            border: `1px solid ${activeTab === key ? 'var(--accent-purple)' : 'var(--border)'}`,
            transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      {/* Bookings */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Гість', 'Номер', 'Check-in', 'Check-out', 'Сума', 'Статус', 'Дії'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Завантаження...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Бронювань немає</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <td style={{ padding: '14px 20px' }}>
                  <p style={{ fontWeight: 500 }}>{b.guest.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{b.guest.phone}</p>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <p style={{ fontWeight: 600 }}>№{b.room.number}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{b.room.type}</p>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{new Date(b.checkIn).toLocaleDateString('uk-UA')}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{new Date(b.checkOut).toLocaleDateString('uk-UA')}</td>
                <td style={{ padding: '14px 20px' }}>
                  <p style={{ fontWeight: 600 }}>₴{Number(b.totalAmount).toLocaleString()}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Сплачено: ₴{Number(b.paidAmount).toLocaleString()}</p>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: STATUS_COLOR[b.status], border: `1px solid ${STATUS_COLOR[b.status]}40` }}>
                    {STATUS_LABEL[b.status] || b.status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {b.status === 'confirmed' && (
                    <button onClick={() => checkin(b.id)} style={{ padding: '6px 14px', background: '#10b98120', color: '#10b981', border: '1px solid #10b98140', borderRadius: 'var(--radius-sm)', fontSize: 13, cursor: 'pointer' }}>
                      Check-in
                    </button>
                  )}
                  {b.status === 'checked_in' && (
                    <button onClick={() => checkout(b.id)} style={{ padding: '6px 14px', background: '#6b728020', color: '#9ca3af', border: '1px solid #6b728040', borderRadius: 'var(--radius-sm)', fontSize: 13, cursor: 'pointer' }}>
                      Check-out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

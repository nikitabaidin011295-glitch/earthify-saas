'use client'
import { useEffect, useState } from 'react'

interface Order { id: string; table?: { number: string }; guest?: { name: string }; items: any[]; total: number; status: string; createdAt: string }

const STATUS_COLOR: Record<string, string> = { pending: '#f59e0b', preparing: '#7c3aed', ready: '#06b6d4', served: '#10b981', cancelled: '#ef4444' }
const STATUS_LABEL: Record<string, string> = { pending: 'Очікує', preparing: 'Готується', ready: 'Готово', served: 'Подано', cancelled: 'Скасовано' }

export default function RestaurantPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState('all')

  async function load() {
    setLoading(true)
    const token = localStorage.getItem('accessToken')
    const params = activeStatus !== 'all' ? `?status=${activeStatus}` : ''
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurant/orders${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [activeStatus])

  async function updateStatus(id: string, status: string) {
    const token = localStorage.getItem('accessToken')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurant/orders/${id}/status`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    load()
  }

  const statuses = ['all', 'pending', 'preparing', 'ready', 'served']

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>🍽️ Ресторан / Кафе</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Замовлення в реальному часі</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setActiveStatus(s)} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13,
            background: activeStatus === s ? (STATUS_COLOR[s] || 'var(--accent-purple)') : 'var(--bg-card)',
            color: activeStatus === s ? 'white' : 'var(--text-secondary)',
            border: `1px solid ${activeStatus === s ? (STATUS_COLOR[s] || 'var(--accent-purple)') : 'var(--border)'}`,
          }}>
            {s === 'all' ? 'Всі' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {loading ? <p style={{ color: 'var(--text-muted)' }}>Завантаження...</p>
        : orders.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center', gridColumn: '1/-1' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Замовлень немає</p>
          </div>
        ) : orders.map(o => (
          <div key={o.id} style={{ background: 'var(--bg-card)', border: `1px solid ${STATUS_COLOR[o.status]}40`, borderRadius: 'var(--radius-lg)', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 18 }}>{o.table ? `Стіл ${o.table.number}` : 'Take away'}</p>
                {o.guest && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{o.guest.name}</p>}
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: STATUS_COLOR[o.status], border: `1px solid ${STATUS_COLOR[o.status]}40`, height: 'fit-content' }}>
                {STATUS_LABEL[o.status]}
              </span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginBottom: 12 }}>
              {(Array.isArray(o.items) ? o.items : []).map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.qty}</span>
                  <span>₴{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>₴{Number(o.total).toLocaleString()}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {o.status === 'pending' && <button onClick={() => updateStatus(o.id, 'preparing')} style={{ padding: '6px 12px', background: '#7c3aed20', color: '#a78bfa', border: '1px solid #7c3aed40', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>Готувати</button>}
                {o.status === 'preparing' && <button onClick={() => updateStatus(o.id, 'ready')} style={{ padding: '6px 12px', background: '#06b6d420', color: '#06b6d4', border: '1px solid #06b6d440', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>Готово</button>}
                {o.status === 'ready' && <button onClick={() => updateStatus(o.id, 'served')} style={{ padding: '6px 12px', background: '#10b98120', color: '#10b981', border: '1px solid #10b98140', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>Подано</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

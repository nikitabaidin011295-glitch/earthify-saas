'use client'
import { useEffect, useState } from 'react'

interface Guest { id: string; name: string; phone: string; email: string; loyaltyPoints: number; loyaltyLevel: string; createdAt: string }

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  async function loadGuests() {
    setLoading(true)
    const token = localStorage.getItem('accessToken')
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/guests${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setGuests(data.guests || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { loadGuests() }, [search])

  async function createGuest() {
    const token = localStorage.getItem('accessToken')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/guests`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ name: '', phone: '', email: '' })
    loadGuests()
  }

  const LEVEL_COLOR: Record<string, string> = { bronze: '#cd7f32', silver: '#aaa', gold: '#f59e0b', platinum: '#06b6d4' }

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Гості</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Всього: {total}</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding: '10px 20px', background: 'var(--gradient)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 14 }}>
          + Новий гість
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Пошук за ім'ям, телефоном, email..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 400, padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14 }}
        />
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Новий гість</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
            {[['name', "Ім'я"], ['phone', 'Телефон'], ['email', 'Email']].map(([key, label]) => (
              <div key={key}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 6 }}>{label}</label>
                <input
                  value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 14 }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={createGuest} style={{ padding: '10px 24px', background: 'var(--gradient)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 14 }}>Зберегти</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', fontSize: 14 }}>Скасувати</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {["Ім'я", 'Телефон', 'Email', 'Лояльність', 'Рівень', 'Дата'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Завантаження...</td></tr>
            ) : guests.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Гостей поки немає</td></tr>
            ) : guests.map(g => (
              <tr key={g.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <td style={{ padding: '14px 20px', fontWeight: 500 }}>{g.name}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{g.phone}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{g.email || '—'}</td>
                <td style={{ padding: '14px 20px', color: 'var(--accent-amber)' }}>{g.loyaltyPoints} балів</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: LEVEL_COLOR[g.loyaltyLevel] || '#fff', border: `1px solid ${LEVEL_COLOR[g.loyaltyLevel] || '#fff'}40` }}>
                    {g.loyaltyLevel}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
                  {new Date(g.createdAt).toLocaleDateString('uk-UA')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

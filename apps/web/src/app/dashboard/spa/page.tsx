'use client'
import { useEffect, useState } from 'react'

interface Appointment { id: string; guest: { name: string; phone: string }; service: { name: string; durationMin: number }; staff?: { name: string }; startAt: string; endAt: string; status: string; amount: number }

const STATUS_COLOR: Record<string, string> = { confirmed: '#06b6d4', completed: '#10b981', cancelled: '#ef4444', no_show: '#6b7280' }
const STATUS_LABEL: Record<string, string> = { confirmed: 'Підтверджено', completed: 'Виконано', cancelled: 'Скасовано', no_show: 'Не з\'явився' }

export default function SpaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  async function load() {
    setLoading(true)
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/spa/appointments?date=${date}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setAppointments(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [date])

  async function updateStatus(id: string, status: string) {
    const token = localStorage.getItem('accessToken')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/spa/appointments/${id}/status`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    load()
  }

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>💆 СПА / Wellness</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Записи на сьогодні: {appointments.length}</p>
        </div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14 }}
        />
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {loading ? <p style={{ color: 'var(--text-muted)', padding: 20 }}>Завантаження...</p>
        : appointments.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📅</p>
            <p style={{ color: 'var(--text-secondary)' }}>Записів на цей день немає</p>
          </div>
        ) : appointments.map(a => (
          <div key={a.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 4, height: 60, borderRadius: 2, background: STATUS_COLOR[a.status] || '#6b7280', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600 }}>{a.guest.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{a.guest.phone}</p>
              </div>
              <div>
                <p style={{ fontWeight: 500 }}>{a.service.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{a.service.durationMin} хв</p>
              </div>
              <div>
                <p style={{ fontWeight: 500 }}>{new Date(a.startAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</p>
                {a.staff && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{a.staff.name}</p>}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {a.status === 'confirmed' && (
                  <>
                    <button onClick={() => updateStatus(a.id, 'completed')} style={{ padding: '6px 12px', background: '#10b98120', color: '#10b981', border: '1px solid #10b98140', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>Виконано</button>
                    <button onClick={() => updateStatus(a.id, 'no_show')} style={{ padding: '6px 12px', background: '#6b728020', color: '#9ca3af', border: '1px solid #6b728040', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer' }}>Не прийшов</button>
                  </>
                )}
                <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: STATUS_COLOR[a.status], border: `1px solid ${STATUS_COLOR[a.status]}40` }}>
                  {STATUS_LABEL[a.status] || a.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'

const plans = [
  { id: 1, name: 'Разовий', price: 250, visits: 1, days: 1 },
  { id: 2, name: '8 відвідувань', price: 1600, visits: 8, days: 60 },
  { id: 3, name: 'Місячний безліміт', price: 2400, visits: -1, days: 30 },
  { id: 4, name: 'Квартальний', price: 5500, visits: -1, days: 90 },
]

const slots = [
  { time: '07:00–09:00', capacity: 20, booked: 12 },
  { time: '09:00–11:00', capacity: 20, booked: 18 },
  { time: '11:00–13:00', capacity: 20, booked: 20 },
  { time: '13:00–15:00', capacity: 20, booked: 8 },
  { time: '15:00–17:00', capacity: 20, booked: 15 },
  { time: '17:00–19:00', capacity: 20, booked: 19 },
  { time: '19:00–21:00', capacity: 20, booked: 11 },
]

const guests = [
  { id: 1, name: 'Олексій Коваль', plan: 'Місячний безліміт', visits: 8, remaining: -1, qr: 'QR-001', expires: '30.04.2026' },
  { id: 2, name: 'Марія Петренко', plan: '8 відвідувань', visits: 3, remaining: 5, qr: 'QR-002', expires: '15.05.2026' },
  { id: 3, name: 'Іван Сидоренко', plan: 'Квартальний', visits: 24, remaining: -1, qr: 'QR-003', expires: '01.06.2026' },
  { id: 4, name: 'Анна Мельник', plan: 'Разовий', visits: 1, remaining: 0, qr: 'QR-004', expires: '05.04.2026' },
]

export default function PoolPage() {
  const [view, setView] = useState<'schedule' | 'subscriptions' | 'guests' | 'new'>('schedule')
  const [form, setForm] = useState({ guestName: '', phone: '', planId: '', date: '', slot: '' })
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setView('schedule') }, 2000)
  }

  const totalBooked = slots.reduce((s, sl) => s + sl.booked, 0)
  const totalCapacity = slots.reduce((s, sl) => s + sl.capacity, 0)

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>🏊 Басейн / Фітнес</h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Слоти, абонементи, відвідувачі</p>
        </div>
        <button onClick={() => setView('new')} style={{ background: '#185FA5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Новий абонемент
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: '1.5rem' }}>
        {[
          { label: 'Відвідувачів сьогодні', value: totalBooked, color: '#185FA5' },
          { label: 'Завантаженість', value: `${Math.round(totalBooked / totalCapacity * 100)}%`, color: '#534AB7' },
          { label: 'Активних абонементів', value: guests.filter(g => g.remaining !== 0).length, color: '#0F6E56' },
          { label: 'Слотів сьогодні', value: slots.length, color: '#888' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '1rem' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: '#f5f5f7', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ id: 'schedule', label: 'Розклад' }, { id: 'subscriptions', label: 'Тарифи' }, { id: 'guests', label: 'Абоненти' }, { id: 'new', label: '+ Абонемент' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id as typeof view)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: view === t.id ? '#fff' : 'transparent',
            color: view === t.id ? '#185FA5' : '#888',
            boxShadow: view === t.id ? '0 1px 4px #0001' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {view === 'schedule' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {slots.map((slot, i) => {
            const pct = Math.round(slot.booked / slot.capacity * 100)
            const isFull = slot.booked >= slot.capacity
            return (
              <div key={i} style={{ background: '#fff', border: `1.5px solid ${isFull ? '#FCEBEB' : '#ebebeb'}`, borderRadius: 14, padding: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{slot.time}</div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>{slot.booked} / {slot.capacity} місць</div>
                <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: isFull ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981', borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: isFull ? '#A32D2D' : '#0F6E56' }}>
                    {isFull ? 'Повний' : `${slot.capacity - slot.booked} вільних`}
                  </span>
                  {!isFull && <button onClick={() => setView('new')} style={{ background: '#E6F1FB', color: '#185FA5', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Записати</button>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {view === 'subscriptions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#185FA5', marginBottom: 4 }}>₴{plan.price}</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                {plan.visits === -1 ? 'Необмежена кількість' : `${plan.visits} відвідувань`} · {plan.days} днів
              </div>
              <button onClick={() => setView('new')} style={{ width: '100%', padding: '10px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Оформити
              </button>
            </div>
          ))}
        </div>
      )}

      {view === 'guests' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {["Ім'я", 'Абонемент', 'Відвідувань', 'Залишок', 'QR-код', 'Діє до'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guests.map((g, i) => (
                <tr key={g.id} style={{ borderBottom: i < guests.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{g.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{g.plan}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#185FA5' }}>{g.visits}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: g.remaining === 0 ? '#FCEBEB' : '#E1F5EE', color: g.remaining === 0 ? '#A32D2D' : '#0F6E56', fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 20 }}>
                      {g.remaining === -1 ? '∞' : g.remaining === 0 ? 'Вичерпано' : g.remaining}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'monospace', color: '#534AB7' }}>{g.qr}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{g.expires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'new' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '2rem', maxWidth: 500 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: '1.5rem' }}>Новий абонемент / запис</h2>
          {success && <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>✓ Абонемент оформлено!</div>}
          <form onSubmit={handleSubmit}>
            {[
              { label: "Ім'я клієнта", name: 'guestName', type: 'text' },
              { label: 'Телефон', name: 'phone', type: 'tel' },
              { label: 'Дата', name: 'date', type: 'date' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                <input type={f.type} required value={form[f.name as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Тариф</label>
              <select required value={form.planId} onChange={e => setForm(p => ({ ...p, planId: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }}>
                <option value="">Оберіть тариф</option>
                {plans.map(p => <option key={p.id} value={p.id}>{p.name} — ₴{p.price}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Часовий слот</label>
              <select value={form.slot} onChange={e => setForm(p => ({ ...p, slot: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }}>
                <option value="">Оберіть слот (опційно)</option>
                {slots.filter(s => s.booked < s.capacity).map((s, i) => <option key={i} value={s.time}>{s.time} ({s.capacity - s.booked} місць)</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Оформити</button>
              <button type="button" onClick={() => setView('schedule')} style={{ padding: '12px 20px', background: '#f5f5f7', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Скасувати</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

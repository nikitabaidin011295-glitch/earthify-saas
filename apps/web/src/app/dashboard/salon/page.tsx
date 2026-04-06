'use client'
import { useState } from 'react'

const services = [
  { id: 1, name: 'Жіноча стрижка', duration: 60, price: 450, category: 'Стрижка' },
  { id: 2, name: "Чоловіча стрижка", duration: 30, price: 250, category: 'Стрижка' },
  { id: 3, name: 'Фарбування волосся', duration: 120, price: 1200, category: 'Фарбування' },
  { id: 4, name: 'Тонування', duration: 90, price: 800, category: 'Фарбування' },
  { id: 5, name: 'Манікюр класичний', duration: 60, price: 350, category: 'Нігті' },
  { id: 6, name: 'Гель-лак', duration: 90, price: 550, category: 'Нігті' },
  { id: 7, name: 'Педикюр', duration: 75, price: 450, category: 'Нігті' },
  { id: 8, name: 'Брови — архітектура', duration: 45, price: 400, category: 'Брови/Вії' },
  { id: 9, name: 'Ламінування вій', duration: 60, price: 600, category: 'Брови/Вії' },
]

const masters = [
  { id: 1, name: 'Юлія Коваль', spec: 'Стрижка, Фарбування', rating: 4.9, visits: 234, avatar: 'ЮК', color: '#534AB7' },
  { id: 2, name: 'Вікторія Мороз', spec: 'Нігті', rating: 4.8, visits: 189, avatar: 'ВМ', color: '#D4537E' },
  { id: 3, name: 'Катерина Ліщук', spec: 'Брови, Вії', rating: 4.9, visits: 156, avatar: 'КЛ', color: '#0F6E56' },
]

const today = [
  { time: '09:00', guest: 'Оксана Бондар', service: 'Гель-лак', master: 'Вікторія Мороз', status: 'completed', price: 550 },
  { time: '10:30', guest: 'Наталія Сич', service: 'Жіноча стрижка', master: 'Юлія Коваль', status: 'in-progress', price: 450 },
  { time: '11:00', guest: 'Тетяна Руденко', service: 'Брови — архітектура', master: 'Катерина Ліщук', status: 'confirmed', price: 400 },
  { time: '13:00', guest: 'Ірина Павленко', service: 'Фарбування волосся', master: 'Юлія Коваль', status: 'confirmed', price: 1200 },
  { time: '14:30', guest: 'Марина Левченко', service: 'Манікюр класичний', master: 'Вікторія Мороз', status: 'pending', price: 350 },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  confirmed:    { label: 'Підтверджено', color: '#0F6E56', bg: '#E1F5EE' },
  pending:      { label: 'Очікує',       color: '#854F0B', bg: '#FAEEDA' },
  'in-progress':{ label: 'В процесі',   color: '#185FA5', bg: '#E6F1FB' },
  completed:    { label: 'Завершено',   color: '#3C3489', bg: '#EEEDFE' },
}

export default function SalonPage() {
  const [view, setView] = useState<'today' | 'services' | 'masters' | 'new'>('today')
  const [form, setForm] = useState({ guestName: '', phone: '', serviceId: '', masterId: '', date: '', time: '' })
  const [success, setSuccess] = useState(false)

  const revenue = today.filter(a => a.status === 'completed').reduce((s, a) => s + a.price, 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setView('today') }, 2000)
  }

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>✂️ Салон краси</h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Записи, майстри, послуги</p>
        </div>
        <button onClick={() => setView('new')} style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Новий запис
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: '1.5rem' }}>
        {[
          { label: 'Записів сьогодні', value: today.length, color: '#7c3aed' },
          { label: 'Завершено', value: today.filter(a => a.status === 'completed').length, color: '#0F6E56' },
          { label: 'Виторг сьогодні', value: `₴${revenue}`, color: '#D85A30' },
          { label: 'Майстрів', value: masters.length, color: '#534AB7' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '1rem' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: '#f5f5f7', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ id: 'today', label: 'Сьогодні' }, { id: 'services', label: 'Послуги' }, { id: 'masters', label: 'Майстри' }, { id: 'new', label: '+ Записати' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id as typeof view)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: view === t.id ? '#fff' : 'transparent',
            color: view === t.id ? '#7c3aed' : '#888',
            boxShadow: view === t.id ? '0 1px 4px #0001' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {view === 'today' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Час', 'Гість', 'Послуга', 'Майстер', 'Статус', 'Сума'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {today.map((a, i) => (
                <tr key={i} style={{ borderBottom: i < today.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#7c3aed' }}>{a.time}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>{a.guest}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{a.service}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{a.master}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: statusMap[a.status].bg, color: statusMap[a.status].color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                      {statusMap[a.status].label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: a.status === 'completed' ? '#0F6E56' : '#111' }}>₴{a.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'services' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {services.map(s => (
            <div key={s.id} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.category}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>⏱ {s.duration} хв</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#7c3aed' }}>₴{s.price}</span>
                <button onClick={() => setView('new')} style={{ background: '#F5F0FF', color: '#7c3aed', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Записати</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'masters' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {masters.map(m => (
            <div key={m.id} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: m.color + '20', color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>{m.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{m.spec}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, background: '#fafafa', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F59E0B' }}>⭐ {m.rating}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>рейтинг</div>
                </div>
                <div style={{ flex: 1, background: '#fafafa', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.visits}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>візитів</div>
                </div>
              </div>
              <button style={{ width: '100%', padding: '8px', background: m.color, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Розклад</button>
            </div>
          ))}
        </div>
      )}

      {view === 'new' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '2rem', maxWidth: 540 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: '1.5rem' }}>Новий запис</h2>
          {success && <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>✓ Запис успішно створено!</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: "Ім'я клієнта", name: 'guestName', type: 'text' },
                { label: 'Телефон', name: 'phone', type: 'tel' },
                { label: 'Дата', name: 'date', type: 'date' },
                { label: 'Час', name: 'time', type: 'time' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                  <input type={f.type} required value={form[f.name as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }} />
                </div>
              ))}
            </div>
            {[
              { label: 'Послуга', name: 'serviceId', options: services.map(s => ({ value: s.id, label: `${s.name} — ₴${s.price}` })) },
              { label: 'Майстер', name: 'masterId', options: masters.map(m => ({ value: m.id, label: `${m.name} ⭐${m.rating}` })) },
            ].map(f => (
              <div key={f.name} style={{ marginTop: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                <select required value={form[f.name as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }}>
                  <option value="">Оберіть...</option>
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Записати</button>
              <button type="button" onClick={() => setView('today')} style={{ padding: '12px 20px', background: '#f5f5f7', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Скасувати</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

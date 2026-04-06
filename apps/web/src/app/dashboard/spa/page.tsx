'use client'
import { useState } from 'react'

const services = [
  { id: 1, name: 'Класичний масаж', duration: 60, price: 850, category: 'Масаж' },
  { id: 2, name: 'Гарячі камені', duration: 90, price: 1200, category: 'Масаж' },
  { id: 3, name: 'Арома-масаж', duration: 75, price: 950, category: 'Масаж' },
  { id: 4, name: 'Facial — базовий', duration: 60, price: 750, category: 'Обличчя' },
  { id: 5, name: 'Facial — преміум', duration: 90, price: 1100, category: 'Обличчя' },
  { id: 6, name: 'Обгортання', duration: 60, price: 900, category: 'Тіло' },
  { id: 7, name: 'Пілінг тіла', duration: 45, price: 700, category: 'Тіло' },
  { id: 8, name: 'Манікюр', duration: 60, price: 400, category: 'Нігті' },
]

const masters = [
  { id: 1, name: 'Олена Коваль', specialization: 'Масаж, Тіло', rating: 4.9, avatar: 'ОК' },
  { id: 2, name: 'Тетяна Мороз', specialization: 'Обличчя, Тіло', rating: 4.8, avatar: 'ТМ' },
  { id: 3, name: 'Ірина Петренко', specialization: 'Нігті, Масаж', rating: 4.7, avatar: 'ІП' },
]

const appointments = [
  { id: 'A001', guest: 'Марія Бондар', service: 'Класичний масаж', master: 'Олена Коваль', time: '10:00', cabinet: '1', status: 'confirmed' },
  { id: 'A002', guest: 'Анна Сидоренко', service: 'Facial — преміум', master: 'Тетяна Мороз', time: '11:30', cabinet: '2', status: 'in-progress' },
  { id: 'A003', guest: 'Оксана Лисенко', service: 'Обгортання', master: 'Ірина Петренко', time: '13:00', cabinet: '3', status: 'pending' },
  { id: 'A004', guest: 'Наталія Коваль', service: 'Арома-масаж', master: 'Олена Коваль', time: '14:30', cabinet: '1', status: 'confirmed' },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  confirmed:   { label: 'Підтверджено', color: '#0F6E56', bg: '#E1F5EE' },
  pending:     { label: 'Очікує',       color: '#854F0B', bg: '#FAEEDA' },
  'in-progress': { label: 'В процесі', color: '#185FA5', bg: '#E6F1FB' },
  completed:   { label: 'Завершено',   color: '#3C3489', bg: '#EEEDFE' },
}

export default function SpaPage() {
  const [view, setView] = useState<'schedule' | 'services' | 'masters' | 'new'>('schedule')
  const [newAppt, setNewAppt] = useState({ guestName: '', phone: '', serviceId: '', masterId: '', date: '', time: '', notes: '' })
  const [success, setSuccess] = useState(false)

  function handleBook(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setView('schedule') }, 2000)
  }

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>💆 СПА / Wellness</h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Розклад, процедури, кабінети</p>
        </div>
        <button onClick={() => setView('new')} style={{ background: '#0F6E56', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Новий запис
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: '1.5rem' }}>
        {[
          { label: 'Записів сьогодні', value: appointments.length, color: '#0F6E56' },
          { label: 'В процесі', value: appointments.filter(a => a.status === 'in-progress').length, color: '#185FA5' },
          { label: 'Майстрів', value: masters.length, color: '#534AB7' },
          { label: 'Послуг', value: services.length, color: '#854F0B' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '1rem' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: '#f5f5f7', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ id: 'schedule', label: 'Розклад' }, { id: 'services', label: 'Послуги' }, { id: 'masters', label: 'Майстри' }, { id: 'new', label: '+ Записати' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id as typeof view)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: view === t.id ? '#fff' : 'transparent',
            color: view === t.id ? '#0F6E56' : '#888',
            boxShadow: view === t.id ? '0 1px 4px #0001' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Schedule */}
      {view === 'schedule' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Час', 'Гість', 'Послуга', 'Майстер', 'Кабінет', 'Статус', 'Дії'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < appointments.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#534AB7', fontSize: 14 }}>{a.time}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>{a.guest}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{a.service}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{a.master}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>Кабінет {a.cabinet}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: statusMap[a.status].bg, color: statusMap[a.status].color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                      {statusMap[a.status].label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: '#666' }}>Деталі</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Services */}
      {view === 'services' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {services.map(s => (
            <div key={s.id} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ fontSize: 11, color: '#0F6E56', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.category}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>⏱ {s.duration} хв</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#0F6E56' }}>₴{s.price}</span>
                <button style={{ background: '#E1F5EE', color: '#0F6E56', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Записати</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Masters */}
      {view === 'masters' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {masters.map(m => (
            <div key={m.id} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#EEEDFE', color: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, margin: '0 auto 12px' }}>{m.avatar}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{m.specialization}</div>
              <div style={{ fontSize: 14, color: '#F59E0B', fontWeight: 600 }}>⭐ {m.rating}</div>
              <button style={{ width: '100%', marginTop: 12, padding: '8px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Розклад</button>
            </div>
          ))}
        </div>
      )}

      {/* New appointment */}
      {view === 'new' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '2rem', maxWidth: 540 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: '1.5rem' }}>Новий запис</h2>
          {success && <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>✓ Запис успішно створено!</div>}
          <form onSubmit={handleBook}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: "Ім'я гостя", name: 'guestName', type: 'text', placeholder: "Ім'я" },
                { label: 'Телефон', name: 'phone', type: 'tel', placeholder: '+380...' },
                { label: 'Дата', name: 'date', type: 'date', placeholder: '' },
                { label: 'Час', name: 'time', type: 'time', placeholder: '' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} required value={newAppt[f.name as keyof typeof newAppt]} onChange={e => setNewAppt(p => ({ ...p, [f.name]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Послуга</label>
              <select required value={newAppt.serviceId} onChange={e => setNewAppt(p => ({ ...p, serviceId: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }}>
                <option value="">Оберіть послугу</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.duration} хв) — ₴{s.price}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Майстер</label>
              <select required value={newAppt.masterId} onChange={e => setNewAppt(p => ({ ...p, masterId: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }}>
                <option value="">Оберіть майстра</option>
                {masters.map(m => <option key={m.id} value={m.id}>{m.name} ⭐{m.rating}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Записати</button>
              <button type="button" onClick={() => setView('schedule')} style={{ padding: '12px 20px', background: '#f5f5f7', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Скасувати</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

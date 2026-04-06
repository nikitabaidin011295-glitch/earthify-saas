'use client'
import { useState } from 'react'

const tables = [
  { id: 1, number: 1, zone: 'Зал А', capacity: 2, status: 'free' },
  { id: 2, number: 2, zone: 'Зал А', capacity: 4, status: 'occupied', guest: 'Іван Коваль', since: '19:00', order: 1240 },
  { id: 3, number: 3, zone: 'Зал А', capacity: 4, status: 'reserved', guest: 'Марія Петренко', time: '20:00' },
  { id: 4, number: 4, zone: 'Зал А', capacity: 6, status: 'occupied', guest: 'Сімейне бронювання', since: '18:30', order: 3200 },
  { id: 5, number: 5, zone: 'Зал Б', capacity: 2, status: 'free' },
  { id: 6, number: 6, zone: 'Зал Б', capacity: 2, status: 'free' },
  { id: 7, number: 7, zone: 'Зал Б', capacity: 4, status: 'occupied', guest: 'Корпоратив', since: '18:00', order: 5600 },
  { id: 8, number: 8, zone: 'Тераса', capacity: 4, status: 'free' },
  { id: 9, number: 9, zone: 'Тераса', capacity: 6, status: 'reserved', guest: 'Дмитро Бондар', time: '19:30' },
  { id: 10, number: 10, zone: 'Тераса', capacity: 8, status: 'free' },
]

const menu = [
  { id: 1, name: 'Борщ український', category: 'Перші страви', price: 180, available: true },
  { id: 2, name: 'Курячий суп', category: 'Перші страви', price: 150, available: true },
  { id: 3, name: 'Стейк Рібай', category: 'Основні страви', price: 680, available: true },
  { id: 4, name: 'Лосось на грилі', category: 'Основні страви', price: 520, available: true },
  { id: 5, name: 'Паста Карбонара', category: 'Основні страви', price: 320, available: true },
  { id: 6, name: 'Вареники з картоплею', category: 'Основні страви', price: 220, available: false },
  { id: 7, name: 'Тірамісу', category: 'Десерти', price: 180, available: true },
  { id: 8, name: 'Шоколадний фондан', category: 'Десерти', price: 200, available: true },
  { id: 9, name: 'Вино червоне (бокал)', category: 'Напої', price: 160, available: true },
  { id: 10, name: 'Пиво крафтове', category: 'Напої', price: 120, available: true },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  free:     { label: 'Вільний',        color: '#0F6E56', bg: '#E1F5EE' },
  occupied: { label: 'Зайнятий',       color: '#A32D2D', bg: '#FCEBEB' },
  reserved: { label: 'Заброньований',  color: '#854F0B', bg: '#FAEEDA' },
}

export default function RestaurantPage() {
  const [view, setView] = useState<'tables' | 'menu' | 'orders' | 'new'>('tables')
  const [form, setForm] = useState({ guestName: '', phone: '', date: '', time: '', guests: '2', tableId: '', notes: '' })
  const [success, setSuccess] = useState(false)

  const freeTables = tables.filter(t => t.status === 'free')
  const totalRevenue = tables.filter(t => t.status === 'occupied' && t.order).reduce((s, t) => s + (t.order || 0), 0)
  const categories = [...new Set(menu.map(m => m.category))]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setView('tables') }, 2000)
  }

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>🍽️ Ресторан</h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Столики, меню, бронювання</p>
        </div>
        <button onClick={() => setView('new')} style={{ background: '#D85A30', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Забронювати столик
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: '1.5rem' }}>
        {[
          { label: 'Столиків всього', value: tables.length, color: '#D85A30' },
          { label: 'Зайнятих', value: tables.filter(t => t.status === 'occupied').length, color: '#A32D2D' },
          { label: 'Вільних', value: freeTables.length, color: '#0F6E56' },
          { label: 'Виторг зараз', value: `₴${totalRevenue.toLocaleString()}`, color: '#534AB7' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '1rem' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: '#f5f5f7', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ id: 'tables', label: 'Зал' }, { id: 'menu', label: 'Меню' }, { id: 'orders', label: 'Замовлення' }, { id: 'new', label: '+ Бронювати' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id as typeof view)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: view === t.id ? '#fff' : 'transparent',
            color: view === t.id ? '#D85A30' : '#888',
            boxShadow: view === t.id ? '0 1px 4px #0001' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {view === 'tables' && (
        <>
          {['Зал А', 'Зал Б', 'Тераса'].map(zone => (
            <div key={zone} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{zone}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {tables.filter(t => t.zone === zone).map(t => (
                  <div key={t.id} style={{ background: '#fff', border: `1.5px solid ${t.status === 'occupied' ? '#FCEBEB' : t.status === 'free' ? '#E1F5EE' : '#FAEEDA'}`, borderRadius: 12, padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>Стіл {t.number}</div>
                      <span style={{ background: statusMap[t.status].bg, color: statusMap[t.status].color, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{statusMap[t.status].label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>👥 {t.capacity} місця</div>
                    {t.guest && <div style={{ fontSize: 12, fontWeight: 500, color: '#111', marginBottom: 4 }}>{t.guest}</div>}
                    {t.since && <div style={{ fontSize: 11, color: '#888' }}>З {t.since} · ₴{t.order}</div>}
                    {t.time && <div style={{ fontSize: 11, color: '#854F0B' }}>Бронь о {t.time}</div>}
                    {t.status === 'free' && <button onClick={() => setView('new')} style={{ width: '100%', marginTop: 8, padding: '6px', background: '#D85A30', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Забронювати</button>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {view === 'menu' && (
        <>
          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#D85A30', marginBottom: 10, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>{cat}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                {menu.filter(m => m.category === cat).map(item => (
                  <div key={item.id} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 10, padding: '1rem', opacity: item.available ? 1 : 0.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontWeight: 700, color: '#D85A30' }}>₴{item.price}</div>
                    </div>
                    {!item.available && <div style={{ fontSize: 11, color: '#A32D2D', marginTop: 4 }}>Недоступно</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {view === 'orders' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Стіл', 'Гість', 'З', 'Зона', 'Замовлення', 'Сума'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tables.filter(t => t.status === 'occupied').map((t, i) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#D85A30' }}>Стіл {t.number}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>{t.guest}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{t.since}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{t.zone}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Переглянути</button>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F6E56' }}>₴{t.order?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'new' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '2rem', maxWidth: 540 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: '1.5rem' }}>Бронювання столика</h2>
          {success && <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>✓ Столик заброньовано!</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: "Ім'я гостя", name: 'guestName', type: 'text' },
                { label: 'Телефон', name: 'phone', type: 'tel' },
                { label: 'Дата', name: 'date', type: 'date' },
                { label: 'Час', name: 'time', type: 'time' },
                { label: 'Кількість гостей', name: 'guests', type: 'number' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                  <input type={f.type} required value={form[f.name as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Столик</label>
              <select required value={form.tableId} onChange={e => setForm(p => ({ ...p, tableId: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }}>
                <option value="">Оберіть столик</option>
                {freeTables.map(t => <option key={t.id} value={t.id}>Стіл {t.number} ({t.zone}, {t.capacity} місця)</option>)}
              </select>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Побажання</label>
              <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Алергени, особливі побажання..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#D85A30', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Забронювати</button>
              <button type="button" onClick={() => setView('tables')} style={{ padding: '12px 20px', background: '#f5f5f7', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Скасувати</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

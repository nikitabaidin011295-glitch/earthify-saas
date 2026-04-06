'use client'
import { useState } from 'react'

const guests = [
  { id: 1, name: 'Олексій Коваль', phone: '+380671234567', email: 'kowal@gmail.com', visits: 12, spent: 18400, points: 920, lastVisit: '05.04.2026', tags: ['VIP'] },
  { id: 2, name: 'Марія Петренко', phone: '+380672345678', email: 'petrenko@gmail.com', visits: 8, spent: 9600, points: 480, lastVisit: '04.04.2026', tags: [] },
  { id: 3, name: 'Іван Сидоренко', phone: '+380673456789', email: 'ivan@gmail.com', visits: 3, spent: 4200, points: 210, lastVisit: '03.04.2026', tags: [] },
  { id: 4, name: 'Анна Мельник', phone: '+380674567890', email: 'anna@gmail.com', visits: 25, spent: 42000, points: 2100, lastVisit: '05.04.2026', tags: ['VIP', 'Regular'] },
  { id: 5, name: 'Дмитро Бондар', phone: '+380675678901', email: 'dmytro@gmail.com', visits: 6, spent: 7800, points: 390, lastVisit: '02.04.2026', tags: [] },
]

export default function GuestsPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof guests[0] | null>(null)

  const filtered = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search) ||
    g.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>👥 Гості</h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Єдиний профіль по всіх сервісах</p>
        </div>
        <button style={{ background: '#534AB7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Новий гість
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: '1.5rem' }}>
        {[
          { label: 'Всього гостей', value: guests.length, color: '#534AB7' },
          { label: 'VIP гостей', value: guests.filter(g => g.tags.includes('VIP')).length, color: '#D85A30' },
          { label: 'Середній чек', value: `₴${Math.round(guests.reduce((s, g) => s + g.spent, 0) / guests.reduce((s, g) => s + g.visits, 0))}`, color: '#0F6E56' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '1rem' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <input placeholder="Пошук за ім'ям, телефоном або email..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e5e5', borderRadius: 10, fontSize: 14, marginBottom: '1rem', background: '#fff' }} />

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {["Ім'я", 'Телефон', 'Візитів', 'Витрачено', 'Бали', 'Останній візит', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr key={g.id} onClick={() => setSelected(g)} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f5f5f5' : 'none', cursor: 'pointer', background: selected?.id === g.id ? '#fafafa' : 'transparent' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EEEDFE', color: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {g.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{g.name}</div>
                        <div style={{ fontSize: 11, color: '#aaa' }}>{g.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{g.phone}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#534AB7' }}>{g.visits}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>₴{g.spent.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#F59E0B', fontWeight: 600 }}>⭐ {g.points}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{g.lastVisit}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {g.tags.map(tag => <span key={tag} style={{ background: '#EEEDFE', color: '#3C3489', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, marginRight: 4 }}>{tag}</span>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.5rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EEEDFE', color: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
                  {selected.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{selected.email}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1rem' }}>
              {[
                { label: 'Телефон', value: selected.phone },
                { label: 'Візитів', value: selected.visits },
                { label: 'Витрачено', value: `₴${selected.spent.toLocaleString()}` },
                { label: 'Бали лояльності', value: `⭐ ${selected.points}` },
              ].map(item => (
                <div key={item.label} style={{ background: '#fafafa', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, padding: '8px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Записати</button>
              <button style={{ flex: 1, padding: '8px', background: '#f5f5f7', color: '#666', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Редагувати</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

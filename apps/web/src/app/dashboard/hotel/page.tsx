'use client'
import { useState } from 'react'

const rooms = [
  { id: 1, number: '101', type: 'Стандарт', floor: 1, capacity: 2, price: 1200, status: 'occupied', guest: 'Олексій Коваль', checkIn: '04.04', checkOut: '07.04' },
  { id: 2, number: '102', type: 'Стандарт', floor: 1, capacity: 2, price: 1200, status: 'free', guest: null, checkIn: null, checkOut: null },
  { id: 3, number: '103', type: 'Стандарт', floor: 1, capacity: 2, price: 1200, status: 'cleaning', guest: null, checkIn: null, checkOut: null },
  { id: 4, number: '201', type: 'Делюкс', floor: 2, capacity: 2, price: 2400, status: 'occupied', guest: 'Марія Петренко', checkIn: '05.04', checkOut: '08.04' },
  { id: 5, number: '202', type: 'Делюкс', floor: 2, capacity: 2, price: 2400, status: 'free', guest: null, checkIn: null, checkOut: null },
  { id: 6, number: '203', type: 'Делюкс', floor: 2, capacity: 2, price: 2400, status: 'reserved', guest: 'Іван Сидоренко', checkIn: '06.04', checkOut: '09.04' },
  { id: 7, number: '301', type: 'Люкс', floor: 3, capacity: 4, price: 4800, status: 'occupied', guest: 'Анна Мельник', checkIn: '03.04', checkOut: '10.04' },
  { id: 8, number: '302', type: 'Люкс', floor: 3, capacity: 4, price: 4800, status: 'free', guest: null, checkIn: null, checkOut: null },
  { id: 9, number: '401', type: 'Президентський', floor: 4, capacity: 6, price: 9600, status: 'free', guest: null, checkIn: null, checkOut: null },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  free:     { label: 'Вільний',    color: '#0F6E56', bg: '#E1F5EE' },
  occupied: { label: 'Зайнятий',   color: '#A32D2D', bg: '#FCEBEB' },
  reserved: { label: 'Заброньований', color: '#854F0B', bg: '#FAEEDA' },
  cleaning: { label: 'Прибирання', color: '#185FA5', bg: '#E6F1FB' },
}

export default function HotelPage() {
  const [view, setView] = useState<'rooms' | 'bookings' | 'new'>('rooms')
  const [filterStatus, setFilterStatus] = useState('all')
  const [newBooking, setNewBooking] = useState({ guestName: '', phone: '', email: '', roomId: '', checkIn: '', checkOut: '', adults: '1', children: '0', notes: '' })
  const [success, setSuccess] = useState(false)

  const filtered = filterStatus === 'all' ? rooms : rooms.filter(r => r.status === filterStatus)
  const freeRooms = rooms.filter(r => r.status === 'free')
  const occupiedRooms = rooms.filter(r => r.status === 'occupied')
  const occupancy = Math.round((occupiedRooms.length / rooms.length) * 100)

  function handleBook(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setView('rooms') }, 2000)
  }

  return (
    <div style={{ padding: '2rem 2.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>🏨 Готель / PMS</h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Управління номерами та бронюваннями</p>
        </div>
        <button onClick={() => setView('new')} style={{ background: '#534AB7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Нове бронювання
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: '1.5rem' }}>
        {[
          { label: 'Всього номерів', value: rooms.length, color: '#534AB7' },
          { label: 'Зайнятих', value: occupiedRooms.length, color: '#A32D2D' },
          { label: 'Вільних', value: freeRooms.length, color: '#0F6E56' },
          { label: 'Завантаженість', value: `${occupancy}%`, color: '#854F0B' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '1rem' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: '#f5f5f7', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ id: 'rooms', label: 'Номери' }, { id: 'bookings', label: 'Бронювання' }, { id: 'new', label: '+ Забронювати' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id as typeof view)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: view === t.id ? '#fff' : 'transparent',
            color: view === t.id ? '#534AB7' : '#888',
            boxShadow: view === t.id ? '0 1px 4px #0001' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Rooms grid */}
      {view === 'rooms' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
            {['all', 'free', 'occupied', 'reserved', 'cleaning'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '6px 14px', borderRadius: 20, border: '1px solid', fontSize: 12, cursor: 'pointer',
                background: filterStatus === s ? '#534AB7' : '#fff',
                color: filterStatus === s ? '#fff' : '#666',
                borderColor: filterStatus === s ? '#534AB7' : '#ddd',
              }}>
                {s === 'all' ? 'Всі' : statusMap[s].label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {filtered.map(room => (
              <div key={room.id} style={{ background: '#fff', border: `1.5px solid ${room.status === 'occupied' ? '#FCEBEB' : room.status === 'free' ? '#E1F5EE' : '#f0f0f0'}`, borderRadius: 14, padding: '1.25rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>№{room.number}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{room.type} · {room.floor} поверх</div>
                  </div>
                  <span style={{ background: statusMap[room.status].bg, color: statusMap[room.status].color, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20 }}>
                    {statusMap[room.status].label}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>👥 {room.capacity} гості · ₴{room.price}/ніч</div>
                {room.guest && (
                  <div style={{ background: '#fafafa', borderRadius: 8, padding: '8px 10px', fontSize: 12 }}>
                    <div style={{ fontWeight: 600, color: '#111' }}>{room.guest}</div>
                    <div style={{ color: '#888' }}>{room.checkIn} → {room.checkOut}</div>
                  </div>
                )}
                {room.status === 'free' && (
                  <button onClick={() => setView('new')} style={{ width: '100%', marginTop: 10, padding: '8px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Забронювати
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Bookings list */}
      {view === 'bookings' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Номер', 'Гість', 'Заїзд', 'Виїзд', 'Ночей', 'Статус', 'Сума', 'Дії'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.filter(r => r.guest).map((r, i) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#534AB7' }}>№{r.number}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>{r.guest}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{r.checkIn}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{r.checkOut}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>3</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: statusMap[r.status].bg, color: statusMap[r.status].color, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20 }}>
                      {statusMap[r.status].label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>₴{(r.price * 3).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: '#666' }}>Деталі</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New booking form */}
      {view === 'new' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '2rem', maxWidth: 600 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: '1.5rem' }}>Нове бронювання</h2>
          {success && <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>✓ Бронювання успішно створено!</div>}
          <form onSubmit={handleBook}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: "Ім'я гостя", name: 'guestName', type: 'text', placeholder: 'Олексій Коваль' },
                { label: 'Телефон', name: 'phone', type: 'tel', placeholder: '+380...' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'email@example.com' },
                { label: 'Дата заїзду', name: 'checkIn', type: 'date', placeholder: '' },
                { label: 'Дата виїзду', name: 'checkOut', type: 'date', placeholder: '' },
                { label: 'Дорослих', name: 'adults', type: 'number', placeholder: '1' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} required
                    value={newBooking[f.name as keyof typeof newBooking]}
                    onChange={e => setNewBooking(p => ({ ...p, [f.name]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Номер</label>
              <select required value={newBooking.roomId} onChange={e => setNewBooking(p => ({ ...p, roomId: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }}>
                <option value="">Оберіть номер</option>
                {freeRooms.map(r => <option key={r.id} value={r.id}>№{r.number} — {r.type} (₴{r.price}/ніч)</option>)}
              </select>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Нотатки</label>
              <textarea placeholder="Побажання гостя..." rows={3} value={newBooking.notes} onChange={e => setNewBooking(p => ({ ...p, notes: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa', resize: 'vertical' }}/>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Забронювати
              </button>
              <button type="button" onClick={() => setView('rooms')} style={{ padding: '12px 20px', background: '#f5f5f7', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>
                Скасувати
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

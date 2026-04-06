'use client'
import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────
interface Room {
  id: string
  name: string
  type: string
  capacity: number
  price: number
  floor: number
}

interface Booking {
  id: string
  roomId: string
  guestName: string
  start: string
  end: string
  guests: number
  status: 'new' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  total: number
  paid: number
  phone?: string
  notes?: string
  source?: string
}

// ─── Data ─────────────────────────────────────────────────────
const ROOMS: Room[] = [
  { id: 'r1', name: '101', type: 'Стандарт', capacity: 2, price: 1200, floor: 1 },
  { id: 'r2', name: '102', type: 'Стандарт', capacity: 2, price: 1200, floor: 1 },
  { id: 'r3', name: '103', type: 'Стандарт', capacity: 2, price: 1200, floor: 1 },
  { id: 'r4', name: '201', type: 'Делюкс', capacity: 2, price: 2400, floor: 2 },
  { id: 'r5', name: '202', type: 'Делюкс', capacity: 2, price: 2400, floor: 2 },
  { id: 'r6', name: '203', type: 'Делюкс', capacity: 3, price: 2800, floor: 2 },
  { id: 'r7', name: '301', type: 'Люкс', capacity: 4, price: 4800, floor: 3 },
  { id: 'r8', name: '302', type: 'Люкс', capacity: 4, price: 4800, floor: 3 },
  { id: 'r9', name: '401', type: 'Президент', capacity: 6, price: 9600, floor: 4 },
]

const today = new Date()
const fmt = (d: Date) => d.toISOString().slice(0, 10)
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }

const BOOKINGS: Booking[] = [
  { id: 'b1', roomId: 'r1', guestName: 'Олексій Коваль', start: fmt(addDays(today, -2)), end: fmt(addDays(today, 3)), guests: 2, status: 'checked_in', total: 6000, paid: 3000, phone: '+380671234567', source: 'direct' },
  { id: 'b2', roomId: 'r2', guestName: 'Марія Петренко', start: fmt(addDays(today, 1)), end: fmt(addDays(today, 5)), guests: 2, status: 'confirmed', total: 4800, paid: 4800, phone: '+380672345678', source: 'booking' },
  { id: 'b3', roomId: 'r4', guestName: 'Іван Сидоренко', start: fmt(addDays(today, -1)), end: fmt(addDays(today, 2)), guests: 2, status: 'checked_in', total: 7200, paid: 7200, phone: '+380673456789', source: 'direct' },
  { id: 'b4', roomId: 'r7', guestName: 'Анна Мельник', start: fmt(addDays(today, -3)), end: fmt(addDays(today, 4)), guests: 3, status: 'checked_in', total: 33600, paid: 20000, phone: '+380674567890', source: 'airbnb' },
  { id: 'b5', roomId: 'r5', guestName: 'Дмитро Бондар', start: fmt(addDays(today, 3)), end: fmt(addDays(today, 7)), guests: 2, status: 'confirmed', total: 9600, paid: 0, source: 'direct' },
  { id: 'b6', roomId: 'r3', guestName: 'Олена Лисенко', start: fmt(addDays(today, 2)), end: fmt(addDays(today, 6)), guests: 1, status: 'new', total: 4800, paid: 0, source: 'booking' },
  { id: 'b7', roomId: 'r6', guestName: 'Сімейний відпочинок', start: fmt(addDays(today, -1)), end: fmt(addDays(today, 5)), guests: 3, status: 'checked_in', total: 16800, paid: 16800, source: 'direct' },
]

// ─── Helpers ──────────────────────────────────────────────────
const DAYS_UA = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const MONTHS_UA = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень']

const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6',
  confirmed: '#8b5cf6',
  checked_in: '#10b981',
  checked_out: '#6b7280',
  cancelled: '#ef4444',
}
const STATUS_LABELS: Record<string, string> = {
  new: 'Новий',
  confirmed: 'Підтверджено',
  checked_in: 'Заселений',
  checked_out: 'Виїхав',
  cancelled: 'Скасовано',
}
const SOURCE_LABELS: Record<string, string> = {
  direct: 'Прямий',
  booking: 'Booking.com',
  airbnb: 'Airbnb',
  expedia: 'Expedia',
}

export default function HotelCalendarPage() {
  const [anchor, setAnchor] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d })
  const [viewDays, setViewDays] = useState(14)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newBooking, setNewBooking] = useState({ guestName: '', phone: '', roomId: '', start: '', end: '', guests: '2', notes: '' })
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS)
  const [success, setSuccess] = useState(false)
  const [filterType, setFilterType] = useState('all')

  // Generate date columns
  const days = useMemo(() => {
    const result = []
    for (let i = 0; i < viewDays; i++) {
      const d = addDays(anchor, i)
      result.push({ key: fmt(d), date: d, label: String(d.getDate()), dow: DAYS_UA[d.getDay()], isToday: fmt(d) === fmt(new Date()), isWeekend: d.getDay() === 0 || d.getDay() === 6 })
    }
    return result
  }, [anchor, viewDays])

  const filteredRooms = filterType === 'all' ? ROOMS : ROOMS.filter(r => r.type === filterType)
  const roomTypes = [...new Set(ROOMS.map(r => r.type))]

  // Get booking segment for a room on a given date
  function getBookingSegment(roomId: string, dateKey: string) {
    return bookings.find(b => b.roomId === roomId && b.start <= dateKey && b.end > dateKey)
  }

  // Get booking width in days (capped to visible range)
  function getBookingWidth(b: Booking, startKey: string) {
    const endKey = fmt(addDays(anchor, viewDays))
    const effectiveEnd = b.end < endKey ? b.end : endKey
    const effectiveStart = b.start > startKey ? b.start : startKey
    let width = 0
    let cur = new Date(effectiveStart)
    while (fmt(cur) < effectiveEnd) { width++; cur = addDays(cur, 1) }
    return width
  }

  function isFirstDay(b: Booking, dateKey: string) {
    return b.start === dateKey || (b.start < days[0].key && dateKey === days[0].key)
  }

  function submitNewBooking(e: React.FormEvent) {
    e.preventDefault()
    const room = ROOMS.find(r => r.id === newBooking.roomId)
    if (!room) return
    const nights = Math.max(1, Math.round((new Date(newBooking.end).getTime() - new Date(newBooking.start).getTime()) / 86400000))
    const total = nights * room.price
    const nb: Booking = {
      id: `b${Date.now()}`,
      roomId: newBooking.roomId,
      guestName: newBooking.guestName,
      phone: newBooking.phone,
      start: newBooking.start,
      end: newBooking.end,
      guests: parseInt(newBooking.guests),
      status: 'new',
      total,
      paid: 0,
      notes: newBooking.notes,
      source: 'direct',
    }
    setBookings(prev => [...prev, nb])
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setShowNewForm(false); setNewBooking({ guestName: '', phone: '', roomId: '', start: '', end: '', guests: '2', notes: '' }) }, 1500)
  }

  const freeRooms = ROOMS.filter(r => !bookings.some(b => b.roomId === r.id && b.start <= fmt(today) && b.end > fmt(today) && b.status !== 'cancelled'))
  const occupiedRooms = ROOMS.filter(r => bookings.some(b => b.roomId === r.id && b.start <= fmt(today) && b.end > fmt(today) && ['checked_in', 'confirmed'].includes(b.status)))

  return (
    <div style={{ padding: '1.5rem 2rem', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111', margin: 0 }}>🏨 Готель — Календар</h1>
          <p style={{ color: '#888', fontSize: 13, margin: '2px 0 0' }}>{MONTHS_UA[anchor.getMonth()]} {anchor.getFullYear()}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', gap: 2, background: '#f5f5f7', padding: 3, borderRadius: 8 }}>
            {[{ d: 7, l: '7 днів' }, { d: 14, l: '14 днів' }, { d: 30, l: 'Місяць' }].map(v => (
              <button key={v.d} onClick={() => setViewDays(v.d)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: viewDays === v.d ? '#fff' : 'transparent', color: viewDays === v.d ? '#534AB7' : '#888', boxShadow: viewDays === v.d ? '0 1px 3px #0001' : 'none' }}>{v.l}</button>
            ))}
          </div>
          {/* Navigation */}
          <button onClick={() => setAnchor(addDays(anchor, -viewDays))} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 14 }}>←</button>
          <button onClick={() => setAnchor(new Date())} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #534AB7', background: '#EEEDFE', color: '#534AB7', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Сьогодні</button>
          <button onClick={() => setAnchor(addDays(anchor, viewDays))} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 14 }}>→</button>
          <button onClick={() => setShowNewForm(true)} style={{ padding: '8px 16px', borderRadius: 8, background: '#534AB7', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>+ Бронювання</button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1rem' }}>
        {[
          { label: 'Вільних', value: freeRooms.length, color: '#0F6E56', bg: '#E1F5EE' },
          { label: 'Зайнятих', value: occupiedRooms.length, color: '#A32D2D', bg: '#FCEBEB' },
          { label: 'Завантаженість', value: `${Math.round(occupiedRooms.length / ROOMS.length * 100)}%`, color: '#534AB7', bg: '#EEEDFE' },
          { label: 'Заїздів сьогодні', value: bookings.filter(b => b.start === fmt(today)).length, color: '#185FA5', bg: '#E6F1FB' },
          { label: 'Виїздів сьогодні', value: bookings.filter(b => b.end === fmt(today)).length, color: '#854F0B', bg: '#FAEEDA' },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 12, color: s.color, fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}

        {/* Room type filter */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['all', ...roomTypes].map(t => (
            <button key={t} onClick={() => setFilterType(t)} style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid', fontSize: 12, cursor: 'pointer', background: filterType === t ? '#534AB7' : '#fff', color: filterType === t ? '#fff' : '#666', borderColor: filterType === t ? '#534AB7' : '#ddd' }}>
              {t === 'all' ? 'Всі' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
        {/* Header row - dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(' + viewDays + ', 1fr)', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ padding: '10px 12px', fontSize: 11, color: '#aaa', fontWeight: 600, background: '#fafafa', borderRight: '1px solid #f0f0f0' }}>Номер</div>
          {days.map(d => (
            <div key={d.key} style={{ padding: '8px 4px', textAlign: 'center', background: d.isToday ? '#EEEDFE' : d.isWeekend ? '#fafafa' : '#fff', borderRight: '1px solid #f0f0f0', borderBottom: d.isToday ? '2px solid #534AB7' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: d.isToday ? 700 : 500, color: d.isToday ? '#534AB7' : '#111' }}>{d.label}</div>
              <div style={{ fontSize: 10, color: d.isWeekend ? '#D85A30' : '#aaa' }}>{d.dow}</div>
            </div>
          ))}
        </div>

        {/* Room rows */}
        {filteredRooms.map(room => (
          <div key={room.id} style={{ display: 'grid', gridTemplateColumns: '120px repeat(' + viewDays + ', 1fr)', borderBottom: '1px solid #f5f5f5', minHeight: 52 }}>
            {/* Room label */}
            <div style={{ padding: '8px 12px', borderRight: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>№{room.name}</div>
              <div style={{ fontSize: 10, color: '#aaa' }}>{room.type}</div>
            </div>

            {/* Day cells */}
            {days.map(d => {
              const booking = getBookingSegment(room.id, d.key)
              const isFirst = booking && isFirstDay(booking, d.key)
              const width = booking && isFirst ? getBookingWidth(booking, d.key) : 0

              return (
                <div key={d.key} style={{ borderRight: '1px solid #f0f0f0', position: 'relative', background: d.isToday ? '#faf9ff' : d.isWeekend ? '#fefefe' : 'transparent', minHeight: 52 }}>
                  {booking && isFirst && (
                    <div
                      onClick={() => setSelectedBooking(booking)}
                      style={{
                        position: 'absolute', top: 6, left: 2, zIndex: 2,
                        width: `calc(${width * 100}% - 4px)`,
                        background: STATUS_COLORS[booking.status],
                        borderRadius: 6, padding: '4px 8px',
                        cursor: 'pointer', overflow: 'hidden',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                        minHeight: 40,
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{booking.guestName}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>
                        {booking.guests}👤 · ₴{booking.total.toLocaleString()}
                        {booking.paid < booking.total && <span style={{ color: '#fde68a' }}> ⚠️</span>}
                      </div>
                    </div>
                  )}
                  {!booking && (
                    <div onClick={() => { setNewBooking(p => ({ ...p, roomId: room.id, start: d.key })); setShowNewForm(true) }}
                      style={{ position: 'absolute', inset: 0, cursor: 'pointer', opacity: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                    >
                      <div style={{ margin: '10px 4px', background: '#EEEDFE', borderRadius: 6, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 18, color: '#534AB7' }}>+</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: '1rem', flexWrap: 'wrap' }}>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: STATUS_COLORS[key] }} />
            <span style={{ fontSize: 12, color: '#666' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Booking detail modal */}
      {selectedBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedBooking(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: 480, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{selectedBooking.guestName}</h2>
                <span style={{ display: 'inline-block', marginTop: 6, background: STATUS_COLORS[selectedBooking.status] + '20', color: STATUS_COLORS[selectedBooking.status], fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  {STATUS_LABELS[selectedBooking.status]}
                </span>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#aaa' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.25rem' }}>
              {[
                { label: 'Номер', value: `№${ROOMS.find(r => r.id === selectedBooking.roomId)?.name} (${ROOMS.find(r => r.id === selectedBooking.roomId)?.type})` },
                { label: 'Гостей', value: selectedBooking.guests },
                { label: 'Заїзд', value: new Date(selectedBooking.start).toLocaleDateString('uk-UA') },
                { label: 'Виїзд', value: new Date(selectedBooking.end).toLocaleDateString('uk-UA') },
                { label: 'Сума', value: `₴${selectedBooking.total.toLocaleString()}` },
                { label: 'Оплачено', value: `₴${selectedBooking.paid.toLocaleString()}` },
                { label: 'Борг', value: selectedBooking.total - selectedBooking.paid > 0 ? `₴${(selectedBooking.total - selectedBooking.paid).toLocaleString()}` : '—' },
                { label: 'Джерело', value: SOURCE_LABELS[selectedBooking.source || 'direct'] || selectedBooking.source },
              ].map(item => (
                <div key={item.label} style={{ background: '#fafafa', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>
            {selectedBooking.phone && (
              <div style={{ background: '#f0f9ff', borderRadius: 8, padding: '10px 12px', marginBottom: '1rem', fontSize: 13 }}>
                📞 {selectedBooking.phone}
              </div>
            )}
            {selectedBooking.total - selectedBooking.paid > 0 && (
              <div style={{ background: '#FAEEDA', borderRadius: 8, padding: '10px 12px', marginBottom: '1rem', fontSize: 13, color: '#854F0B', fontWeight: 600 }}>
                ⚠️ Борг: ₴{(selectedBooking.total - selectedBooking.paid).toLocaleString()}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              {selectedBooking.status === 'confirmed' && (
                <button onClick={() => { setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, status: 'checked_in' } : b)); setSelectedBooking(null) }}
                  style={{ flex: 1, padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  ✓ Заселити
                </button>
              )}
              {selectedBooking.status === 'checked_in' && (
                <button onClick={() => { setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, status: 'checked_out' } : b)); setSelectedBooking(null) }}
                  style={{ flex: 1, padding: '10px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Виселити
                </button>
              )}
              <button onClick={() => { setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, paid: b.total } : b)); setSelectedBooking(null) }}
                style={{ flex: 1, padding: '10px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Прийняти оплату
              </button>
              <button onClick={() => setSelectedBooking(null)} style={{ padding: '10px 16px', background: '#f5f5f7', color: '#666', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New booking modal */}
      {showNewForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowNewForm(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: 480, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: '1.25rem' }}>Нове бронювання</h2>
            {success && <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontWeight: 600 }}>✓ Бронювання створено!</div>}
            <form onSubmit={submitNewBooking}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: "Ім'я гостя", name: 'guestName', type: 'text' },
                  { label: 'Телефон', name: 'phone', type: 'tel' },
                  { label: 'Заїзд', name: 'start', type: 'date' },
                  { label: 'Виїзд', name: 'end', type: 'date' },
                  { label: 'Гостей', name: 'guests', type: 'number' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 5, fontWeight: 500 }}>{f.label}</label>
                    <input type={f.type} required value={newBooking[f.name as keyof typeof newBooking]} onChange={e => setNewBooking(p => ({ ...p, [f.name]: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 5, fontWeight: 500 }}>Номер</label>
                  <select required value={newBooking.roomId} onChange={e => setNewBooking(p => ({ ...p, roomId: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }}>
                    <option value="">Оберіть...</option>
                    {ROOMS.map(r => <option key={r.id} value={r.id}>№{r.name} — {r.type} (₴{r.price}/ніч)</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 5, fontWeight: 500 }}>Нотатки</label>
                <textarea rows={2} value={newBooking.notes} onChange={e => setNewBooking(p => ({ ...p, notes: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" style={{ flex: 1, padding: '11px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Забронювати</button>
                <button type="button" onClick={() => setShowNewForm(false)} style={{ padding: '11px 18px', background: '#f5f5f7', color: '#666', border: 'none', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>Скасувати</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

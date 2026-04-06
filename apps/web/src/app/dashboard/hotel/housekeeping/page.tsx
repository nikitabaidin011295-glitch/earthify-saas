'use client'
import { useState, useMemo } from 'react'

type CleanType = 'departure' | 'arrival' | 'departure_arrival' | 'stayover'

interface ReportRow {
  roomId: string
  roomName: string
  roomType: string
  cleanType: CleanType
  guests: number
  checkoutTime: string
  checkinTime: string
  guestOut: string
  guestIn: string
  note: string
}

const CLEAN_LABELS: Record<CleanType, string> = {
  departure: 'Виїзне',
  arrival: 'Підготовка',
  departure_arrival: 'Виїзд + Заїзд',
  stayover: 'Поточне',
}
const CLEAN_COLORS: Record<CleanType, string> = {
  departure: '#e67e22',
  arrival: '#2980b9',
  departure_arrival: '#8e44ad',
  stayover: '#27ae60',
}
const CLEAN_PRIORITY: Record<CleanType, number> = {
  departure_arrival: 0, departure: 1, arrival: 2, stayover: 3,
}

// Mock data for today
const TODAY_REPORT: ReportRow[] = [
  { roomId: 'r1', roomName: '101', roomType: 'Стандарт', cleanType: 'departure_arrival', guests: 4, checkoutTime: '12:00', checkinTime: '14:00', guestOut: 'Олексій Коваль', guestIn: 'Марія Петренко', note: 'Алергія на пух' },
  { roomId: 'r2', roomName: '102', roomType: 'Стандарт', cleanType: 'departure', guests: 2, checkoutTime: '11:00', checkinTime: '—', guestOut: 'Іван Сидоренко', guestIn: '—', note: '' },
  { roomId: 'r3', roomName: '103', roomType: 'Стандарт', cleanType: 'arrival', guests: 1, checkoutTime: '—', checkinTime: '15:00', guestOut: '—', guestIn: 'Олена Лисенко', note: 'Пізній заїзд' },
  { roomId: 'r4', roomName: '201', roomType: 'Делюкс', cleanType: 'stayover', guests: 2, checkoutTime: '—', checkinTime: '—', guestOut: '—', guestIn: 'Анна Мельник', note: '' },
  { roomId: 'r5', roomName: '202', roomType: 'Делюкс', cleanType: 'stayover', guests: 2, checkoutTime: '—', checkinTime: '—', guestOut: '—', guestIn: 'Дмитро Бондар', note: 'Не турбувати до 12:00' },
  { roomId: 'r6', roomName: '203', roomType: 'Делюкс', cleanType: 'departure_arrival', guests: 5, checkoutTime: '10:00', checkinTime: '13:00', guestOut: 'Сімейний відпочинок', guestIn: 'Корпоратив', note: '' },
  { roomId: 'r7', roomName: '301', roomType: 'Люкс', cleanType: 'stayover', guests: 3, checkoutTime: '—', checkinTime: '—', guestOut: '—', guestIn: 'VIP гість', note: 'VIP — квіти + фрукти' },
]

export default function HousekeepingPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [doneSet, setDoneSet] = useState<Set<string>>(new Set())
  const [filterType, setFilterType] = useState<CleanType | 'all'>('all')

  const report = useMemo(() =>
    TODAY_REPORT.sort((a, b) => {
      if (CLEAN_PRIORITY[a.cleanType] !== CLEAN_PRIORITY[b.cleanType])
        return CLEAN_PRIORITY[a.cleanType] - CLEAN_PRIORITY[b.cleanType]
      return a.roomName.localeCompare(b.roomName)
    }), [date])

  const filtered = filterType === 'all' ? report : report.filter(r => r.cleanType === filterType)
  const doneCount = report.filter(r => doneSet.has(r.roomId)).length

  const counts = {
    departure_arrival: report.filter(r => r.cleanType === 'departure_arrival').length,
    departure: report.filter(r => r.cleanType === 'departure').length,
    arrival: report.filter(r => r.cleanType === 'arrival').length,
    stayover: report.filter(r => r.cleanType === 'stayover').length,
  }

  const toggleDone = (id: string) =>
    setDoneSet(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div style={{ padding: '1.5rem 2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>🧹 Housekeeping</h1>
          <p style={{ color: '#888', fontSize: 13, margin: '2px 0 0' }}>Щоденний звіт прибирання</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="date" value={date} onChange={e => { setDate(e.target.value); setDoneSet(new Set()) }}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13 }} />
          <button onClick={() => window.print()} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
            🖨️ Друк
          </button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '12px 16px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>Виконано</span>
            <span style={{ color: '#888' }}>{doneCount} / {report.length}</span>
          </div>
          <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${report.length > 0 ? (doneCount / report.length) * 100 : 0}%`, background: '#27ae60', borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setDoneSet(new Set(filtered.map(r => r.roomId)))}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #27ae60', background: '#f0faf4', color: '#27ae60', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            ✓ Всі виконано
          </button>
          {doneCount > 0 && (
            <button onClick={() => setDoneSet(new Set())}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', color: '#aaa', cursor: 'pointer', fontSize: 12 }}>
              Скинути
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
        {([['all', 'Всі', report.length, '#64748b'], ['departure_arrival', 'Виїзд + Заїзд', counts.departure_arrival, CLEAN_COLORS.departure_arrival], ['departure', 'Виїзне', counts.departure, CLEAN_COLORS.departure], ['arrival', 'Підготовка', counts.arrival, CLEAN_COLORS.arrival], ['stayover', 'Поточне', counts.stayover, CLEAN_COLORS.stayover]] as [CleanType | 'all', string, number, string][]).map(([type, label, cnt, color]) => (
          <button key={type} onClick={() => setFilterType(type)} style={{
            padding: '5px 14px', borderRadius: 20, border: `1px solid ${filterType === type ? color : '#e5e5e5'}`,
            background: filterType === type ? `${color}18` : '#fff',
            color: filterType === type ? color : '#888',
            fontWeight: filterType === type ? 700 : 400,
            fontSize: 13, cursor: 'pointer',
          }}>
            {label} {cnt > 0 && <span style={{ fontWeight: 700 }}>({cnt})</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '8px 130px 160px 90px 90px 100px 1fr 1fr 80px', padding: '10px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0', fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, gap: 8 }}>
          <div />
          <div>Номер</div>
          <div>Тип прибирання</div>
          <div>Виїзд</div>
          <div>Заїзд</div>
          <div>Гостей</div>
          <div>Хто виїжджає</div>
          <div>Хто заїжджає</div>
          <div>Готово</div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#aaa' }}>
            На {new Date(date).toLocaleDateString('uk-UA')} завдань немає
          </div>
        ) : (
          filtered.map((row, i) => {
            const done = doneSet.has(row.roomId)
            const color = CLEAN_COLORS[row.cleanType]
            return (
              <div key={row.roomId} style={{ display: 'grid', gridTemplateColumns: '8px 130px 160px 90px 90px 100px 1fr 1fr 80px', padding: '12px 16px', borderBottom: i < filtered.length - 1 ? '1px solid #f5f5f5' : 'none', background: done ? '#f0faf4' : 'transparent', alignItems: 'center', gap: 8, opacity: done ? 0.7 : 1, transition: 'background 0.15s' }}>
                <div style={{ width: 6, height: 40, borderRadius: 3, background: color }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>№{row.roomName}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{row.roomType}</div>
                  {row.note && <div style={{ fontSize: 11, color: '#e67e22', marginTop: 2 }}>📝 {row.note}</div>}
                </div>
                <div>
                  <span style={{ background: `${color}18`, color, borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
                    {CLEAN_LABELS[row.cleanType]}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: row.checkoutTime !== '—' ? 600 : 400, color: row.checkoutTime !== '—' ? CLEAN_COLORS.departure : '#ddd' }}>
                  {row.checkoutTime !== '—' ? `🕐 ${row.checkoutTime}` : '—'}
                </div>
                <div style={{ fontSize: 13, fontWeight: row.checkinTime !== '—' ? 600 : 400, color: row.checkinTime !== '—' ? CLEAN_COLORS.arrival : '#ddd' }}>
                  {row.checkinTime !== '—' ? `🕐 ${row.checkinTime}` : '—'}
                </div>
                <div style={{ fontSize: 13, color: '#888' }}>👤 {row.guests}</div>
                <div style={{ fontSize: 12, color: '#555' }}>{row.guestOut !== '—' ? row.guestOut : <span style={{ color: '#ddd' }}>—</span>}</div>
                <div style={{ fontSize: 12, color: '#111', fontWeight: 500 }}>{row.guestIn !== '—' ? row.guestIn : <span style={{ color: '#ddd' }}>—</span>}</div>
                <div style={{ textAlign: 'center' }}>
                  <input type="checkbox" checked={done} onChange={() => toggleDone(row.roomId)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#27ae60' }} />
                </div>
              </div>
            )
          })
        )}

        <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#aaa' }}>Завдань: {filtered.length}</span>
          {doneCount === report.length && report.length > 0 && (
            <span style={{ fontSize: 13, color: '#27ae60', fontWeight: 700 }}>✓ Всі номери прибрано!</span>
          )}
        </div>
      </div>
    </div>
  )
}

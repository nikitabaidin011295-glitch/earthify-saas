'use client'
import { useState, useMemo } from 'react'

interface Tariff {
  id: string
  name: string
  resourceType: 'accommodation' | 'all'
  resourceId?: string
  price: number
  dateFrom?: string
  dateTo?: string
  daysOfWeek: number[]
  guestsCount: number
  priority: number
  isActive: boolean
  guestType: 'all' | 'adult' | 'child'
}

interface TariffBreakdown { date: string; price: number; tariffName: string }
interface TariffCalcResult { total: number; nights: number; perNight: number; breakdown: TariffBreakdown[]; hasPrice: boolean }

function calcTariff(tariffs: Tariff[], resourceId: string, guestsCount: number, start: string, end: string): TariffCalcResult {
  const startDate = new Date(start + 'T00:00:00')
  const endDate = new Date(end + 'T00:00:00')
  const nights = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86400000))
  const active = tariffs.filter(t => t.isActive)
  const breakdown: TariffBreakdown[] = []
  for (let i = 0; i < nights; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dateKey = date.toISOString().slice(0, 10)
    const dow = date.getDay()
    const candidates = active.filter(t => {
      const matchResource = t.resourceId ? t.resourceId === resourceId : true
      if (!matchResource) return false
      if (t.guestsCount > 0 && t.guestsCount !== guestsCount) return false
      if (t.dateFrom && t.dateTo && (dateKey < t.dateFrom || dateKey > t.dateTo)) return false
      if (t.daysOfWeek.length > 0 && !t.daysOfWeek.includes(dow)) return false
      return true
    })
    if (candidates.length === 0) {
      breakdown.push({ date: dateKey, price: 0, tariffName: '—' })
    } else {
      const best = [...candidates].sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority
        const aSpec = (a.resourceId ? 2 : 1) * 2 + (a.guestsCount > 0 ? 1 : 0)
        const bSpec = (b.resourceId ? 2 : 1) * 2 + (b.guestsCount > 0 ? 1 : 0)
        return bSpec - aSpec
      })[0]
      breakdown.push({ date: dateKey, price: best.price, tariffName: best.name })
    }
  }
  const total = breakdown.reduce((s, d) => s + d.price, 0)
  const perNight = nights > 0 ? Math.round(total / nights) : 0
  return { total, nights, perNight, breakdown, hasPrice: total > 0 }
}

const INITIAL_TARIFFS: Tariff[] = [
  { id: 't1', name: 'Базовий тариф', resourceType: 'accommodation', price: 1200, daysOfWeek: [], guestsCount: 0, priority: 1, isActive: true, guestType: 'all' },
  { id: 't2', name: 'Вихідні +20%', resourceType: 'accommodation', price: 1440, daysOfWeek: [5, 6], guestsCount: 0, priority: 2, isActive: true, guestType: 'all' },
  { id: 't3', name: 'Літній сезон', resourceType: 'accommodation', price: 1600, dateFrom: '2026-06-01', dateTo: '2026-08-31', daysOfWeek: [], guestsCount: 0, priority: 3, isActive: true, guestType: 'all' },
  { id: 't4', name: 'Делюкс базовий', resourceType: 'accommodation', resourceId: 'r4', price: 2400, daysOfWeek: [], guestsCount: 0, priority: 2, isActive: true, guestType: 'all' },
  { id: 't5', name: 'Для 1 гостя знижка', resourceType: 'accommodation', price: 900, daysOfWeek: [], guestsCount: 1, priority: 3, isActive: true, guestType: 'all' },
  { id: 't6', name: 'Новий рік', resourceType: 'accommodation', price: 3600, dateFrom: '2026-12-30', dateTo: '2027-01-03', daysOfWeek: [], guestsCount: 0, priority: 5, isActive: true, guestType: 'all' },
]

const DAYS_UA = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const ROOMS = [
  { id: 'r1', name: '101 — Стандарт' },
  { id: 'r4', name: '201 — Делюкс' },
  { id: 'r7', name: '301 — Люкс' },
]
const EMPTY_TARIFF: Omit<Tariff, 'id'> = { name: '', resourceType: 'accommodation', price: 0, daysOfWeek: [], guestsCount: 0, priority: 1, isActive: true, guestType: 'all' }

export default function HotelPricingPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>(INITIAL_TARIFFS)
  const [tab, setTab] = useState<'plans' | 'calendar' | 'calculator'>('plans')
  const [editing, setEditing] = useState<(Omit<Tariff, 'id'> & { id?: string }) | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saved, setSaved] = useState(false)
  const [calcRoom, setCalcRoom] = useState('r1')
  const [calcStart, setCalcStart] = useState('')
  const [calcEnd, setCalcEnd] = useState('')
  const [calcGuests, setCalcGuests] = useState(2)
  const [calcResult, setCalcResult] = useState<TariffCalcResult | null>(null)

  function openNew() { setEditing({ ...EMPTY_TARIFF }); setIsNew(true) }
  function openEdit(t: Tariff) { setEditing({ ...t }); setIsNew(false) }

  function saveTariff() {
    if (!editing) return
    if (isNew) setTariffs(prev => [...prev, { ...editing, id: `t${Date.now()}` } as Tariff])
    else setTariffs(prev => prev.map(t => t.id === editing.id ? { ...editing } as Tariff : t))
    setSaved(true)
    setTimeout(() => { setSaved(false); setEditing(null) }, 1200)
  }

  function deleteTariff(id: string) {
    if (confirm('Видалити тариф?')) setTariffs(prev => prev.filter(t => t.id !== id))
  }

  function toggleDay(dow: number) {
    if (!editing) return
    const days = editing.daysOfWeek.includes(dow) ? editing.daysOfWeek.filter(d => d !== dow) : [...editing.daysOfWeek, dow]
    setEditing({ ...editing, daysOfWeek: days })
  }

  function runCalc() {
    if (!calcStart || !calcEnd) return
    setCalcResult(calcTariff(tariffs, calcRoom, calcGuests, calcStart, calcEnd))
  }

  const calendarDays = useMemo(() => {
    const days = []
    const start = new Date()
    start.setDate(1)
    for (let i = 0; i < 30; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      const nextKey = new Date(d.getTime() + 86400000).toISOString().slice(0, 10)
      const result = calcTariff(tariffs, 'r1', 2, key, nextKey)
      days.push({ key, date: d, price: result.breakdown[0]?.price ?? 0, tariff: result.breakdown[0]?.tariffName ?? '—', isWeekend: d.getDay() === 0 || d.getDay() === 6 })
    }
    return days
  }, [tariffs])

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>💰 Тарифікація готелю</h1>
          <p style={{ color: '#888', fontSize: 13, margin: '2px 0 0' }}>Управління цінами, сезонні тарифи, правила</p>
        </div>
        <button onClick={openNew} style={{ padding: '8px 16px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Новий тариф
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem', background: '#f5f5f7', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ id: 'plans', label: 'Тарифи' }, { id: 'calendar', label: 'Календар цін' }, { id: 'calculator', label: 'Калькулятор' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#534AB7' : '#888', boxShadow: tab === t.id ? '0 1px 4px #0001' : 'none' }}>{t.label}</button>
        ))}
      </div>

      {tab === 'plans' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Назва', 'Номер', 'Ціна/ніч', 'Дні тижня', 'Дати', 'Гостей', 'Пріоритет', 'Статус', ''].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, color: '#aaa', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tariffs.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < tariffs.length - 1 ? '1px solid #f5f5f5' : 'none', opacity: t.isActive ? 1 : 0.5 }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: 13 }}>{t.name}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#666' }}>{t.resourceId ? ROOMS.find(r => r.id === t.resourceId)?.name : 'Всі'}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#534AB7', fontSize: 15 }}>₴{t.price.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12 }}>
                    {t.daysOfWeek.length === 0 ? <span style={{ color: '#aaa' }}>Всі дні</span> :
                      <div style={{ display: 'flex', gap: 3 }}>
                        {t.daysOfWeek.sort().map(d => <span key={d} style={{ background: '#EEEDFE', color: '#534AB7', padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{DAYS_UA[d]}</span>)}
                      </div>}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#666' }}>
                    {t.dateFrom && t.dateTo ? `${new Date(t.dateFrom).toLocaleDateString('uk-UA')} — ${new Date(t.dateTo).toLocaleDateString('uk-UA')}` : <span style={{ color: '#aaa' }}>Завжди</span>}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#666' }}>{t.guestsCount === 0 ? 'Будь-яка' : t.guestsCount}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: '#f5f5f7', borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 600 }}>{t.priority}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: t.isActive ? '#E1F5EE' : '#f5f5f5', color: t.isActive ? '#0F6E56' : '#aaa', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20 }}>
                      {t.isActive ? 'Активний' : 'Вимкнений'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(t)} style={{ background: '#EEEDFE', color: '#534AB7', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Ред.</button>
                      <button onClick={() => deleteTariff(t.id)} style={{ background: '#FCEBEB', color: '#A32D2D', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'calendar' && (
        <div>
          <p style={{ fontSize: 13, color: '#888', marginBottom: '1rem' }}>Ціни для стандартного номера (2 гості) на наступні 30 днів</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {DAYS_UA.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#aaa', padding: '4px 0' }}>{d}</div>)}
            {calendarDays.map(d => (
              <div key={d.key} style={{ border: '1px solid #ebebeb', borderRadius: 10, padding: '10px 8px', textAlign: 'center', background: d.isWeekend ? '#faf9ff' : '#fff' }}>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>{d.date.getDate()}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#534AB7' }}>₴{d.price.toLocaleString()}</div>
                <div style={{ fontSize: 9, color: '#bbb', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.tariff}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'calculator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.5rem' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1rem' }}>Розрахунок вартості</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5 }}>Номер</label>
                <select value={calcRoom} onChange={e => setCalcRoom(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }}>
                  {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5 }}>Заїзд</label>
                  <input type="date" value={calcStart} onChange={e => setCalcStart(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5 }}>Виїзд</label>
                  <input type="date" value={calcEnd} onChange={e => setCalcEnd(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5 }}>Кількість гостей</label>
                <input type="number" min={1} max={10} value={calcGuests} onChange={e => setCalcGuests(parseInt(e.target.value))} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }} />
              </div>
              <button onClick={runCalc} style={{ padding: '11px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Розрахувати</button>
            </div>
          </div>
          {calcResult && (
            <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1rem' }}>Результат</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1rem' }}>
                {[{ label: 'Ночей', value: String(calcResult.nights), big: false }, { label: 'Ціна за ніч', value: `₴${calcResult.perNight.toLocaleString()}`, big: false }, { label: 'Разом', value: `₴${calcResult.total.toLocaleString()}`, big: true }].map(item => (
                  <div key={item.label} style={{ background: item.big ? '#EEEDFE' : '#fafafa', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: item.big ? 22 : 16, fontWeight: 700, color: item.big ? '#534AB7' : '#111' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 8 }}>Деталізація по ночах:</div>
              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {calcResult.breakdown.map(d => (
                  <div key={d.date} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 12 }}>
                    <span style={{ color: '#666' }}>{new Date(d.date).toLocaleDateString('uk-UA')}</span>
                    <span style={{ color: '#888', flex: 1, marginLeft: 12 }}>{d.tariffName}</span>
                    <span style={{ fontWeight: 600, color: d.price === 0 ? '#ef4444' : '#111' }}>₴{d.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: 520, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: '1.25rem' }}>{isNew ? 'Новий тариф' : 'Редагувати тариф'}</h2>
            {saved && <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '10px', borderRadius: 8, marginBottom: 14, fontWeight: 600 }}>✓ Збережено!</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5, fontWeight: 500 }}>Назва тарифу</label>
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }} placeholder="Напр. Вихідні — Делюкс" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5, fontWeight: 500 }}>Ціна за ніч (₴)</label>
                  <input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5, fontWeight: 500 }}>Пріоритет</label>
                  <input type="number" min={1} max={10} value={editing.priority} onChange={e => setEditing({ ...editing, priority: Number(e.target.value) })} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5, fontWeight: 500 }}>Конкретний номер (опційно)</label>
                <select value={editing.resourceId || ''} onChange={e => setEditing({ ...editing, resourceId: e.target.value || undefined })} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }}>
                  <option value="">Всі номери</option>
                  {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5, fontWeight: 500 }}>Дата з</label>
                  <input type="date" value={editing.dateFrom || ''} onChange={e => setEditing({ ...editing, dateFrom: e.target.value || undefined })} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5, fontWeight: 500 }}>Дата до</label>
                  <input type="date" value={editing.dateTo || ''} onChange={e => setEditing({ ...editing, dateTo: e.target.value || undefined })} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 500 }}>Дні тижня (порожньо = всі дні)</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {DAYS_UA.map((d, i) => (
                    <button key={i} type="button" onClick={() => toggleDay(i)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: editing.daysOfWeek.includes(i) ? '#534AB7' : '#fff', color: editing.daysOfWeek.includes(i) ? '#fff' : '#666', borderColor: editing.daysOfWeek.includes(i) ? '#534AB7' : '#ddd' }}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5, fontWeight: 500 }}>К-сть гостей (0 = будь-яка)</label>
                <input type="number" min={0} max={10} value={editing.guestsCount} onChange={e => setEditing({ ...editing, guestsCount: Number(e.target.value) })} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, background: '#fafafa' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: editing.isActive ? '#534AB7' : '#e5e5e5', cursor: 'pointer', position: 'relative' }} onClick={() => setEditing({ ...editing, isActive: !editing.isActive })}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: editing.isActive ? 22 : 2, transition: 'left 0.2s' }} />
                </div>
                <span style={{ fontSize: 13, color: editing.isActive ? '#0F6E56' : '#aaa', fontWeight: 600 }}>{editing.isActive ? 'Активний' : 'Вимкнений'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button onClick={saveTariff} style={{ flex: 1, padding: '11px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{isNew ? 'Створити' : 'Зберегти'}</button>
              <button onClick={() => setEditing(null)} style={{ padding: '11px 18px', background: '#f5f5f7', color: '#666', border: 'none', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>Скасувати</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

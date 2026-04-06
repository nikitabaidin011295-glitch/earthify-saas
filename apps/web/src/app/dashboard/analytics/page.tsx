'use client'
import { useState, useMemo } from 'react'

// в”Ђв”Ђв”Ђ Types в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
interface MonthData {
  month: string
  bookingsCount: number
  nights: number
  adr: number
  revpar: number
  occupancy: number
  revenue: number
  revenueAccommodation: number
  revenueOther: number
  clientsNew: number
  clientsRepeat: number
  los: number
  guestsTotal: number
}

// в”Ђв”Ђв”Ђ Mock data (12 months) в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
const MONTHS_UA = ['РЎС–С‡','Р›СЋС‚','Р‘РµСЂ','РљРІС–','РўСЂР°','Р§РµСЂ','Р›РёРї','РЎРµСЂ','Р’РµСЂ','Р–РѕРІ','Р›РёСЃ','Р“СЂСѓ']

const DATA: MonthData[] = [
  { month: '2025-07', bookingsCount: 42, nights: 186, adr: 1840, revpar: 1290, occupancy: 70, revenue: 342240, revenueAccommodation: 310000, revenueOther: 32240, clientsNew: 28, clientsRepeat: 14, los: 4.4, guestsTotal: 98 },
  { month: '2025-08', bookingsCount: 51, nights: 224, adr: 2100, revpar: 1596, occupancy: 76, revenue: 470400, revenueAccommodation: 420000, revenueOther: 50400, clientsNew: 33, clientsRepeat: 18, los: 4.4, guestsTotal: 120 },
  { month: '2025-09', bookingsCount: 38, nights: 152, adr: 1650, revpar: 1089, occupancy: 66, revenue: 250800, revenueAccommodation: 230000, revenueOther: 20800, clientsNew: 22, clientsRepeat: 16, los: 4.0, guestsTotal: 88 },
  { month: '2025-10', bookingsCount: 29, nights: 116, adr: 1400, revpar: 840, occupancy: 60, revenue: 162400, revenueAccommodation: 148000, revenueOther: 14400, clientsNew: 18, clientsRepeat: 11, los: 4.0, guestsTotal: 65 },
  { month: '2025-11', bookingsCount: 22, nights: 88, adr: 1200, revpar: 660, occupancy: 55, revenue: 105600, revenueAccommodation: 96000, revenueOther: 9600, clientsNew: 14, clientsRepeat: 8, los: 4.0, guestsTotal: 50 },
  { month: '2025-12', bookingsCount: 35, nights: 140, adr: 2400, revpar: 1680, occupancy: 70, revenue: 336000, revenueAccommodation: 300000, revenueOther: 36000, clientsNew: 20, clientsRepeat: 15, los: 4.0, guestsTotal: 82 },
  { month: '2026-01', bookingsCount: 18, nights: 72, adr: 1100, revpar: 605, occupancy: 55, revenue: 79200, revenueAccommodation: 72000, revenueOther: 7200, clientsNew: 12, clientsRepeat: 6, los: 4.0, guestsTotal: 40 },
  { month: '2026-02', bookingsCount: 21, nights: 84, adr: 1200, revpar: 720, occupancy: 60, revenue: 100800, revenueAccommodation: 92000, revenueOther: 8800, clientsNew: 14, clientsRepeat: 7, los: 4.0, guestsTotal: 48 },
  { month: '2026-03', bookingsCount: 28, nights: 112, adr: 1350, revpar: 877, occupancy: 65, revenue: 151200, revenueAccommodation: 138000, revenueOther: 13200, clientsNew: 18, clientsRepeat: 10, los: 4.0, guestsTotal: 64 },
  { month: '2026-04', bookingsCount: 34, nights: 136, adr: 1500, revpar: 1050, occupancy: 70, revenue: 204000, revenueAccommodation: 186000, revenueOther: 18000, clientsNew: 22, clientsRepeat: 12, los: 4.0, guestsTotal: 78 },
]

const TOTAL_ROOMS = 9
const fmt = (n: number) => Math.round(n).toLocaleString('uk-UA')
const fmtPct = (n: number) => n.toFixed(1) + '%'
const fmtCurr = (n: number) => 'в‚ґ' + Math.round(n).toLocaleString('uk-UA')

type MetricKey = keyof MonthData

interface MetricDef {
  key: MetricKey
  label: string
  format: 'n' | 'curr' | 'pct' | 'd'
  color?: string
  bold?: boolean
}

const METRICS: MetricDef[] = [
  { key: 'bookingsCount', label: 'Р‘СЂРѕРЅСЋРІР°РЅСЊ', format: 'n' },
  { key: 'nights', label: 'РќРѕС‡РµР№', format: 'n' },
  { key: 'los', label: 'РЎРµСЂРµРґРЅСЏ С‚СЂРёРІР°Р»С–СЃС‚СЊ (LOS)', format: 'd' },
  { key: 'guestsTotal', label: 'Р“РѕСЃС‚РµР№ РІСЃСЊРѕРіРѕ', format: 'n' },
  { key: 'occupancy', label: 'Р—Р°РІР°РЅС‚Р°Р¶РµРЅС–СЃС‚СЊ', format: 'pct', color: '#534AB7', bold: true },
  { key: 'adr', label: 'ADR (СЃРµСЂРµРґРЅСЏ С†С–РЅР°/РЅС–С‡)', format: 'curr', color: '#0F6E56', bold: true },
  { key: 'revpar', label: 'RevPAR', format: 'curr', color: '#D85A30', bold: true },
  { key: 'revenue', label: 'Р—Р°РіР°Р»СЊРЅРёР№ РІРёС‚РѕСЂРі', format: 'curr', bold: true },
  { key: 'revenueAccommodation', label: 'В· РџСЂРѕР¶РёРІР°РЅРЅСЏ', format: 'curr' },
  { key: 'revenueOther', label: 'В· Р†РЅС€С– РїРѕСЃР»СѓРіРё', format: 'curr' },
  { key: 'clientsNew', label: 'РќРѕРІРёС… РєР»С–С”РЅС‚С–РІ', format: 'n' },
  { key: 'clientsRepeat', label: 'РџРѕРІС‚РѕСЂРЅРёС… РєР»С–С”РЅС‚С–РІ', format: 'n' },
]

function fmtVal(v: number, format: MetricDef['format']): string {
  if (v == null) return 'вЂ”'
  switch (format) {
    case 'curr': return fmtCurr(v)
    case 'pct': return fmtPct(v)
    case 'd': return v.toFixed(1)
    default: return fmt(v)
  }
}

export default function AnalyticsPage() {
  const [tab, setTab] = useState<'table' | 'charts'>('table')
  const [selectedMonths, setSelectedMonths] = useState<string[]>(DATA.slice(-6).map(d => d.month))

  const visibleData = useMemo(() => DATA.filter(d => selectedMonths.includes(d.month)), [selectedMonths])

  const totals = useMemo(() => {
    if (visibleData.length === 0) return null
    return {
      bookingsCount: visibleData.reduce((s, d) => s + d.bookingsCount, 0),
      nights: visibleData.reduce((s, d) => s + d.nights, 0),
      revenue: visibleData.reduce((s, d) => s + d.revenue, 0),
      revenueAccommodation: visibleData.reduce((s, d) => s + d.revenueAccommodation, 0),
      revenueOther: visibleData.reduce((s, d) => s + d.revenueOther, 0),
      clientsNew: visibleData.reduce((s, d) => s + d.clientsNew, 0),
      clientsRepeat: visibleData.reduce((s, d) => s + d.clientsRepeat, 0),
      guestsTotal: visibleData.reduce((s, d) => s + d.guestsTotal, 0),
      adr: Math.round(visibleData.reduce((s, d) => s + d.adr, 0) / visibleData.length),
      revpar: Math.round(visibleData.reduce((s, d) => s + d.revpar, 0) / visibleData.length),
      occupancy: Math.round(visibleData.reduce((s, d) => s + d.occupancy, 0) / visibleData.length),
      los: parseFloat((visibleData.reduce((s, d) => s + d.los, 0) / visibleData.length).toFixed(1)),
    }
  }, [visibleData])

  const maxRevenue = Math.max(...DATA.map(d => d.revenue))
  const maxOccupancy = 100

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>рџ“Љ РђРЅР°Р»С–С‚РёРєР°</h1>
          <p style={{ color: '#888', fontSize: 13, margin: '2px 0 0' }}>РњРµС‚СЂРёРєРё РїРѕ РјС–СЃСЏС†СЏС…: ADR, RevPAR, Р·Р°РІР°РЅС‚Р°Р¶РµРЅС–СЃС‚СЊ</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f5f5f7', padding: 4, borderRadius: 10 }}>
          {[{ id: 'table', label: 'РўР°Р±Р»РёС†СЏ' }, { id: 'charts', label: 'Р“СЂР°С„С–РєРё' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#534AB7' : '#888', boxShadow: tab === t.id ? '0 1px 3px #0001' : 'none' }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      {totals && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: '1.5rem' }}>
          {[
            { label: 'Р—Р°РІР°РЅС‚Р°Р¶РµРЅС–СЃС‚СЊ', value: fmtPct(totals.occupancy), sub: 'РЎРµСЂРµРґ. РїРѕ РІРёР±СЂР°РЅРѕРјСѓ', color: '#534AB7', bg: '#EEEDFE' },
            { label: 'ADR', value: fmtCurr(totals.adr), sub: 'РЎРµСЂРµРґРЅСЏ С†С–РЅР°/РЅС–С‡', color: '#0F6E56', bg: '#E1F5EE' },
            { label: 'RevPAR', value: fmtCurr(totals.revpar), sub: 'Р’РёС‚РѕСЂРі РЅР° РЅРѕРјРµСЂ', color: '#D85A30', bg: '#FAECE7' },
            { label: 'Р—Р°РіР°Р»СЊРЅРёР№ РІРёС‚РѕСЂРі', value: fmtCurr(totals.revenue), sub: `${totals.bookingsCount} Р±СЂРѕРЅСЋРІР°РЅСЊ`, color: '#185FA5', bg: '#E6F1FB' },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginBottom: 6, opacity: 0.8 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: s.color, opacity: 0.7, marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Month selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {DATA.map(d => {
          const [y, m] = d.month.split('-')
          const label = `${MONTHS_UA[parseInt(m) - 1]}'${y.slice(2)}`
          const selected = selectedMonths.includes(d.month)
          return (
            <button key={d.month} onClick={() => setSelectedMonths(prev => selected ? prev.filter(x => x !== d.month) : [...prev, d.month])}
              style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid', fontSize: 12, cursor: 'pointer', fontWeight: selected ? 600 : 400, background: selected ? '#534AB7' : '#fff', color: selected ? '#fff' : '#666', borderColor: selected ? '#534AB7' : '#ddd' }}>
              {label}
            </button>
          )
        })}
        <button onClick={() => setSelectedMonths(DATA.map(d => d.month))} style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid #ddd', fontSize: 12, cursor: 'pointer', color: '#534AB7', background: '#EEEDFE', borderColor: '#534AB7' }}>Р’СЃС–</button>
      </div>

      {/* Table */}
      {tab === 'table' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, color: '#aaa', fontWeight: 600, borderBottom: '1px solid #f0f0f0', minWidth: 180 }}>РџРѕРєР°Р·РЅРёРє</th>
                {visibleData.map(d => {
                  const [y, m] = d.month.split('-')
                  return <th key={d.month} style={{ padding: '11px 14px', textAlign: 'right', fontSize: 11, color: '#aaa', fontWeight: 600, borderBottom: '1px solid #f0f0f0', minWidth: 100 }}>{MONTHS_UA[parseInt(m) - 1]}'{y.slice(2)}</th>
                })}
                {totals && <th style={{ padding: '11px 14px', textAlign: 'right', fontSize: 11, color: '#534AB7', fontWeight: 700, borderBottom: '1px solid #f0f0f0', minWidth: 100 }}>Р Р°Р·РѕРј/РЎРµСЂ.</th>}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((metric, mi) => (
                <tr key={metric.key} style={{ borderBottom: '1px solid #f5f5f5', background: metric.bold ? '#fafafe' : 'transparent' }}>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: metric.bold ? 600 : 400, color: metric.color || '#111' }}>{metric.label}</td>
                  {visibleData.map(d => {
                    const v = d[metric.key] as number
                    return (
                      <td key={d.month} style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, fontWeight: metric.bold ? 700 : 400, color: metric.color || '#111' }}>
                        {fmtVal(v, metric.format)}
                      </td>
                    )
                  })}
                  {totals && (
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: metric.color || '#534AB7' }}>
                      {fmtVal((totals as Record<string, number>)[metric.key as string] ?? 0, metric.format)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Charts */}
      {tab === 'charts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Revenue bar chart */}
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.5rem' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1.25rem', color: '#111' }}>Р’РёС‚РѕСЂРі РїРѕ РјС–СЃСЏС†СЏС…</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
              {visibleData.map(d => {
                const [y, m] = d.month.split('-')
                const height = Math.max(4, (d.revenue / maxRevenue) * 140)
                return (
                  <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 9, color: '#888', textAlign: 'center' }}>в‚ґ{Math.round(d.revenue / 1000)}Рє</div>
                    <div style={{ width: '100%', height, background: 'linear-gradient(180deg, #534AB7, #7c3aed)', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
                    <div style={{ fontSize: 9, color: '#aaa', textAlign: 'center' }}>{MONTHS_UA[parseInt(m) - 1]}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Occupancy chart */}
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.5rem' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1.25rem', color: '#111' }}>Р—Р°РІР°РЅС‚Р°Р¶РµРЅС–СЃС‚СЊ (%)</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
              {visibleData.map(d => {
                const [y, m] = d.month.split('-')
                const height = Math.max(4, (d.occupancy / maxOccupancy) * 140)
                const color = d.occupancy >= 70 ? '#10b981' : d.occupancy >= 55 ? '#f59e0b' : '#ef4444'
                return (
                  <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 9, color: '#888', textAlign: 'center' }}>{d.occupancy}%</div>
                    <div style={{ width: '100%', height, background: color, borderRadius: '4px 4px 0 0', minHeight: 4 }} />
                    <div style={{ fontSize: 9, color: '#aaa', textAlign: 'center' }}>{MONTHS_UA[parseInt(m) - 1]}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              {[{ color: '#10b981', label: 'в‰Ґ70%' }, { color: '#f59e0b', label: '55вЂ“70%' }, { color: '#ef4444', label: '<55%' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                  <span style={{ fontSize: 11, color: '#888' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ADR vs RevPAR */}
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.5rem' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1.25rem', color: '#111' }}>ADR vs RevPAR</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
              {visibleData.map(d => {
                const [y, m] = d.month.split('-')
                const maxVal = Math.max(...visibleData.map(x => x.adr))
                const adrH = Math.max(4, (d.adr / maxVal) * 140)
                const revparH = Math.max(4, (d.revpar / maxVal) * 140)
                return (
                  <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 140 }}>
                      <div style={{ width: '45%', height: adrH, background: '#0F6E56', borderRadius: '3px 3px 0 0' }} />
                      <div style={{ width: '45%', height: revparH, background: '#D85A30', borderRadius: '3px 3px 0 0' }} />
                    </div>
                    <div style={{ fontSize: 9, color: '#aaa', textAlign: 'center' }}>{MONTHS_UA[parseInt(m) - 1]}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: '#0F6E56' }} /><span style={{ fontSize: 11, color: '#888' }}>ADR</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: '#D85A30' }} /><span style={{ fontSize: 11, color: '#888' }}>RevPAR</span></div>
            </div>
          </div>

          {/* Clients new vs repeat */}
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.5rem' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1.25rem', color: '#111' }}>РќРѕРІС– vs РїРѕРІС‚РѕСЂРЅС– РєР»С–С”РЅС‚Рё</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visibleData.map(d => {
                const [y, m] = d.month.split('-')
                const total = d.clientsNew + d.clientsRepeat
                const newPct = total > 0 ? (d.clientsNew / total) * 100 : 0
                return (
                  <div key={d.month}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: '#666' }}>{MONTHS_UA[parseInt(m) - 1]}'{y.slice(2)}</span>
                      <span style={{ color: '#888' }}>{d.clientsNew} РЅРѕРІРёС… В· {d.clientsRepeat} РїРѕРІС‚РѕСЂРЅРёС…</span>
                    </div>
                    <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${newPct}%`, background: '#534AB7', borderRadius: 4 }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: '#534AB7' }} /><span style={{ fontSize: 11, color: '#888' }}>РќРѕРІС–</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: '#f0f0f0' }} /><span style={{ fontSize: 11, color: '#888' }}>РџРѕРІС‚РѕСЂРЅС–</span></div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}


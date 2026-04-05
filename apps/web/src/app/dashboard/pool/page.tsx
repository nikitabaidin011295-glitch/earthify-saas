'use client'
import { useEffect, useState } from 'react'

interface Membership { id: string; guest: { name: string; phone: string }; type: string; visitsTotal: number; visitsUsed: number; validUntil: string; status: string; qrToken: string }

export default function PoolPage() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [qrInput, setQrInput] = useState('')
  const [qrResult, setQrResult] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pool/memberships`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => setMemberships(Array.isArray(data) ? data : [])).finally(() => setLoading(false))
  }, [])

  async function validateQr() {
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pool/validate-qr`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken: qrInput }),
    })
    setQrResult(await res.json())
  }

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>🏊 Басейн / Фітнес</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Абонементи та перевірка QR</p>
      </div>

      {/* QR Scanner */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 16 }}>🔍 Перевірка QR-коду</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <input value={qrInput} onChange={e => setQrInput(e.target.value)} placeholder="Введіть або скануйте QR-токен..."
            style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14 }}
          />
          <button onClick={validateQr} style={{ padding: '10px 24px', background: 'var(--gradient)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>Перевірити</button>
        </div>
        {qrResult && (
          <div style={{ marginTop: 16, padding: 16, borderRadius: 'var(--radius-md)', background: qrResult.valid ? '#10b98115' : '#ef444415', border: `1px solid ${qrResult.valid ? '#10b98140' : '#ef444440'}` }}>
            {qrResult.valid ? (
              <>
                <p style={{ color: '#10b981', fontWeight: 600, marginBottom: 8 }}>✅ QR дійсний!</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Гість: {qrResult.membership?.guest?.name}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Залишилось: {qrResult.membership?.visitsTotal - qrResult.membership?.visitsUsed} відвідувань</p>
              </>
            ) : (
              <p style={{ color: '#ef4444', fontWeight: 600 }}>❌ {qrResult.error}</p>
            )}
          </div>
        )}
      </div>

      {/* Memberships */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontWeight: 600 }}>Абонементи ({memberships.length})</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Гість', 'Тип', 'Відвідування', 'Діє до', 'Статус'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Завантаження...</td></tr>
            : memberships.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <p style={{ fontWeight: 500 }}>{m.guest.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{m.guest.phone}</p>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{m.type}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, maxWidth: 100 }}>
                      <div style={{ height: '100%', borderRadius: 3, background: 'var(--accent-cyan)', width: `${(m.visitsUsed / m.visitsTotal) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{m.visitsUsed}/{m.visitsTotal}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{new Date(m.validUntil).toLocaleDateString('uk-UA')}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: m.status === 'active' ? '#10b981' : '#6b7280', border: `1px solid ${m.status === 'active' ? '#10b98140' : '#6b728040'}` }}>
                    {m.status === 'active' ? 'Активний' : 'Неактивний'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

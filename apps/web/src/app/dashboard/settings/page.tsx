'use client'
import { useEffect, useState } from 'react'

const ALL_MODULES = [
  { key: 'hotel',      label: 'Готель',   icon: '🏨', desc: 'PMS, номери, бронювання, check-in/out' },
  { key: 'spa',        label: 'СПА',      icon: '💆', desc: 'Wellness, записи, майстри, послуги' },
  { key: 'salon',      label: 'Салон',    icon: '💇', desc: 'Краса, стиль, нігтьові студії, барбершопи' },
  { key: 'pool',       label: 'Басейн',   icon: '🏊', desc: 'Абонементи, QR-сканування, сесії' },
  { key: 'restaurant', label: 'Ресторан', icon: '🍽️', desc: 'Меню, столики, замовлення, KDS' },
  { key: 'cafe',       label: 'Кафе/Бар', icon: '☕', desc: 'Напої, швидкі замовлення, каса' },
]

export default function SettingsPage() {
  const [modules, setModules] = useState<string[]>([])
  const [tenantName, setTenantName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setModules(data.modulesEnabled || []); setTenantName(data.name || '') })
      .finally(() => setLoading(false))
  }, [])

  function toggleModule(key: string) {
    setModules(prev => prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key])
  }

  async function save() {
    setSaving(true)
    const token = localStorage.getItem('accessToken')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/modules`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ modulesEnabled: modules }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Завантаження...</div>

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>⚙️ Налаштування</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{tenantName}</p>
      </div>

      {/* Modules */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Модулі</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Вмикай тільки те, що потрібно. Дані зберігаються навіть після вимкнення.</p>
          </div>
          <button onClick={save} disabled={saving} style={{
            padding: '10px 24px', background: saved ? '#10b981' : 'var(--gradient)',
            color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 14,
            opacity: saving ? 0.7 : 1, transition: 'background 0.3s',
          }}>
            {saved ? '✓ Збережено' : saving ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {ALL_MODULES.map(mod => {
            const active = modules.includes(mod.key)
            return (
              <div key={mod.key} onClick={() => toggleModule(mod.key)} style={{
                padding: 20, borderRadius: 'var(--radius-md)', cursor: 'pointer',
                border: `2px solid ${active ? 'var(--accent-purple)' : 'var(--border)'}`,
                background: active ? '#7c3aed10' : 'var(--bg-secondary)',
                transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: 14,
              }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{mod.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: 600, color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{mod.label}</p>
                    <div style={{
                      width: 40, height: 22, borderRadius: 11,
                      background: active ? 'var(--accent-purple)' : 'var(--border)',
                      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                    }}>
                      <div style={{
                        position: 'absolute', top: 3, left: active ? 21 : 3,
                        width: 16, height: 16, borderRadius: '50%', background: 'white',
                        transition: 'left 0.2s',
                      }} />
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{mod.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Placeholder sections */}
      {[['Підписка', 'Starter · Trial 14 днів'], ['Канали зв\'язку', 'Telegram, Instagram, Viber, SMS'], ['Безпека', 'Пароль, двофакторна аутентифікація']].map(([title, desc]) => (
        <div key={title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontWeight: 600, marginBottom: 4 }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{desc}</p>
          </div>
          <button style={{ padding: '8px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: 14 }}>
            Налаштувати →
          </button>
        </div>
      ))}
    </div>
  )
}

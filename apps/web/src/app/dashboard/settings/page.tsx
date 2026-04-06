'use client'
import { useState } from 'react'

const modulesList = [
  { id: 'hotel', name: 'Готель / PMS', icon: '🏨', description: 'Номери, бронювання, channel manager' },
  { id: 'spa', name: 'СПА / Wellness', icon: '💆', description: 'Процедури, кабінети, майстри' },
  { id: 'salon', name: 'Салон краси', icon: '✂️', description: 'Запис, майстри, послуги' },
  { id: 'restaurant', name: 'Ресторан', icon: '🍽️', description: 'Столики, меню, KDS' },
  { id: 'cafe', name: 'Кафе / Бар', icon: '☕', description: 'Замовлення, каса, QR-меню' },
  { id: 'pool', name: 'Басейн / Фітнес', icon: '🏊', description: 'Абонементи, слоти, QR-вхід' },
]

export default function SettingsPage() {
  const [activeModules, setActiveModules] = useState(['hotel', 'spa', 'salon', 'restaurant', 'cafe', 'pool'])
  const [business, setBusiness] = useState({ name: 'Мій бізнес', address: '', phone: '', email: '', currency: 'UAH', timezone: 'Europe/Kiev' })
  const [saved, setSaved] = useState(false)

  function toggleModule(id: string) {
    setActiveModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>⚙️ Налаштування</h1>
        <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Бізнес-профіль та управління модулями</p>
      </div>

      {/* Business info */}
      <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1.25rem' }}>Інформація про бізнес</h2>
        {saved && <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 600 }}>✓ Збережено!</div>}
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Назва бізнесу', name: 'name', type: 'text' },
              { label: 'Телефон', name: 'phone', type: 'tel' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Адреса', name: 'address', type: 'text' },
            ].map(f => (
              <div key={f.name}>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                <input type={f.type} value={business[f.name as keyof typeof business]} onChange={e => setBusiness(p => ({ ...p, [f.name]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Валюта</label>
              <select value={business.currency} onChange={e => setBusiness(p => ({ ...p, currency: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }}>
                <option value="UAH">UAH — Гривня</option>
                <option value="USD">USD — Долар</option>
                <option value="EUR">EUR — Євро</option>
                <option value="PLN">PLN — Злотий</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>Часовий пояс</label>
              <select value={business.timezone} onChange={e => setBusiness(p => ({ ...p, timezone: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fafafa' }}>
                <option value="Europe/Kiev">Київ (UTC+3)</option>
                <option value="Europe/Warsaw">Варшава (UTC+2)</option>
                <option value="Europe/Berlin">Берлін (UTC+2)</option>
              </select>
            </div>
          </div>
          <button type="submit" style={{ marginTop: 20, padding: '10px 24px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Зберегти
          </button>
        </form>
      </div>

      {/* Modules */}
      <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Модулі</h2>
            <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Вмикай та вимикай потрібні модулі</p>
          </div>
          <span style={{ fontSize: 12, color: '#534AB7', fontWeight: 600 }}>{activeModules.length} / {modulesList.length} активних</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {modulesList.map(mod => (
            <div key={mod.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: activeModules.includes(mod.id) ? '#FAFAFA' : '#fff', border: `1px solid ${activeModules.includes(mod.id) ? '#EEEDFE' : '#f0f0f0'}`, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 24 }}>{mod.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{mod.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{mod.description}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: activeModules.includes(mod.id) ? '#0F6E56' : '#aaa', fontWeight: 600 }}>
                  {activeModules.includes(mod.id) ? 'Активний' : 'Вимкнений'}
                </span>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: activeModules.includes(mod.id) ? '#534AB7' : '#e5e5e5', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }} onClick={() => toggleModule(mod.id)}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: activeModules.includes(mod.id) ? 22 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px #0002' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

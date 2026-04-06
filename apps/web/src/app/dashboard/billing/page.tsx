'use client'
import { useState } from 'react'

const currentPlan = { name: 'Growth', price: 89, nextBilling: '05.05.2026', modules: ['hotel', 'spa', 'salon', 'restaurant', 'cafe', 'pool'] }

const plans = [
  {
    id: 'starter', name: 'Starter', price: 29, period: '/ місяць',
    features: ['2 модулі на вибір', 'До 3 співробітників', 'Базовий POS', 'Онлайн-бронювання'],
    missing: ['White-label додаток', 'Channel manager', 'AI Waitlist', 'Loyalty програма'],
  },
  {
    id: 'growth', name: 'Growth', price: 89, period: '/ місяць',
    features: ['Всі 6 модулів', 'До 15 співробітників', 'Повний POS + офлайн', 'White-label додаток', 'Loyalty програма', 'AI Waitlist', 'Channel manager'],
    missing: ['Digital Key (NFC)', 'SSO / SAML', 'SLA 99.9%'],
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 199, period: '/ місяць',
    features: ['Всі модулі', 'Необмежено співробітників', 'Digital Key (NFC)', 'API доступ', 'SSO / SAML', 'SLA 99.9%', 'Мультилокація', 'Пріоритетна підтримка'],
    missing: [],
  },
]

const invoices = [
  { id: 'INV-001', date: '05.03.2026', amount: 89, status: 'paid', plan: 'Growth' },
  { id: 'INV-002', date: '05.02.2026', amount: 89, status: 'paid', plan: 'Growth' },
  { id: 'INV-003', date: '05.01.2026', amount: 29, status: 'paid', plan: 'Starter' },
]

const addons = [
  { id: 'sms', name: 'SMS/Viber пакет', description: '500 повідомлень/місяць', price: 9, active: true },
  { id: 'ai', name: 'AI Smart Pricing', description: 'Динамічна ціна', price: 29, active: false },
  { id: 'analytics', name: 'Розширена аналітика', description: 'Детальні звіти', price: 19, active: true },
  { id: 'whitelabel', name: 'White-label додаток', description: 'Ваш бренд', price: 49, active: false },
]

export default function BillingPage() {
  const [view, setView] = useState<'overview' | 'plans' | 'addons' | 'invoices'>('overview')
  const [activeAddons, setActiveAddons] = useState(addons.map(a => ({ ...a })))

  function toggleAddon(id: string) {
    setActiveAddons(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  const totalAddons = activeAddons.filter(a => a.active).reduce((s, a) => s + a.price, 0)

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>💳 Каса та тарифи</h1>
        <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Управління підпискою та виставлення рахунків</p>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: '#f5f5f7', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ id: 'overview', label: 'Огляд' }, { id: 'plans', label: 'Тарифи' }, { id: 'addons', label: 'Додатки' }, { id: 'invoices', label: 'Рахунки' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id as typeof view)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: view === t.id ? '#fff' : 'transparent',
            color: view === t.id ? '#534AB7' : '#888',
            boxShadow: view === t.id ? '0 1px 4px #0001' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {view === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'linear-gradient(135deg, #534AB7, #7c3aed)', borderRadius: 16, padding: '1.75rem', color: '#fff' }}>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Поточний тариф</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{currentPlan.name}</div>
            <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>${currentPlan.price}<span style={{ fontSize: 16, opacity: 0.8 }}>/міс</span></div>
            <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>Наступне списання: {currentPlan.nextBilling}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setView('plans')} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                Змінити тариф
              </button>
              <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                Скасувати
              </button>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '1.75rem' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem' }}>Загальний рахунок</div>
            {[
              { label: `Тариф ${currentPlan.name}`, value: `$${currentPlan.price}` },
              ...activeAddons.filter(a => a.active).map(a => ({ label: a.name, value: `$${a.price}` })),
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13 }}>
                <span style={{ color: '#666' }}>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: 16, fontWeight: 700 }}>
              <span>Разом</span>
              <span style={{ color: '#534AB7' }}>${currentPlan.price + totalAddons}</span>
            </div>
          </div>
        </div>
      )}

      {view === 'plans' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ background: '#fff', border: plan.id === 'growth' ? '2px solid #534AB7' : '1px solid #ebebeb', borderRadius: 16, padding: '1.75rem', position: 'relative' }}>
              {plan.id === 'growth' && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#534AB7', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 16px', borderRadius: 20 }}>Ваш тариф</div>}
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#534AB7' }}>${plan.price}<span style={{ fontSize: 14, color: '#888', fontWeight: 400 }}>/міс</span></div>
              <div style={{ margin: '1rem 0', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                {plan.features.map(f => <div key={f} style={{ fontSize: 13, color: '#333', padding: '3px 0', display: 'flex', gap: 6 }}><span style={{ color: '#0F6E56' }}>✓</span>{f}</div>)}
                {plan.missing.map(f => <div key={f} style={{ fontSize: 13, color: '#ccc', padding: '3px 0', display: 'flex', gap: 6 }}><span>—</span>{f}</div>)}
              </div>
              <button style={{ width: '100%', padding: '11px', background: plan.id === 'growth' ? '#f5f5f7' : '#534AB7', color: plan.id === 'growth' ? '#888' : '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: plan.id === 'growth' ? 'default' : 'pointer' }}>
                {plan.id === 'growth' ? 'Поточний тариф' : 'Перейти'}
              </button>
            </div>
          ))}
        </div>
      )}

      {view === 'addons' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {activeAddons.map(addon => (
            <div key={addon.id} style={{ background: '#fff', border: `1px solid ${addon.active ? '#534AB7' : '#ebebeb'}`, borderRadius: 14, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{addon.name}</div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{addon.description}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#534AB7' }}>${addon.price}/міс</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: addon.active ? '#534AB7' : '#e5e5e5', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }} onClick={() => toggleAddon(addon.id)}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: addon.active ? 22 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px #0002' }} />
                </div>
                <span style={{ fontSize: 11, color: addon.active ? '#0F6E56' : '#aaa', fontWeight: 600 }}>{addon.active ? 'Активний' : 'Вимкнений'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'invoices' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Рахунок', 'Дата', 'Тариф', 'Сума', 'Статус', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={inv.id} style={{ borderBottom: i < invoices.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 13, color: '#534AB7' }}>{inv.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{inv.date}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{inv.plan}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>${inv.amount}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#E1F5EE', color: '#0F6E56', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>Оплачено</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

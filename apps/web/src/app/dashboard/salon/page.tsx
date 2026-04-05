'use client'
export default function SalonPage() {
  return (
    <div className="animate-fadeIn">
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>💇 Салон краси</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Записи, послуги, майстри — використовує той самий API що і СПА (/api/spa) з module=salon</p>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💇</div>
        <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Модуль Салон</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Аналогічний до СПА — записи та управління майстрами</p>
      </div>
    </div>
  )
}

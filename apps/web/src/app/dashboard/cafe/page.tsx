'use client'
import { useState } from 'react'

const menuItems = [
  { id: 1, name: 'Еспресо', category: 'Кава', price: 65, available: true },
  { id: 2, name: 'Американо', category: 'Кава', price: 75, available: true },
  { id: 3, name: 'Капучино', category: 'Кава', price: 95, available: true },
  { id: 4, name: 'Флет Вайт', category: 'Кава', price: 110, available: true },
  { id: 5, name: 'Раф', category: 'Кава', price: 125, available: true },
  { id: 6, name: 'Зелений чай', category: 'Чай', price: 85, available: true },
  { id: 7, name: 'Чай з м\'ятою', category: 'Чай', price: 90, available: true },
  { id: 8, name: 'Круасан', category: 'Випічка', price: 80, available: true },
  { id: 9, name: 'Чізкейк', category: 'Десерти', price: 150, available: true },
  { id: 10, name: 'Тирамісу', category: 'Десерти', price: 160, available: false },
  { id: 11, name: 'IPA крафт', category: 'Пиво', price: 130, available: true },
  { id: 12, name: 'Просекко (бокал)', category: 'Вино', price: 180, available: true },
]

const orders = [
  { id: 'O001', table: 3, items: ['Капучино x2', 'Круасан'], total: 270, status: 'ready', time: '10:12' },
  { id: 'O002', table: 7, items: ['Флет Вайт', 'Чізкейк'], total: 260, status: 'preparing', time: '10:18' },
  { id: 'O003', table: 1, items: ['Американо x2', 'Тирамісу x2'], total: 470, status: 'new', time: '10:25' },
  { id: 'O004', table: 5, items: ['IPA крафт x2', 'Просекко'], total: 440, status: 'paid', time: '10:05' },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  new:       { label: 'Нове',         color: '#185FA5', bg: '#E6F1FB' },
  preparing: { label: 'Готується',    color: '#854F0B', bg: '#FAEEDA' },
  ready:     { label: 'Готово',       color: '#0F6E56', bg: '#E1F5EE' },
  paid:      { label: 'Оплачено',     color: '#3C3489', bg: '#EEEDFE' },
}

export default function CafePage() {
  const [view, setView] = useState<'orders' | 'menu' | 'new'>('orders')
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([])
  const [table, setTable] = useState('')

  function addToCart(item: typeof menuItems[0]) {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }]
    })
  }

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const categories = [...new Set(menuItems.map(m => m.category))]

  function placeOrder() {
    if (!table || cart.length === 0) return
    alert(`Замовлення для столу ${table} на ₴${total} прийнято!`)
    setCart([])
    setTable('')
    setView('orders')
  }

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>☕ Кафе / Бар</h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Замовлення, меню, каса</p>
        </div>
        <button onClick={() => setView('new')} style={{ background: '#BA7517', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Нове замовлення
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: '1.5rem' }}>
        {[
          { label: 'Замовлень зараз', value: orders.filter(o => o.status !== 'paid').length, color: '#BA7517' },
          { label: 'Готових', value: orders.filter(o => o.status === 'ready').length, color: '#0F6E56' },
          { label: 'Виторг сьогодні', value: `₴${orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.total, 0)}`, color: '#534AB7' },
          { label: 'Позицій в меню', value: menuItems.length, color: '#888' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '1rem' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: '#f5f5f7', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ id: 'orders', label: 'Замовлення' }, { id: 'menu', label: 'Меню' }, { id: 'new', label: '+ Замовити' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id as typeof view)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: view === t.id ? '#fff' : 'transparent',
            color: view === t.id ? '#BA7517' : '#888',
            boxShadow: view === t.id ? '0 1px 4px #0001' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {view === 'orders' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: '#fff', border: `1.5px solid ${o.status === 'ready' ? '#E1F5EE' : o.status === 'new' ? '#E6F1FB' : '#ebebeb'}`, borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Стіл {o.table}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{o.time}</div>
                </div>
                <span style={{ background: statusMap[o.status].bg, color: statusMap[o.status].color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                  {statusMap[o.status].label}
                </span>
              </div>
              <div style={{ marginBottom: 10 }}>
                {o.items.map((item, i) => <div key={i} style={{ fontSize: 13, color: '#555', padding: '2px 0' }}>· {item}</div>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#BA7517' }}>₴{o.total}</span>
                {o.status === 'ready' && <button style={{ background: '#BA7517', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Закрити рахунок</button>}
                {o.status === 'new' && <button style={{ background: '#E6F1FB', color: '#185FA5', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Прийнято</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'menu' && (
        <>
          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#BA7517', marginBottom: 8, borderBottom: '1px solid #f5f5f5', paddingBottom: 6 }}>{cat}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {menuItems.filter(m => m.category === cat).map(item => (
                  <div key={item.id} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 10, padding: '0.875rem', opacity: item.available ? 1 : 0.4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: '#BA7517', fontSize: 13 }}>₴{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {view === 'new' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>Меню</h2>
            {categories.map(cat => (
              <div key={cat} style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: 12, color: '#BA7517', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cat}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                  {menuItems.filter(m => m.category === cat && m.available).map(item => (
                    <button key={item.id} onClick={() => addToCart(item)} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 10, padding: '0.75rem', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#BA7517')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#ebebeb')}
                    >
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontWeight: 700, color: '#BA7517' }}>₴{item.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '1.25rem', height: 'fit-content', position: 'sticky', top: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1rem' }}>Кошик</h2>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#888', marginBottom: 6, display: 'block' }}>Номер столу</label>
              <input type="number" placeholder="Стіл №..." value={table} onChange={e => setTable(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14 }} />
            </div>
            {cart.length === 0 ? (
              <div style={{ color: '#aaa', fontSize: 13, textAlign: 'center', padding: '2rem 0' }}>Додайте страви з меню</div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: 13 }}>{item.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => setCart(c => c.map(i => i.id === item.id ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0))}
                        style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => addToCart(menuItems.find(m => m.id === item.id)!)}
                        style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid #BA7517', background: '#BA7517', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#BA7517', minWidth: 50, textAlign: 'right' }}>₴{item.price * item.qty}</span>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontWeight: 700, fontSize: 16 }}>
                  <span>Разом</span>
                  <span style={{ color: '#BA7517' }}>₴{total}</span>
                </div>
                <button onClick={placeOrder} style={{ width: '100%', marginTop: 12, padding: '12px', background: '#BA7517', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Відправити замовлення
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

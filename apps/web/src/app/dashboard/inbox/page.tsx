'use client'
import { useEffect, useState } from 'react'

interface Message { id: string; channel: string; direction: string; body: string; createdAt: string }
interface Guest { id: string; name: string; phone: string; messages: Message[] }

const CHANNEL_ICON: Record<string, string> = { telegram: '✈️', instagram: '📸', facebook: '👤', viber: '📱', sms: '💬' }

export default function InboxPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inbox`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setGuests).finally(() => setLoading(false))
  }, [])

  async function selectGuest(guest: Guest) {
    setSelectedGuest(guest)
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inbox/${guest.id}`, { headers: { Authorization: `Bearer ${token}` } })
    setMessages(await res.json())
  }

  async function sendMessage() {
    if (!newMsg.trim() || !selectedGuest) return
    const token = localStorage.getItem('accessToken')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inbox/send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId: selectedGuest.id, channel: 'sms', body: newMsg }),
    })
    setNewMsg('')
    selectGuest(selectedGuest)
  }

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', gap: 0, height: 'calc(100vh - 104px)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {/* Guest list */}
      <div style={{ width: 280, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>💬 Inbox</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <p style={{ padding: 20, color: 'var(--text-muted)' }}>Завантаження...</p>
          ) : guests.length === 0 ? (
            <p style={{ padding: 20, color: 'var(--text-muted)' }}>Повідомлень немає</p>
          ) : guests.map(g => (
            <div key={g.id} onClick={() => selectGuest(g)} style={{
              padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
              background: selectedGuest?.id === g.id ? '#7c3aed15' : 'transparent',
              transition: 'background 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
                  {g.name.charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{g.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {g.messages[0]?.body || g.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedGuest ? (
          <>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                {selectedGuest.name.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: 600 }}>{selectedGuest.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{selectedGuest.phone}</p>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {messages.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.direction === 'out' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '70%', padding: '10px 14px', borderRadius: 12,
                    background: m.direction === 'out' ? 'var(--accent-purple)' : 'var(--bg-secondary)',
                    color: m.direction === 'out' ? 'white' : 'var(--text-primary)',
                    fontSize: 14,
                  }}>
                    <p>{m.body}</p>
                    <p style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
                      {CHANNEL_ICON[m.channel] || '💬'} {new Date(m.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
              <input
                value={newMsg} onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Написати повідомлення..."
                style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14 }}
              />
              <button onClick={sendMessage} style={{ padding: '10px 20px', background: 'var(--gradient)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 14 }}>
                Надіслати
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Оберіть гостя для чату
          </div>
        )}
      </div>
    </div>
  )
}

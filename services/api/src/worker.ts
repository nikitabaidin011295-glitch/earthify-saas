import { Worker } from 'bullmq'
import Redis from 'ioredis'
import { prisma } from './lib/db'

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', { maxRetriesPerRequest: null })

const worker = new Worker('notifications', async (job) => {
  const { type, tenantId, guestId, data } = job.data
  const guest = await prisma.guest.findUnique({ where: { id: guestId } })
  if (!guest || guest.optOutAll) return

  const messages: Record<string, string> = {
    booking_confirmed: `✅ ${guest.name}, ваше бронювання підтверджено! Чекаємо ${data?.date || ''}.`,
    booking_reminder_24h: `🔔 Нагадування: завтра ваш заїзд о ${data?.time || ''}.`,
    booking_reminder_2h: `⏰ Через 2 години ваш заїзд!`,
    checkin_done: `🏨 Вітаємо! Ваш номер готовий. Приємного відпочинку!`,
    checkout_reminder: `⏰ Нагадуємо: час виїзду ${data?.time || ''}.`,
    appointment_confirmed: `✅ Запис підтверджено: ${data?.service || ''} — ${data?.date || ''} о ${data?.time || ''}.`,
    appointment_reminder_24h: `🔔 Завтра ваш запис: ${data?.service || ''} о ${data?.time || ''}.`,
    appointment_reminder_1h: `⏰ Через годину ваш запис: ${data?.service || ''}.`,
    appointment_completed: `✨ Дякуємо за відвідування! Чекаємо знову.`,
    payment_link: `💳 Посилання для оплати: ${data?.url || ''}`,
    payment_received: `✅ Оплату отримано! Сума: ₴${data?.amount || 0}.`,
    loyalty_awarded: `⭐ Нараховано ${data?.points || 0} балів! Баланс: ${data?.balance || 0}.`,
    loyalty_level_up: `🎉 Ваш рівень підвищено до "${data?.level || ''}"!`,
    membership_expiring: `⚠️ Абонемент закінчується ${data?.date || ''}. Залишилось: ${data?.remaining || 0}.`,
    review_request: `⭐ Як вам сподобалось? ${data?.reviewUrl || ''}`,
    welcome: `👋 Вітаємо, ${guest.name}! Раді бачити вас вперше.`,
    birthday: `🎂 ${guest.name}, вітаємо з Днем Народження! Знижка 15% на наступне відвідування.`,
    no_show_followup: `Ми помітили що ви не з'явились на запис. Хочете перезаписатись?`,
  }

  const text = messages[type]
  if (!text) return

  await prisma.message.create({
    data: { tenantId, guestId, channel: 'sms', direction: 'out', body: text, isAuto: true, status: 'sent' },
  })
  console.log(`[Worker] ${type} → guest ${guestId}`)
}, { connection })

worker.on('completed', job => console.log(`Job ${job.id} done`))
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed:`, err.message))
console.log('Earthify Worker started')

import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/db'

async function saveMsg(tenantId: string, field: string, value: string, channel: string, body: string, externalId?: string) {
  let guest = await (prisma.guest as any).findFirst({ where: { tenantId, [field]: value } })
  if (!guest) {
    guest = await prisma.guest.create({ data: { tenantId, name: `Гість (${channel})`, phone: '', [field]: value } })
  }
  await prisma.message.create({ data: { tenantId, guestId: guest.id, channel, direction: 'in', body, externalId } })
  await prisma.guest.update({ where: { id: guest.id }, data: { lastVisitAt: new Date() } })
}

async function getFirstTenant() {
  const t = await prisma.tenant.findFirst()
  return t?.id
}

export async function webhookRoutes(fastify: FastifyInstance) {
  fastify.get('/telegram', async (req, reply) => {
    const { token } = req.query as any
    if (token !== process.env.TELEGRAM_WEBHOOK_SECRET) return reply.status(403).send()
    return reply.send('OK')
  })

  fastify.post('/telegram', async (req, reply) => {
    try {
      const b = req.body as any
      const msg = b.message || b.edited_message
      if (!msg) return reply.send({ ok: true })
      const tenantId = await getFirstTenant()
      if (!tenantId) return reply.send({ ok: true })
      await saveMsg(tenantId, 'telegramChatId', String(msg.chat.id), 'telegram', msg.text || '[медіа]', String(msg.message_id))
    } catch (err) { fastify.log.error(err) }
    return reply.send({ ok: true })
  })

  fastify.get('/meta', async (req, reply) => {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query as any
    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) return reply.send(challenge)
    return reply.status(403).send()
  })

  fastify.post('/meta', async (req, reply) => {
    try {
      const b = req.body as any
      for (const entry of b.entry || []) {
        for (const msg of entry.messaging || []) {
          if (!msg.message?.text) continue
          const tenantId = await getFirstTenant()
          if (!tenantId) continue
          await saveMsg(tenantId, 'facebookId', msg.sender.id, 'facebook', msg.message.text, msg.message.mid)
        }
      }
    } catch (err) { fastify.log.error(err) }
    return reply.send({ ok: true })
  })

  fastify.post('/viber', async (req, reply) => {
    try {
      const b = req.body as any
      if (b.event !== 'message') return reply.send({ ok: true })
      const tenantId = await getFirstTenant()
      if (!tenantId) return reply.send({ ok: true })
      await saveMsg(tenantId, 'viberUserId', b.sender?.id, 'viber', b.message?.text || '[медіа]')
    } catch (err) { fastify.log.error(err) }
    return reply.send({ ok: true })
  })

  fastify.post('/liqpay', async (req, reply) => {
    fastify.log.info({ body: req.body }, 'LiqPay webhook')
    return reply.send({ ok: true })
  })
}

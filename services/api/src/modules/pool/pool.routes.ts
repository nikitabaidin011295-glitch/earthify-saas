import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/db'
import crypto from 'crypto'

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/memberships', async (req, reply) => {
    const { tenantId } = req.user
    return reply.send(await prisma.membership.findMany({ where: { tenantId }, include: { guest: true }, orderBy: { createdAt: 'desc' } }))
  })

  fastify.post('/memberships', async (req, reply) => {
    const { tenantId } = req.user
    const b = req.body as any
    const m = await prisma.membership.create({ data: { guestId: b.guestId, tenantId, locationId: b.locationId, type: b.type, visitsTotal: b.visitsTotal, validFrom: new Date(b.validFrom), validUntil: new Date(b.validUntil), qrToken: crypto.randomUUID(), amountPaid: b.amountPaid }, include: { guest: true } })
    return reply.status(201).send(m)
  })

  fastify.post('/validate-qr', async (req, reply) => {
    const { tenantId } = req.user
    const { qrToken } = req.body as any
    const m = await prisma.membership.findFirst({ where: { qrToken, tenantId }, include: { guest: true } })
    if (!m) return reply.send({ valid: false, error: 'QR не знайдено' })
    if (m.status !== 'active') return reply.send({ valid: false, error: 'Абонемент неактивний' })
    if (new Date() > m.validUntil) return reply.send({ valid: false, error: 'Абонемент прострочений' })
    if (m.visitsUsed >= m.visitsTotal) return reply.send({ valid: false, error: 'Всі відвідування використано' })
    return reply.send({ valid: true, membership: m })
  })

  fastify.post('/sessions', async (req, reply) => {
    const { tenantId } = req.user
    const b = req.body as any
    const m = await prisma.membership.findFirst({ where: { id: b.membershipId, tenantId } })
    if (!m) return reply.status(404).send({ error: 'Абонемент не знайдено' })
    const session = await prisma.poolSession.create({ data: { membershipId: b.membershipId, guestId: m.guestId, slotStart: new Date(b.slotStart), slotEnd: new Date(b.slotEnd), lockerCode: b.lockerCode, checkedIn: true } })
    await prisma.membership.update({ where: { id: b.membershipId }, data: { visitsUsed: { increment: 1 } } })
    return reply.status(201).send(session)
  })
}

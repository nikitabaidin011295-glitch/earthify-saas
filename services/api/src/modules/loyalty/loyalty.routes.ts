import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/db'

export async function loyaltyRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/:guestId', async (req, reply) => {
    const { tenantId } = req.user
    const { guestId } = req.params as any
    const guest = await prisma.guest.findFirst({ where: { id: guestId, tenantId }, select: { loyaltyPoints: true, loyaltyLevel: true, name: true } })
    if (!guest) return reply.status(404).send({ error: 'Не знайдено' })
    return reply.send(guest)
  })

  fastify.get('/:guestId/events', async (req, reply) => {
    const { tenantId } = req.user
    const { guestId } = req.params as any
    return reply.send(await prisma.loyaltyEvent.findMany({ where: { guestId, tenantId }, orderBy: { createdAt: 'desc' } }))
  })

  fastify.post('/:guestId/award', async (req, reply) => {
    const { tenantId } = req.user
    const { guestId } = req.params as any
    const { points, description } = req.body as any
    await prisma.$transaction(async (tx) => {
      await tx.loyaltyEvent.create({ data: { guestId, tenantId, points, type: 'award', description: description || '' } })
      const g = await tx.guest.update({ where: { id: guestId }, data: { loyaltyPoints: { increment: points } } })
      const level = g.loyaltyPoints >= 5000 ? 'platinum' : g.loyaltyPoints >= 2000 ? 'gold' : g.loyaltyPoints >= 500 ? 'silver' : 'bronze'
      await tx.guest.update({ where: { id: guestId }, data: { loyaltyLevel: level } })
    })
    return reply.send({ success: true })
  })
}

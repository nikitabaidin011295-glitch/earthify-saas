import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/db'

export async function inboxRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/', async (req, reply) => {
    const { tenantId } = req.user
    return reply.send(await prisma.guest.findMany({ where: { tenantId, messages: { some: {} } }, include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } }, orderBy: { lastVisitAt: 'desc' } }))
  })

  fastify.get('/unread-count', async (req, reply) => {
    const { tenantId } = req.user
    const count = await prisma.message.count({ where: { tenantId, direction: 'in', status: 'sent' } })
    return reply.send({ count })
  })

  fastify.get('/:guestId', async (req, reply) => {
    const { tenantId } = req.user
    const { guestId } = req.params as any
    return reply.send(await prisma.message.findMany({ where: { tenantId, guestId }, orderBy: { createdAt: 'asc' } }))
  })

  fastify.post('/send', async (req, reply) => {
    const { tenantId } = req.user
    const { guestId, channel, body } = req.body as any
    const msg = await prisma.message.create({ data: { tenantId, guestId, channel, direction: 'out', body, status: 'sent' } })
    return reply.status(201).send(msg)
  })
}

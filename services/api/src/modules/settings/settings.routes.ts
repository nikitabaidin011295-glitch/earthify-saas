import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/db'

export async function settingsRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/', async (req, reply) => {
    const { tenantId } = req.user
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } } })
    if (!tenant) return reply.status(404).send({ error: 'Не знайдено' })
    return reply.send(tenant)
  })

  fastify.patch('/', async (req, reply) => {
    const { tenantId } = req.user
    const { name, settings } = req.body as any
    const tenant = await prisma.tenant.update({ where: { id: tenantId }, data: { ...(name && { name }), ...(settings && { settings }) } })
    return reply.send(tenant)
  })

  fastify.patch('/modules', async (req, reply) => {
    const { tenantId } = req.user
    const { modulesEnabled } = req.body as any
    const tenant = await prisma.tenant.update({ where: { id: tenantId }, data: { modulesEnabled } })
    return reply.send({ modulesEnabled: tenant.modulesEnabled })
  })
}

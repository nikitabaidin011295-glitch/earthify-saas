import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/db'

export async function guestRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/', async (req, reply) => {
    const { tenantId } = req.user
    const { search, page = '1', limit = '20' } = req.query as any
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const where: any = { tenantId }
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
    const [guests, total] = await Promise.all([
      prisma.guest.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
      prisma.guest.count({ where }),
    ])
    return reply.send({ guests, total, page: parseInt(page), limit: parseInt(limit) })
  })

  fastify.post('/', async (req, reply) => {
    const { tenantId } = req.user
    const body = req.body as any
    try {
      const guest = await prisma.guest.create({ data: { tenantId, name: body.name, phone: body.phone, email: body.email || '', notes: body.notes || '', tags: body.tags || [] } })
      return reply.status(201).send(guest)
    } catch (err: any) {
      if (err.code === 'P2002') return reply.status(409).send({ error: 'Гість з таким телефоном вже існує' })
      return reply.status(500).send({ error: 'Помилка сервера' })
    }
  })

  fastify.get('/:id', async (req, reply) => {
    const { tenantId } = req.user
    const { id } = req.params as any
    const guest = await prisma.guest.findFirst({
      where: { id, tenantId },
      include: { visits: { orderBy: { createdAt: 'desc' }, take: 10 }, loyaltyEvents: { orderBy: { createdAt: 'desc' }, take: 10 }, appointments: { orderBy: { createdAt: 'desc' }, take: 10, include: { service: true } }, roomBookings: { orderBy: { createdAt: 'desc' }, take: 5 }, messages: { orderBy: { createdAt: 'desc' }, take: 20 } },
    })
    if (!guest) return reply.status(404).send({ error: 'Гостя не знайдено' })
    return reply.send(guest)
  })

  fastify.patch('/:id', async (req, reply) => {
    const { tenantId } = req.user
    const { id } = req.params as any
    const r = await prisma.guest.updateMany({ where: { id, tenantId }, data: req.body as any })
    if (r.count === 0) return reply.status(404).send({ error: 'Гостя не знайдено' })
    return reply.send({ success: true })
  })

  fastify.delete('/:id', async (req, reply) => {
    const { tenantId } = req.user
    const { id } = req.params as any
    await prisma.guest.deleteMany({ where: { id, tenantId } })
    return reply.send({ success: true })
  })
}

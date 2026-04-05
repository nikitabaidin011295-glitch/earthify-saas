import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/db'

export async function spaRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/services', async (req, reply) => {
    const { tenantId } = req.user
    const { module = 'spa' } = req.query as any
    return reply.send(await prisma.service.findMany({ where: { tenantId, module, active: true }, orderBy: { name: 'asc' } }))
  })

  fastify.post('/services', async (req, reply) => {
    const { tenantId } = req.user
    const b = req.body as any
    const s = await prisma.service.create({ data: { tenantId, locationId: b.locationId, module: b.module || 'spa', name: b.name, description: b.description || '', durationMin: b.durationMin, price: b.price, category: b.category || '' } })
    return reply.status(201).send(s)
  })

  fastify.get('/staff', async (req, reply) => {
    const { tenantId } = req.user
    return reply.send(await prisma.staff.findMany({ where: { tenantId, active: true }, orderBy: { name: 'asc' } }))
  })

  fastify.get('/slots', async (req, reply) => {
    const { serviceId, staffId, date } = req.query as any
    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!service) return reply.status(404).send({ error: 'Послугу не знайдено' })
    const dayStart = new Date(date); dayStart.setHours(9, 0, 0, 0)
    const dayEnd = new Date(date); dayEnd.setHours(20, 0, 0, 0)
    const existing = await prisma.appointment.findMany({ where: { staffId, startAt: { gte: dayStart, lte: dayEnd }, status: { not: 'cancelled' } }, orderBy: { startAt: 'asc' } })
    const slots: any[] = []
    let cur = new Date(dayStart)
    while (cur < dayEnd) {
      const end = new Date(cur.getTime() + Number(service.durationMin) * 60000)
      if (end > dayEnd) break
      const busy = existing.some(a => (cur >= a.startAt && cur < a.endAt) || (end > a.startAt && end <= a.endAt))
      slots.push({ start: cur.toISOString(), end: end.toISOString(), available: !busy })
      cur = new Date(cur.getTime() + 30 * 60000)
    }
    return reply.send(slots)
  })

  fastify.get('/appointments', async (req, reply) => {
    const { tenantId } = req.user
    const { date, staffId, status } = req.query as any
    const where: any = { tenantId }
    if (staffId) where.staffId = staffId
    if (status) where.status = status
    if (date) { const d = new Date(date), n = new Date(d); n.setDate(d.getDate()+1); where.startAt = { gte: d, lt: n } }
    return reply.send(await prisma.appointment.findMany({ where, orderBy: { startAt: 'asc' }, include: { guest: true, service: true, staff: true } }))
  })

  fastify.post('/appointments', async (req, reply) => {
    const { tenantId } = req.user
    const b = req.body as any
    const service = await prisma.service.findUnique({ where: { id: b.serviceId } })
    if (!service) return reply.status(404).send({ error: 'Послугу не знайдено' })
    const startAt = new Date(b.startAt)
    const endAt = new Date(startAt.getTime() + Number(service.durationMin) * 60000)
    const a = await prisma.appointment.create({ data: { tenantId, guestId: b.guestId, staffId: b.staffId, serviceId: b.serviceId, startAt, endAt, amount: service.price, notes: b.notes || '' }, include: { guest: true, service: true, staff: true } })
    return reply.status(201).send(a)
  })

  fastify.patch('/appointments/:id/status', async (req, reply) => {
    const { tenantId } = req.user
    const { id } = req.params as any
    const { status } = req.body as any
    await prisma.appointment.updateMany({ where: { id, tenantId }, data: { status } })
    return reply.send({ success: true })
  })
}

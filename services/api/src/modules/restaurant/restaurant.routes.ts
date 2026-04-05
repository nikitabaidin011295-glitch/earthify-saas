import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/db'
import crypto from 'crypto'

export async function restaurantRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/tables', async (req, reply) => {
    const { tenantId } = req.user
    return reply.send(await prisma.table.findMany({ where: { location: { tenantId }, active: true }, orderBy: { number: 'asc' } }))
  })

  fastify.post('/tables', async (req, reply) => {
    const b = req.body as any
    return reply.status(201).send(await prisma.table.create({ data: { locationId: b.locationId, number: b.number, capacity: b.capacity, zone: b.zone || 'main', qrToken: crypto.randomUUID() } }))
  })

  fastify.get('/bookings', async (req, reply) => {
    const { tenantId } = req.user
    const { date } = req.query as any
    const where: any = { tenantId }
    if (date) { const d = new Date(date), n = new Date(d); n.setDate(d.getDate()+1); where.date = { gte: d, lt: n } }
    return reply.send(await prisma.tableBooking.findMany({ where, orderBy: { date: 'asc' }, include: { guest: true, table: true } }))
  })

  fastify.post('/bookings', async (req, reply) => {
    const { tenantId } = req.user
    const b = req.body as any
    return reply.status(201).send(await prisma.tableBooking.create({ data: { tenantId, tableId: b.tableId, guestId: b.guestId, date: new Date(b.date), time: b.time, guestsCount: b.guestsCount, allergens: b.allergens || [], notes: b.notes || '' }, include: { guest: true, table: true } }))
  })

  fastify.get('/menu', async (req, reply) => {
    const { tenantId } = req.user
    const { locationId } = req.query as any
    const where: any = locationId ? { locationId } : { location: { tenantId } }
    return reply.send(await prisma.menuItem.findMany({ where, orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] }))
  })

  fastify.post('/menu', async (req, reply) => {
    const b = req.body as any
    return reply.status(201).send(await prisma.menuItem.create({ data: { locationId: b.locationId, name: b.name, description: b.description || '', price: b.price, category: b.category, allergens: b.allergens || [] } }))
  })

  fastify.patch('/menu/:id/toggle', async (req, reply) => {
    const { id } = req.params as any
    const item = await prisma.menuItem.findUnique({ where: { id } })
    if (!item) return reply.status(404).send({ error: 'Не знайдено' })
    await prisma.menuItem.update({ where: { id }, data: { available: !item.available } })
    return reply.send({ success: true })
  })

  fastify.get('/orders', async (req, reply) => {
    const { tenantId } = req.user
    const { status } = req.query as any
    const where: any = { location: { tenantId } }
    if (status) where.status = status
    return reply.send(await prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, include: { guest: true, table: true } }))
  })

  fastify.post('/orders', async (req, reply) => {
    const b = req.body as any
    const items = Array.isArray(b.items) ? b.items : []
    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.qty, 0)
    return reply.status(201).send(await prisma.order.create({ data: { locationId: b.locationId, tableId: b.tableId, guestId: b.guestId, roomBookingId: b.roomBookingId, items: b.items, subtotal, tip: b.tip || 0, total: subtotal + (b.tip || 0) }, include: { guest: true, table: true } }))
  })

  fastify.patch('/orders/:id/status', async (req, reply) => {
    const { id } = req.params as any
    const { status } = req.body as any
    await prisma.order.update({ where: { id }, data: { status } })
    return reply.send({ success: true })
  })
}

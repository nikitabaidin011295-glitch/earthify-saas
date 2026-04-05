import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/db'

export async function hotelRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/rooms', async (req, reply) => {
    const { tenantId } = req.user
    const rooms = await prisma.room.findMany({ where: { location: { tenantId }, active: true }, orderBy: [{ floor: 'asc' }, { number: 'asc' }] })
    return reply.send(rooms)
  })

  fastify.get('/bookings', async (req, reply) => {
    const { tenantId } = req.user
    const { status, page = '1', limit = '20' } = req.query as any
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const where: any = { tenantId }
    if (status) where.status = status
    const [bookings, total] = await Promise.all([
      prisma.roomBooking.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' }, include: { guest: true, room: true } }),
      prisma.roomBooking.count({ where }),
    ])
    return reply.send({ bookings, total })
  })

  fastify.post('/bookings', async (req, reply) => {
    const { tenantId } = req.user
    const body = req.body as any
    const booking = await prisma.roomBooking.create({
      data: { tenantId, roomId: body.roomId, guestId: body.guestId, checkIn: new Date(body.checkIn), checkOut: new Date(body.checkOut), guestsCount: body.guestsCount || 1, totalAmount: body.totalAmount, notes: body.notes || '' },
      include: { guest: true, room: true },
    })
    return reply.status(201).send(booking)
  })

  fastify.patch('/bookings/:id/checkin', async (req, reply) => {
    const { tenantId } = req.user
    const { id } = req.params as any
    await prisma.roomBooking.updateMany({ where: { id, tenantId }, data: { status: 'checked_in' } })
    return reply.send({ success: true })
  })

  fastify.patch('/bookings/:id/checkout', async (req, reply) => {
    const { tenantId } = req.user
    const { id } = req.params as any
    await prisma.roomBooking.updateMany({ where: { id, tenantId }, data: { status: 'checked_out' } })
    return reply.send({ success: true })
  })

  fastify.patch('/bookings/:id/cancel', async (req, reply) => {
    const { tenantId } = req.user
    const { id } = req.params as any
    await prisma.roomBooking.updateMany({ where: { id, tenantId }, data: { status: 'cancelled' } })
    return reply.send({ success: true })
  })

  fastify.patch('/rooms/:id/status', async (req, reply) => {
    const { tenantId } = req.user
    const { id } = req.params as any
    const { status } = req.body as any
    await prisma.room.updateMany({ where: { id, location: { tenantId } }, data: { status } })
    return reply.send({ success: true })
  })
}

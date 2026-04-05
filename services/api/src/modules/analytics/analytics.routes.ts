import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/db'

export async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/dashboard', async (req, reply) => {
    const { tenantId } = req.user
    const today = new Date(); today.setHours(0,0,0,0)
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1)
    const [totalGuests, newToday, totalBookings, checkinsToday, checkoutsToday, messages] = await Promise.all([
      prisma.guest.count({ where: { tenantId } }),
      prisma.guest.count({ where: { tenantId, createdAt: { gte: today } } }),
      prisma.roomBooking.count({ where: { tenantId } }),
      prisma.roomBooking.count({ where: { tenantId, checkIn: { gte: today, lt: tomorrow }, status: 'confirmed' } }),
      prisma.roomBooking.count({ where: { tenantId, checkOut: { gte: today, lt: tomorrow }, status: 'checked_in' } }),
      prisma.message.count({ where: { tenantId, direction: 'in', createdAt: { gte: today } } }),
    ])
    return reply.send({ guests: { total: totalGuests, newToday }, bookings: { total: totalBookings, checkinsToday, checkoutsToday }, messages: { inboundToday: messages } })
  })

  fastify.get('/revenue', async (req, reply) => {
    const { tenantId } = req.user
    const { period = '30d' } = req.query as any
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const since = new Date(); since.setDate(since.getDate() - days)
    const txs = await prisma.transaction.findMany({ where: { tenantId, createdAt: { gte: since }, status: 'paid' }, select: { amount: true, module: true, createdAt: true } })
    const byModule: Record<string, number> = {}
    let total = 0
    for (const t of txs) { byModule[t.module] = (byModule[t.module] || 0) + Number(t.amount); total += Number(t.amount) }
    return reply.send({ total, byModule, period })
  })

  fastify.get('/guests', async (req, reply) => {
    const { tenantId } = req.user
    const levels = await prisma.guest.groupBy({ by: ['loyaltyLevel'], where: { tenantId }, _count: { id: true } })
    return reply.send({ levels })
  })
}

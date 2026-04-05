import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './modules/auth/auth.routes'
import { guestRoutes } from './modules/guests/guest.routes'
import { hotelRoutes } from './modules/hotel/hotel.routes'
import { spaRoutes } from './modules/spa/spa.routes'
import { poolRoutes } from './modules/pool/pool.routes'
import { restaurantRoutes } from './modules/restaurant/restaurant.routes'
import { inboxRoutes } from './modules/inbox/inbox.routes'
import { settingsRoutes } from './modules/settings/settings.routes'
import { loyaltyRoutes } from './modules/loyalty/loyalty.routes'
import { analyticsRoutes } from './modules/analytics/analytics.routes'
import { liqpayRoutes } from './modules/liqpay/liqpay.routes'
import { webhookRoutes } from './modules/webhooks/webhook.routes'

const app = Fastify({ logger: true })
const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production'

const allowedOrigins = (process.env.CORS_ORIGIN || '*').split(',').map(o => o.trim()).filter(Boolean)

app.register(cors, {
  origin: (origin: string | undefined, cb: (err: Error | null, allow: boolean) => void) => {
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes('*')) return cb(null, true)
    if (allowedOrigins.length === 0) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    return cb(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(jwt, { secret: jwtSecret })

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try { await request.jwtVerify() }
  catch { reply.status(401).send({ error: 'Unauthorized' }) }
})

app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString(), service: 'earthify-api', version: '1.0.0' }))
app.get('/', async () => ({ message: 'Earthify API', health: '/health', version: '1.0.0' }))

app.register(authRoutes, { prefix: '/api/auth' })
app.register(guestRoutes, { prefix: '/api/guests' })
app.register(hotelRoutes, { prefix: '/api/hotel' })
app.register(spaRoutes, { prefix: '/api/spa' })
app.register(poolRoutes, { prefix: '/api/pool' })
app.register(restaurantRoutes, { prefix: '/api/restaurant' })
app.register(inboxRoutes, { prefix: '/api/inbox' })
app.register(settingsRoutes, { prefix: '/api/settings' })
app.register(loyaltyRoutes, { prefix: '/api/loyalty' })
app.register(analyticsRoutes, { prefix: '/api/analytics' })
app.register(liqpayRoutes, { prefix: '/api/liqpay' })
app.register(webhookRoutes, { prefix: '/webhooks' })

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 8080
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`Earthify API running on port ${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()

import { FastifyInstance } from 'fastify'
import { registerSchema, loginSchema, refreshSchema } from './auth.schema'
import { registerService, loginService, saveRefreshToken, validateRefreshToken, deleteRefreshToken, getMeService } from './auth.service'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (req, reply) => {
    try {
      const body = registerSchema.parse(req.body)
      const { tenant, user } = await registerService(body)
      const accessToken = fastify.jwt.sign({ userId: user.id, tenantId: tenant.id, role: user.role }, { expiresIn: '15m' })
      const refreshToken = fastify.jwt.sign({ userId: user.id }, { expiresIn: '30d' })
      await saveRefreshToken(user.id, refreshToken)
      return reply.status(201).send({
        accessToken, refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug, plan: tenant.plan, modulesEnabled: tenant.modulesEnabled },
      })
    } catch (err: any) {
      if (err.message === 'EMAIL_EXISTS') return reply.status(409).send({ error: 'Email вже використовується' })
      if (err.name === 'ZodError') return reply.status(400).send({ error: 'Невірні дані', details: err.errors })
      fastify.log.error(err)
      return reply.status(500).send({ error: 'Помилка сервера', details: err.message })
    }
  })

  fastify.post('/login', async (req, reply) => {
    try {
      const body = loginSchema.parse(req.body)
      const { user, tenant } = await loginService(body)
      const accessToken = fastify.jwt.sign({ userId: user.id, tenantId: tenant.id, role: user.role }, { expiresIn: '15m' })
      const refreshToken = fastify.jwt.sign({ userId: user.id }, { expiresIn: '30d' })
      await saveRefreshToken(user.id, refreshToken)
      return reply.send({
        accessToken, refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug, plan: tenant.plan, modulesEnabled: tenant.modulesEnabled },
      })
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') return reply.status(401).send({ error: 'Невірний email або пароль' })
      if (err.message === 'ACCOUNT_DISABLED') return reply.status(403).send({ error: 'Акаунт заблоковано' })
      return reply.status(500).send({ error: 'Помилка сервера', details: err.message })
    }
  })

  fastify.post('/refresh', async (req, reply) => {
    try {
      const { refreshToken } = refreshSchema.parse(req.body)
      const decoded = fastify.jwt.verify<{ userId: string }>(refreshToken)
      if (!await validateRefreshToken(decoded.userId, refreshToken)) return reply.status(401).send({ error: 'Невірний refresh token' })
      const user = await getMeService(decoded.userId)
      return reply.send({ accessToken: fastify.jwt.sign({ userId: user.id, tenantId: user.tenantId, role: user.role }, { expiresIn: '15m' }) })
    } catch { return reply.status(401).send({ error: 'Невірний токен' }) }
  })

  fastify.post('/logout', { onRequest: [fastify.authenticate] }, async (req, reply) => {
    await deleteRefreshToken(req.user.userId)
    return reply.send({ message: 'Вийшли успішно' })
  })

  fastify.get('/me', { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const me = await getMeService(req.user.userId)
      return reply.send({
        id: me.id, name: me.name, email: me.email, role: me.role,
        tenant: { id: me.tenant.id, name: me.tenant.name, slug: me.tenant.slug, plan: me.tenant.plan, modulesEnabled: me.tenant.modulesEnabled, settings: me.tenant.settings, subscription: me.tenant.subscriptions[0] || null },
      })
    } catch { return reply.status(404).send({ error: 'Не знайдено' }) }
  })
}

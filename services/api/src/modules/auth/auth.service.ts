import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/db'
import { redis } from '../../lib/redis'
import type { RegisterInput, LoginInput } from './auth.schema'

const ALL_MODULES = ['core','hotel','spa','salon','pool','restaurant','cafe']
const REFRESH_TTL = 30 * 24 * 60 * 60
const fallback = new Map<string, { token: string; exp: number }>()

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').substring(0,50)
}
async function uniqueSlug(name: string) {
  const base = slugify(name); let slug = base, i = 1
  while (await prisma.tenant.findUnique({ where: { slug } })) slug = `${base}-${i++}`
  return slug
}

export async function registerService(data: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw new Error('EMAIL_EXISTS')
  const passwordHash = await bcrypt.hash(data.password, 12)
  return prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({ data: {
      name: data.businessName, slug: await uniqueSlug(data.businessName),
      plan: 'starter', modulesEnabled: ALL_MODULES,
      settings: { timezone:'Europe/Kyiv', currency:'UAH', language:'uk', loyaltyRate:10 },
    }})
    const user = await tx.user.create({ data: {
      tenantId: tenant.id, email: data.email, passwordHash, role: 'owner', name: data.name,
    }})
    await tx.subscription.create({ data: {
      tenantId: tenant.id, plan: 'starter', modules: ALL_MODULES,
      amount: 0, currency: 'USD', status: 'trialing',
      trialEndsAt: new Date(Date.now() + 14*24*60*60*1000),
    }})
    return { tenant, user }
  })
}

export async function loginService(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email }, include: { tenant: true } })
  if (!user) throw new Error('INVALID_CREDENTIALS')
  if (!user.active) throw new Error('ACCOUNT_DISABLED')
  const valid = await bcrypt.compare(data.password, user.passwordHash)
  if (!valid) throw new Error('INVALID_CREDENTIALS')
  return { user, tenant: user.tenant }
}

export async function saveRefreshToken(userId: string, token: string) {
  try { await redis.set(`refresh:${userId}`, token, 'EX', REFRESH_TTL) }
  catch { fallback.set(userId, { token, exp: Date.now() + REFRESH_TTL*1000 }) }
}
export async function validateRefreshToken(userId: string, token: string) {
  try { const s = await redis.get(`refresh:${userId}`); if (s) return s === token } catch {}
  const e = fallback.get(userId)
  return !!e && e.exp > Date.now() && e.token === token
}
export async function deleteRefreshToken(userId: string) {
  fallback.delete(userId)
  try { await redis.del(`refresh:${userId}`) } catch {}
}
export async function getMeService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { tenant: { include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } } } },
  })
  if (!user) throw new Error('USER_NOT_FOUND')
  return user
}

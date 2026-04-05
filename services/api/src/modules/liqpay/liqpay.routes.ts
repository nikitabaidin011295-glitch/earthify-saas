import { FastifyInstance } from 'fastify'
import crypto from 'crypto'

function sign(data: string, key: string) {
  return crypto.createHash('sha1').update(key + data + key).digest('base64')
}

export async function liqpayRoutes(fastify: FastifyInstance) {
  fastify.post('/generate-link', { onRequest: [fastify.authenticate] }, async (req, reply) => {
    const pub = process.env.LIQPAY_PUBLIC_KEY
    const priv = process.env.LIQPAY_PRIVATE_KEY
    if (!pub || !priv) return reply.status(500).send({ error: 'LiqPay не налаштовано' })
    const b = req.body as any
    const params = { version: 3, public_key: pub, action: 'pay', amount: b.amount, currency: b.currency || 'UAH', description: b.description, order_id: b.orderId, result_url: b.resultUrl || process.env.ADMIN_APP_URL, server_url: `${process.env.API_URL}/webhooks/liqpay`, sandbox: process.env.NODE_ENV !== 'production' ? 1 : 0 }
    const data = Buffer.from(JSON.stringify(params)).toString('base64')
    const signature = sign(data, priv)
    return reply.send({ url: `https://www.liqpay.ua/api/3/checkout?data=${data}&signature=${signature}` })
  })

  fastify.post('/callback', async (req, reply) => {
    const priv = process.env.LIQPAY_PRIVATE_KEY
    if (!priv) return reply.status(500).send({ error: 'Not configured' })
    const { data, signature } = req.body as any
    if (sign(data, priv) !== signature) return reply.status(400).send({ error: 'Invalid signature' })
    const decoded = JSON.parse(Buffer.from(data, 'base64').toString())
    fastify.log.info({ liqpay: decoded }, 'LiqPay callback received')
    return reply.send({ ok: true })
  })
}

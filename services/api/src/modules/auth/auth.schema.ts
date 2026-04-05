import { z } from 'zod'
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  businessName: z.string().min(2),
  businessType: z.enum(['hotel','spa','salon','pool','restaurant','cafe']).default('hotel'),
})
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) })
export const refreshSchema = z.object({ refreshToken: z.string() })
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

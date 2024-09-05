import { z } from 'zod'

export const environmentSchema = z.enum(['test', 'development', 'production'])

export const databaseSchema = z.object({
  host: z.string(),
  database: z.string(),
  password: z.string(),
  port: z.coerce.number(),
  url: z.string(),
  username: z.string(),
})

export const configSchema = z.object({
  env: environmentSchema,
  port: z.coerce.number().positive().int(),
  database: databaseSchema,
  jwt: z.object({
    secret: z.string(),
  }),
})

import { ConfigException } from './config.exception'
import { configSchema } from './config.schema'
import { Config } from './config.type'

export const factory = (): Config => {
  const result = configSchema.safeParse({
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      url: process.env.DATABASE_URL,
      username: process.env.DATABASE_USERNAME,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  })

  if (result.success) {
    return result.data
  }

  throw new ConfigException(`Invalid application configuration: ${result.error.message}`)
}

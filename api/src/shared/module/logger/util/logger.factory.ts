import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston'
import { createLogger, format, transports } from 'winston'

export const initLogger = (appName: string) => {
  const env = process.env.NODE_ENV
  const consoleFormat = format.combine(
    format.timestamp(),
    format.ms(),
    nestWinstonModuleUtilities.format.nestLike(appName, {
      colors: !process.env.NO_COLOR,
      prettyPrint: true,
    }),
  )

  const serverFormat = format.combine(format.timestamp(), format.ms(), format.json())

  return createLogger({
    level: env === 'test' ? 'silent' : 'info',
    defaultMeta: { environment: env },
    transports: [
      new transports.Console({
        format: env === 'development' ? consoleFormat : serverFormat,
      }),
    ],
  })
}

/**
 *
 * LoggerFactory is used only in the Nest.js main to replace Nest.js default logger.
 * But in the App we use the AppLogger instance due to the Dependency Injection.
 */
export const LoggerFactory = (appName: string) =>
  WinstonModule.createLogger(initLogger(appName))

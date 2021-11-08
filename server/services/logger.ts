import dotenv from 'dotenv'
import winston from 'winston'
import 'winston-mongodb'

dotenv.config()

const getTransports = () => {
  if (process.env.NODE_ENV === 'test') {
    return [
      new winston.transports.File({ filename: 'test.log', format: fileFormat }),
      new winston.transports.MongoDB({ db: (process.env.TEST_MONGO_URI + 'testlogs') as string, options: { useUnifiedTopology: true } }),
    ]
  } else if (process.env.NODE_ENV === 'production') {
    return [
      new winston.transports.Console({ format: consoleFormat }),
      new winston.transports.File({ filename: 'app.log', format: fileFormat }),
      new winston.transports.MongoDB({ db: process.env.MONGO_URI as string, options: { useUnifiedTopoplogy: true } }),
    ]
  } else {
    return [
      new winston.transports.Console({ format: consoleFormat }),
      new winston.transports.File({ filename: 'dev.log', format: fileFormat }),
      new winston.transports.MongoDB({ db: process.env.MONGO_URI as string, options: { useUnifiedTopoplogy: true } }),
    ]
  }
}

const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(log => {
    return winston.format
      .colorize()
      .colorize(
        log.level,
        `${new Date(log.timestamp).toDateString()} ${new Date(log.timestamp).toLocaleTimeString('fi-FI', { hour12: false })} [ ${
          log.level
        } ]\t${log.message}`
      )
  })
)

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(log => {
    return `${new Date(log.timestamp).toDateString()} ${new Date(log.timestamp).toLocaleTimeString('fi-FI', {
      hour12: false,
    })} [ ${log.level} ]\t${log.message}`
  })
)

export const logger = winston.createLogger({
  transports: getTransports(),
})

// Set up logging levels
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug'
} else {
  logger.level = 'info'
}

export default logger

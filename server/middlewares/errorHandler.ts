import { Response } from 'express'
import { logger } from '../services/logger'

export const errorHandler = (err: any, _, res: Response, next) => {
  logger.error(err.errorMessage, { metadata: { err } })
  res.status(err.status).sendResponse({ message: err.errorMessage, payload: err.payload })
}

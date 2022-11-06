import { NextFunction, Request, Response } from 'express'
import logger from '../services/logger'

const loggerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url} from ${req.ip}`)
  next()
}

export default loggerMiddleware

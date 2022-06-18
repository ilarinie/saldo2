import { NextFunction, Request } from 'express'
import logger from '../services/logger'

const loggerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(req.ip)
  next()
}

export default loggerMiddleware

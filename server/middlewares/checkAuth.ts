import logger from '../services/logger'
import * as UserService from '../services/UserService'

const checkAuth = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.user = await UserService.findOrCreateTestUser()
  }
  if (req.user) {
    next()
  } else {
    logger.error(`Unauthorized request to ${req.path} from ${req.ip}`, {
      metadata: {
        ip: req.ip,
      },
    })
    res.status(401).send('Unauthorized biatch')
  }
}

export default checkAuth

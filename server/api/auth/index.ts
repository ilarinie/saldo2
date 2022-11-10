import { Express } from 'express'
import passport from 'passport'
import checkAuth from 'server/middlewares/checkAuth'
import logger from 'server/services/logger'
import type { Handler } from './Handler'


namespace AuthController {
  export const authenticateWithGoogleOauth: Handler = (req, res, next) => {
    passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'],
    })(req, res, next)
  }
  export const googleCallback: Handler = [
    passport.authenticate('google', {
      failureRedirect: '/',
      successRedirect: '/',
    }),
    (_, res) => {
      res.redirect('/')
    },
  ]
  export const logout: Handler = (req, res) => {
    req.logout((err) => logger.error(JSON.stringify(err, null, 2)))
    res.redirect('/')
  }
  export const checkLogin: Handler = (req, res) => {
    res.sendResponse({ message: 'Logged in', payload: req.user })
  }
}

export default (app: Express, baseUrl: string) => {
  app.get(`${baseUrl}/google`, AuthController.authenticateWithGoogleOauth)
  app.get(`${baseUrl}/google/callback`, AuthController.googleCallback)
  app.get(`${baseUrl}/logout`, AuthController.logout)
  app.get(`${baseUrl}/checklogin`, checkAuth, AuthController.checkLogin)
}

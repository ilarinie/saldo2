import { Express } from 'express'
import passport from 'passport'
import checkAuth from 'server/middlewares/checkAuth'
import logger from 'server/services/logger'

namespace AuthController {
  export const authenticateWithGoogleOauth = (req, res, next) => {
    passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'],
    })(req, res, next)
  }
  export const googleCallback = [passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/')
  }]


  export const logout = (req, res) => {
    req.logout()
    res.redirect('/')
  }


  export const checkLogin = (req, res) => {
    res.sendResponse({ message: 'Logged in', payload: req.user })
  }
}

export default (app: Express, baseUrl: string) => {
  app.get(`${baseUrl}/google`, AuthController.authenticateWithGoogleOauth)
  app.get(`${baseUrl}/google/callback`, AuthController.googleCallback)
  app.get(`${baseUrl}/logout`, AuthController.logout)
  app.get(`${baseUrl}/checklogin`, checkAuth, AuthController.checkLogin)
}

import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import path from 'path'
import WebSocket from 'ws'
import { auth, budgets, purchases } from './api'
import checkAuth from './middlewares/checkAuth'
import { errorHandler } from './middlewares/errorHandler'
import logger from './services/logger'
import passport from './services/passport'

dotenv.config()

const app = express()

app.use(
  cookieSession({
    secret: 'asdasdasd',
  })
)

app.use(passport.initialize())
app.use(passport.session())

const server = http.createServer(app)

const wss = new WebSocket.Server({ server, path: '/ws' })

app.use((req, res, next) => {
  req.wss = wss
  res.sendResponse = res.send
  next()
})

wss.on('connection', (ws, socket, request) => {
  logger.debug('Websocket connection opened')
  ws.isAlive = true
  ws.on('pong', () => {
    ws.isAlive = true
  })
})
app.get('/api', (req, res) => {
  res.send('Server running A-OK')
})

app.use(bodyParser.json())

auth(app, '/api/auth')

if (process.env.NODE_ENV === 'production') {
  logger.info('Serving client')
  app.use(express.static(path.resolve(__dirname, './public')))

  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, './public', 'index.html'))
  })
} else {
  app.post('*', (req, res) => res.status(404).send('foo'))
}

app.use(checkAuth)
purchases(app, '/api/purchases')
budgets(app, '/api/budgets')

app.use(errorHandler)

export { server, app, wss }

import WebSocket from 'ws'
import { WebsocketMessageType } from 'types'
import logger from '../services/logger'

export const sendWebscoketData = async (wss: WebSocket.Server, data: WebsocketMessageType) => {
  try {
    logger.info(`${wss.clients.size} WS clients found`)
    wss.clients.forEach((ws: any) => {
      if (!ws.isAlive) return ws.terminate()
      ws.isAlive = false
      ws.ping(null, false)
      logger.info('Sending websocket message to to WS client')
      ws.send(JSON.stringify({ data }))
    })
  } catch (err) {
    logger.error(`Error sending message via websocket ${err}`, { metadata: err })
  }
}

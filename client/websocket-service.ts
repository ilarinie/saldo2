import { budgetApi } from './store/budgetApi'
import { store } from './store/store'

export class WebsocketService {
  ws?: WebSocket

  constructor() {
    this.setupWebsocket()
  }

  private setupWebsocket = () => {
    const newWebsocket = new WebSocket((import.meta.env.VITE_WEBSOCKET_URI || 'ws://192.168.0.100:3033/ws') as string)
    const bound = this.setupWebsocket

    newWebsocket.onopen = () => {
      console.log('connected')
    }

    newWebsocket.onmessage = event => {
      console.log('eeevee', event)
      const data = JSON.parse(event.data)
      console.log(data)
      store.dispatch(budgetApi.util.invalidateTags([{ type: 'Budget', id: data.payload }]))
      //   const purchase = JSON.parse(event.data)
      // this.budgetStore.refreshBudget(purchase.budgetId)
      //this.showSnackbarMessage('Saldoa lisätty', 'info')
    }

    newWebsocket.onerror = function (err) {
      console.error(err)
      console.error(
        'Socket encountered error: ',
        //@ts-ignore
        err.message,
        'Closing socket'
      )
      newWebsocket.close()
      setTimeout(bound, 5000)
    }

    this.ws = newWebsocket
  }
}

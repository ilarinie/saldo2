export class WebsocketService {
    ws?: WebSocket

    constructor() {
        this.setupWebsocket()
    }

    private setupWebsocket = () => {
        const newWebsocket = new WebSocket((import.meta.env.VITE_WEBSOCKET_URI || 'ws://localhost:3001/ws') as string)
        const bound = this.setupWebsocket

        newWebsocket.onopen = () => {
            console.log('connected')
        }

        newWebsocket.onmessage = event => {
            const purchase = JSON.parse(event.data)
            // this.budgetStore.refreshBudget(purchase.budgetId)
            //this.showSnackbarMessage('Saldoa lisätty', 'info')
        }

        newWebsocket.onerror = function (err) {
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
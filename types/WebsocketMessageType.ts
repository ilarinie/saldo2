const NEW_PURCHASE = 'NEW_PURCHASE'

export type WebsocketMessageType = {
    type: typeof NEW_PURCHASE,
    payload?: any
}
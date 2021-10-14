declare namespace Express {
    export interface Request {
        wss: import('ws').Server
        budget: import('types').Budget
    }

    export interface User {
        _id: string
        name: string
        googleProfileId: string
        picture: string
    }

    export interface Response {
        sendResponse: (response: import('types').ResponseType) => Response
    }
    export type Next = () => void
}


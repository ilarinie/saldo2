import { ResponseType } from 'types'

export const extractPayload = <T>(response: ResponseType<T>): T => response.payload

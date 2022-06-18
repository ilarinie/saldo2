import { NextFunction, Request, Response } from 'express'

type SyncHandler = (req: Request, res: Response, next: NextFunction) => void
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | SyncHandler
export type Handler = AsyncHandler | SyncHandler | Array<AsyncHandler | SyncHandler>

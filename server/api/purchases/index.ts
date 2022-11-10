import { Express, RequestHandler } from 'express'
import { checkSchema } from 'express-validator'
import BudgetActionLog from 'server/models/BudgetActionLog'
import { sendWebscoketData } from 'server/utils/sendWebsocketData'
import { handleValidationError } from '../../middlewares/handleValidationError'
import { isBudgetMember } from '../../middlewares/isBudgetMember'
import PurchaseModel from '../../models/PurchaseModel'
import { UserModelType } from '../../models/User'
import logger from '../../services/logger'
import { NewPurchaseSchema } from './NewPurchaseSchema'

namespace PurchaseController {
  export const create =
    (app: Express): RequestHandler =>
    async (req, res, next) => {
      const { amount, description, benefactors, type, budgetId, purchaseId } = req.body
      logger.info(`POST /api/purchases`, {
        metadata: {
          body: req.body,
        },
      })
      try {
        const purchase = await PurchaseModel.create({
          amount,
          description,
          benefactors,
          type,
          budgetId,
          createdBy: (req.user as UserModelType)._id,
          purchaseId,
        })
        await BudgetActionLog.create({
          budgetId,
          user: (req.user as UserModelType)._id,
          action: 'create_purchase',
          meta: purchase,
        })
        sendWebscoketData(req.wss, { type: 'foo', payload: budgetId })
        res.sendResponse({ message: 'Purchase created', payload: purchase })
      } catch (err: any) {
        next({ status: 500, message: err.message, payload: err })
      }
    }
  export const deletePurchase: RequestHandler = async (req, res, next) => {
    try {
      const p = await PurchaseModel.findByIdAndUpdate(req.params.id, { deleted: true })
      if (p && p.budgetId) {
        sendWebscoketData(req.wss, { type: 'foo', payload: p.budgetId.toString() })
      }
      res.status(203).sendResponse({ message: 'Purchase removed', payload: {} })
    } catch (err) {
      next({ status: 500, message: 'Error creating purchase', payload: err })
    }
  }
}

export default (app: Express, checkAuth, baseUrl: string) => {
  app.post(baseUrl, checkAuth, isBudgetMember, checkSchema(NewPurchaseSchema), handleValidationError, PurchaseController.create(app))
  app.delete(`${baseUrl}/:id`, checkAuth, PurchaseController.deletePurchase)
}

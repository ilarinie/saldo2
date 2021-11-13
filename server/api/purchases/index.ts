import { Express, RequestHandler } from 'express'
import { checkSchema } from 'express-validator'
import BudgetActionLog from 'server/models/BudgetActionLog'
import { handleValidationError } from '../../middlewares/handleValidationError'
import { isBudgetMember } from '../../middlewares/isBudgetMember'
import PurchaseModel from '../../models/PurchaseModel'
import { UserModelType } from '../../models/User'
import logger from '../../services/logger'
import { NewPurchaseSchema } from './NewPurchaseSchema'

namespace PurchaseController {
  export const create: RequestHandler = async (req, res, next) => {
    const { amount, description, benefactors, type, budgetId } = req.body
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
      })
      await BudgetActionLog.create({
        budgetId,
        user: (req.user as UserModelType)._id,
        action: 'create_purchase',
        meta: purchase,
      })
      res.sendResponse({ message: 'Purchase created', payload: purchase })
    } catch (err: any) {
      next({ status: 500, message: err.message, payload: err })
    }
  }
  export const deletePurchase: RequestHandler = async (req, res, next) => {
    try {
      await PurchaseModel.findByIdAndUpdate(req.params.id, { deleted: true })
      res.status(203).sendResponse({ message: 'Purchase removed', payload: {} })
    } catch (err) {
      next({ status: 500, message: 'Error creating purchase', payload: err })
    }
  }
}

export default (app: Express, checkAuth, baseUrl: string) => {
  app.post(baseUrl, checkAuth, isBudgetMember, checkSchema(NewPurchaseSchema), handleValidationError, PurchaseController.create)
  app.delete(`${baseUrl}/:id`, checkAuth, PurchaseController.deletePurchase)
}

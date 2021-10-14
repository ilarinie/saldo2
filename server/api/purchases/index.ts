import logger from '../../services/logger'
import PurchaseModel from '../../models/PurchaseModel'
import { Express, RequestHandler } from 'express'
import { checkSchema } from 'express-validator'
import { isBudgetMember } from '../../middlewares/isBudgetMember'
import { UserModelType } from '../../models/User'
import { NewPurchaseSchema } from './NewPurchaseSchema'
import { handleValidationError } from '../../middlewares/handleValidationError'

namespace PurchaseController {
  export const create: RequestHandler = async (req, res, next) => {
    const { amount, description, benefactors, type } = req.body
    logger.info(`POST /api/purchases`,
      {
        metadata: {
          body: req.body
        }
      })
    try {
      const purchase = await PurchaseModel.create({
        amount,
        description,
        benefactors,
        type,
        budgetId: req.budget._id,
        createdBy: (req.user as UserModelType)._id,
      })
      res.sendResponse({ message: 'Purchase created', payload: purchase })
    } catch (err: any) {
      next({ status: 500, message: err.message, payload: err })
    }
  }
  export const deletePurchase: RequestHandler = async (req, res, next) => {
    try {
      await PurchaseModel.findByIdAndUpdate(req.params.id, { deleted: true })
      res.status(203).send()
    } catch (err) {
      next({ status: 500, message: 'Error creating purchase', payload: err })
    }
  }
}

export default (app: Express, baseUrl: string) => {
  app.post(baseUrl, isBudgetMember, checkSchema(NewPurchaseSchema), handleValidationError, PurchaseController.create)
  app.delete(`${baseUrl}/:id`, PurchaseController.deletePurchase)
}
import { Express } from 'express'
import { checkSchema, Schema } from 'express-validator'
import { handleValidationError } from '../../middlewares/handleValidationError'
import { isBudgetMember, isBudgetOwner } from '../../middlewares/isBudgetMember'
import { BudgetService } from '../../services/BudgetService'
import logger from '../../services/logger'
import * as UserService from '../../services/UserService'

const NewBudgetSchema: Schema = {
  name: {
    trim: true,
    notEmpty: true,
  },
}

const AddBudgetUserSchema: Schema = {
  username: {
    trim: true,
    notEmpty: true,
  },
}

namespace BudgetController {
  export const getUserBudgets = async (req, res) => {
    const budgets = await BudgetService.getUserBudgets(req.user._id)
    res.status(200).sendResponse({ message: '', payload: budgets })
  }

  export const getBudgetById = async (req, res) => {
    res.sendResponse({ message: '', payload: req.budget })
  }

  export const createBudget = async (req, res) => {
    try {
      const budget = await BudgetService.createBudget(req.body, req.user._id)
      res.status(200).sendResponse({ message: 'Budget created', payload: budget })
    } catch (err) {
      logger.error(err)
      res.status(500).send('Internal server error.')
    }
  }

  export const updateBudget = async (req, res, next) => {
    try {
      const budget = await BudgetService.updateBudget(req.params.budgetId, req.user._id, req.body)
      res.status(200).sendResponse({ message: 'Budget updated', payload: budget })
    } catch (err) {
      logger.error(err)
      next({ status: 400, message: 'Failed to update budget', payload: err })
    }
  }

  export const deleteBudget = async (req, res, next) => {
    try {
      await BudgetService.deleteBudget(req.params.budgetId, req.user._id)
      res.status(203).sendResponse({ message: 'Budget removed', payload: {} })
    } catch (err) {
      logger.error(err)
      next({ status: 400, message: 'Failed to delete budget', payload: err })
    }
  }

  export const addBudgetUsers = async (req, res) => {
    const { username } = req.body
    try {
      const { budget } = req
      const newUser = await UserService.createUserByUserName(username)
      await BudgetService.updateBudget(budget._id, req.user._id, {
        members: [newUser._id],
      })
      res.status(200).sendResponse({ message: 'Success', payload: {} })
    } catch (err) {
      res.status(500).send('Server error')
    }
  }
}

export default (app: Express, checkAuth, baseUrl: string) => {
  app.get(`${baseUrl}`, checkAuth, BudgetController.getUserBudgets)
  app.get(`${baseUrl}/:budgetId`, checkAuth, isBudgetMember, BudgetController.getBudgetById)
  app.post(`${baseUrl}`, checkAuth, checkSchema(NewBudgetSchema), handleValidationError, BudgetController.createBudget)
  app.put(`${baseUrl}/:budgetId`, checkAuth, BudgetController.updateBudget)
  app.delete(`${baseUrl}/:budgetId`, checkAuth, BudgetController.deleteBudget)
  app.post(
    `${baseUrl}/:budgetId/addnewusers`,
    checkAuth,
    isBudgetOwner,
    checkSchema(AddBudgetUserSchema),
    handleValidationError,
    BudgetController.addBudgetUsers
  )
}

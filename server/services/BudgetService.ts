import logger from './logger'
import BudgetModel, { BudgetModelType } from '../models/BudgetModel'
import PurchaseModel from '../models/PurchaseModel'
import { Budget, Purchase } from 'types'
import { budgetPurchasesToBudgetResponse } from '../utils/budgetPurchasesToBudgetResponse'

export namespace BudgetService {
  const createBudgetQuery = (budgetId, userId, requireOwner) => {
    return {
      $and: [{ _id: budgetId }, { deleted: false }, ownerOrMemberQuery(userId, requireOwner)],
    }
  }

  const ownerOrMemberQuery = (userId, requireOwner) => {
    if (requireOwner) {
      return {
        owners: {
          $in: [userId],
        },
      }
    }
    return {
      $or: [
        {
          members: {
            $in: [userId],
          },
        },
        {
          owners: {
            $in: [userId],
          },
        },
      ],
    }
  }

  export const getBudgetById = async (budgetId, userId, requireOwner = false): Promise<Budget> => {
    try {
      const budget: BudgetModelType = await BudgetModel.findOne(createBudgetQuery(budgetId, userId, requireOwner)).populate('owners').populate('members')
      if (budget) {
        const purchases: Purchase[] = await PurchaseModel.find({
          $and: [{ deleted: false }, { budgetId: budget._id }],
        })
          .sort({ createdAt: -1 })
          .populate('benefactors.user')
          .populate('createdBy')

        const response = budgetPurchasesToBudgetResponse(budget, purchases)
        return Promise.resolve(response)
      } else {
        throw Error('budget not found or not accesible')
      }
    } catch (err) {
      throw Error(`Budget not accesible for user ${userId}`)
    }
  }

  export const createBudget = async (budget, userId) => {
    try {
      const newBudget = await BudgetModel.create({
        ...budget,
        owners: [userId],
      })
      return await getBudgetById(newBudget._id, userId)
    } catch (err) {
      throw err
    }
  }

  export const updateBudget = async (budgetId, userId, updateData) => {
    let updateQuery = updateData
    if (updateData.members && updateData.members.length > 0) {
      updateQuery = { $addToSet: { members: { $each: updateData.members } } }
    }

    const budget = await BudgetModel.findOneAndUpdate(createBudgetQuery(budgetId, userId, true), { ...updateQuery }, { new: true })
    await budget.populate('owners')
    await budget.populate('members')
    return budget
  }

  export const deleteBudget = async (budgetId, userId) => {
    return updateBudget(budgetId, userId, { deleted: true })
  }

  export const getUserBudgets = async userId => {
    let res: BudgetModelType[] = []
    try {
      res = await BudgetModel.find({
        $and: [ownerOrMemberQuery(userId, false), { deleted: false }],
      })
      const budgets = await Promise.all([...res.map(r => getBudgetById(r._id, userId))])
      return Promise.resolve(budgets)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

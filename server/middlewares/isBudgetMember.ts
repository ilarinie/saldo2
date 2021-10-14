import { checkSchema, Schema } from "express-validator"
import { Middleware } from "express-validator/src/base"
import { Types } from "mongoose"
import { BudgetService } from 'server/services/BudgetService'
import { handleValidationError } from "./handleValidationError"

const BudgetIdSchema: Schema = {
    budgetId: {
        notEmpty: true,
        custom: {
            options: (value): boolean => Types.ObjectId.isValid(value),
        }
    }
}

const checkBudgetAccess = (requireOwner: boolean) => async (req, res, next) => {
    if (!req.user) {
        next({ status: 401, errorMessage: 'Unauthorized' })
        return
    }
    const budgetId = req.body.budgetId || req.params.budgetId
    try {
        const budget = await BudgetService.getBudgetById(budgetId, req.user._id, requireOwner)
        req.budget = budget
        next()
    } catch (err: any) {
        // @ts-ignore
        next({ status: 400, errorMessage: err.message, payload: { budgetId, user: req.user._doc } })
    }
}

// @ts-ignore
export const isBudgetMember: Middleware = [checkSchema(BudgetIdSchema), handleValidationError, checkBudgetAccess(false)]

// @ts-ignore
export const isBudgetOwner: Middleware = [checkSchema(BudgetIdSchema), handleValidationError, checkBudgetAccess(true)]

import currency from "currency.js"
import { Schema } from "express-validator"
import { Types } from "mongoose"
import { Budget } from "types"
import { Benefactor } from "types/Benefactor"

export const NewPurchaseSchema: Schema = {
    amount: {
        trim: true,
        notEmpty: true,
        isNumeric: true,
    },
    description: {
        trim: true,
        notEmpty: true,
        isString: true
    },
    budgetId: {
        notEmpty: true,
        custom: {
            options: (value): boolean => Types.ObjectId.isValid(value),
        },
    },
    benefactors: {
        notEmpty: true,
        isArray: true,
        custom: {
            options: (value: Benefactor[], { req }) => validateBenefactors(value, req.budget, req.body.amount)
        }
    }
}

const validateBenefactors = (benefactors: Benefactor[], budget: Budget, amount: number): boolean => {
    const { allIds } = budget

    if (benefactors.length !== allIds.length) {
        throw new Error('Incorrect amount of benefactors')
    }
    let total = currency(0)
    let totalBenefits = currency(0)
    const invalidUsers: string[] = []
    benefactors.forEach(b => {
        total = total.add(currency(b.amountPaid))
        totalBenefits = totalBenefits.add(currency(b.amountBenefitted))
        if (allIds.find(i => i === b.user._id) === undefined) {
            invalidUsers.push(b.user._id)
        }
    })

    if (invalidUsers.length > 0) {
        throw new Error('Benefactors include invalid users')
    }
    if (total.value !== currency(amount).value || totalBenefits.value !== currency(amount).value) {
        throw new Error('Benefactor totals dont match with purchase amount')
    }
    return true
}
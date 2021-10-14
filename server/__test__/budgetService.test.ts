/* eslint-disable */
const dotenv = require('dotenv')
dotenv.config()

import mongoose from 'mongoose'
import { connectToDatabase } from '../services/database'
import { BudgetService } from '../services/BudgetService'
import Constants from './constants'
import { createSaldoTestBudget, TEST_SALDO_BUDGET_ID } from './seed'
/* eslint-enable */

describe('budgetService test', () => {
  beforeEach(async () => {
    try {
      await connectToDatabase(process.env.TEST_MONGO_URI + 'budgetService')
      await createSaldoTestBudget()
    } catch (err) {
      console.error(err)
    }
  })
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
  })
  it('Does calculations on saldo budget properly', async () => {
    const budget = await BudgetService.getBudgetById(TEST_SALDO_BUDGET_ID, Constants.TEST_USER_ID)

    expect(budget.name).toBe('saldo-budget')
  })
})

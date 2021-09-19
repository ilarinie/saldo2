const dotenv = require('dotenv');
dotenv.config();

/* eslint-disable */
import mongoose from 'mongoose';
import { connectToDatabase } from '../database';
import * as BudgetService from '../services/budget-service';
import Constants from './constants';
import { createSaldoTestBudget, TEST_SALDO_BUDGET_ID } from './seed';
/* eslint-enable */

describe('budgetService test', () => {
  it('Does calculations on saldo budget properly', async () => {
    await connectToDatabase(process.env.TEST_MONGO_URI);
    await createSaldoTestBudget();

    const budget = await BudgetService.getBudget(
      TEST_SALDO_BUDGET_ID,
      Constants.TEST_USER_ID
    );

    expect(budget.name).toBe('saldo-budget');
    console.log(JSON.stringify(budget.purchases, null, 2));
    console.log(JSON.stringify(budget.totals, null, 2));

    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });
});

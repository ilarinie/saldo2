/* eslint-disable */
const dotenv = require('dotenv');
dotenv.config();

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

    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });
});

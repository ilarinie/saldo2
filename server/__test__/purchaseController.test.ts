const dotenv = require('dotenv');
dotenv.config();

/* eslint-disable */
import mongoose from 'mongoose';
import request from 'supertest';
import { connectToDatabase } from '../database';
import { app } from '../server';
import constants from './constants';
import { createBudgetTestBudget, TEST_SALDO_BUDGET_ID } from './seed';

const {
  TEST_USER_ID,
  TEST_USER_ID_2,
  TEST_USER_ID_3,
  TEST_BUDGET_ID,
  TEST_BUDGET_2_ID,
} = constants;

// @ts-ignore
process.env.NODE_ENV = 'test';

describe('PurchaseController spec', () => {
  beforeEach(async () => {
    try {
      await connectToDatabase(process.env.TEST_MONGO_URI);
      await createBudgetTestBudget();
    } catch (err) {
      console.log(err);
      console.log('ERRRR');
    }
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('creates a purchase', async () => {
    const resp = await request(app)
      .post('/api/purchases')
      .send({
        budgetId: TEST_SALDO_BUDGET_ID,
        amount: 10.2,
        description: 'kanaa',
        benefactors: [
          {
            user: TEST_USER_ID,
            amountPaid: 10.2,
            amountBenefitted: 3.4,
          },
          {
            user: TEST_USER_ID_2,
            amountPaid: 0,
            amountBenefitted: 3.4,
          },
          {
            user: TEST_USER_ID_3,
            amountPaid: 0,
            amountBenefitted: 3.4,
          },
        ],
      });
    // Pre 51.6
    // User 1 paid: 30, ben 18.9
    // User 2 paid: 12.3, ben 18.9
    // User 3 paid: 9.3, ben 14.7
    expect(resp.status).toBe(200);
    const resp2 = await request(app).get(
      `/api/budgets/${TEST_SALDO_BUDGET_ID}`
    );
    const budget = resp2.body.resp;
    expect(budget.total).toBe(61.8);

    const user1Totals = budget.totals.find((b) => b.user._id === TEST_USER_ID);

    expect(user1Totals.totalPaid).toBe(40.2);
    expect(user1Totals.totalBenefitted).toBe(22.3);

    const user2Totals = budget.totals.find(
      (b) => b.user._id === TEST_USER_ID_2
    );

    expect(user2Totals.totalPaid).toBe(12.3);
    expect(user2Totals.totalBenefitted).toBe(22.3);

    const user3Totals = budget.totals.find(
      (b) => b.user._id === TEST_USER_ID_3
    );

    expect(user3Totals.totalPaid).toBe(9.3);
    expect(user3Totals.totalBenefitted).toBe(18.1);
  });
});

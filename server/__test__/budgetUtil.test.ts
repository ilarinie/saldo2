import { BudgetType } from '../models/Budget';
import { Purchase } from '../types/Purchase';
import { budgetPurchasesToBudgetResponse } from '../utils/budgetPurchasesToBudgetResponse';
import constants from './constants';

export const TEST_SALDO_BUDGET_ID = '6145af0340536d17d43c8c10';

const users = [
  {
    _id: constants.TEST_USER_ID,
    name: 'test_user_1',
    picture: '',
    googleProfileId: 'string',
  },
  {
    _id: constants.TEST_USER_ID_2,
    name: 'test_user_2',
    picture: '',
    googleProfileId: 'string',
  },
];

const basePurcase = {
  budgetId: TEST_SALDO_BUDGET_ID,
  createdBy: users[0],
  deleted: false,
  description: `Doesnt't matter.`,
  createdAt: '2010-00:00T00:00:00.000Z',
  updatedAt: '2010-00:00T00:00:00.000Z',
};

describe('BudgetUtil', () => {
  it('parses Budget properly', () => {
    const budget: BudgetType = {
      _id: TEST_SALDO_BUDGET_ID,
      name: 'saldo-budget',
      type: 'saldo',
      owners: [users[0]],
      members: [users[1]],
      deleted: false,
      createdAt: '2010-00:00T00:00:00.000Z',
      updatedAt: '2010-00:00T00:00:00.000Z',
    };

    const purchases: Purchase[] = [
      {
        ...basePurcase,
        amount: 100.2,
        benefactors: [
          {
            user: users[0],
            amountPaid: 100.2,
            amountBenefitted: 0,
          },
          {
            user: users[1],
            amountPaid: 0,
            amountBenefitted: 100.2,
          },
        ],
      },
      {
        ...basePurcase,
        amount: 50.2,
        benefactors: [
          {
            user: users[0],
            amountPaid: 50.2,
            amountBenefitted: 0,
          },
          {
            user: users[1],
            amountPaid: 0,
            amountBenefitted: 50.2,
          },
        ],
      },
      {
        ...basePurcase,
        amount: 100.2,
        benefactors: [
          {
            user: users[1],
            amountPaid: 50,
            amountBenefitted: 0,
          },
          {
            user: users[0],
            amountPaid: 0,
            amountBenefitted: 50,
          },
        ],
      },
    ];

    const newBudget = budgetPurchasesToBudgetResponse(budget, purchases);

    expect(newBudget.total).toBe(250.6);
    const user1Totals = newBudget.totals.find(
      (a) => a.user._id === constants.TEST_USER_ID
    );
    expect(user1Totals).toBeDefined();
    expect(user1Totals?.totalPaid).toBe(150.4);
    expect(user1Totals?.totalBenefitted).toBe(50);

    const user2Totals = newBudget.totals.find(
      (a) => a.user._id === constants.TEST_USER_ID_2
    );
    expect(user2Totals).toBeDefined();
    expect(user2Totals?.totalPaid).toBe(50);
    expect(user2Totals?.totalBenefitted).toBe(150.4);
  });
});

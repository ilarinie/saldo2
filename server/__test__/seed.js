const PurchaseModel = require('../models/PurchaseModel');
const BudgetModel = require('../models/Budget');
const UserModel = require('../models/User');

const {
  TEST_USER_ID,
  TEST_BUDGET_ID,
  TEST_BUDGET_2_ID,
  TEST_USER_ID_2,
} = require('./constants');

module.exports = async () => {
  await Promise.all([
    PurchaseModel.create({ amount: 1.2, description: 'test_purchase_1' }),
    PurchaseModel.create({ amount: 2.3, description: 'test_purchase_2' }),
    PurchaseModel.create({ amount: 5.5, description: 'test_purchase_3' }),
    PurchaseModel.create({ amount: 10, description: 'test_purchase_4' }),
    PurchaseModel.create({ amount: 200, description: 'test_purchase_5' }),
    UserModel.create({
      _id: TEST_USER_ID_2,
      name: 'foobar',
    }),
    BudgetModel.create({
      _id: TEST_BUDGET_ID,
      name: 'test_budget',
      owners: [TEST_USER_ID],
    }),
    BudgetModel.create({
      name: 'test_budget_deleted',
      owners: [TEST_USER_ID],
      deleted: true,
    }),
    BudgetModel.create({
      _id: TEST_BUDGET_2_ID,
      name: 'test_budget_2',
      owners: ['613dbecec50688dd8d124335'],
    }),
  ]);
};

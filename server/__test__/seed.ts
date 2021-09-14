import BudgetModel from '../models/Budget';
import PurchaseModel from '../models/PurchaseModel';
import UserModel from '../models/User';
import constants from './constants';

const {
  TEST_USER_ID,
  TEST_USER_ID_2,
  TEST_USER_ID_3,
  TEST_BUDGET_ID,
  TEST_BUDGET_2_ID,
} = constants;

const foo = async () => {
  await Promise.all([
    UserModel.create({
      _id: TEST_USER_ID_2,
      name: 'test_user_2',
    }),
    UserModel.create({
      _id: TEST_USER_ID_3,
      name: 'test_user_3',
    }),
    BudgetModel.create({
      _id: TEST_BUDGET_ID,
      name: 'test_budget',
      owners: [TEST_USER_ID],
      members: [TEST_USER_ID_2, TEST_USER_ID_3],
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

    PurchaseModel.create({
      amount: 100,
      description: 'test_purchase_1',
      budgetId: TEST_BUDGET_ID,
      creator: TEST_USER_ID_2,
      payer: TEST_USER_ID,
    }),
    PurchaseModel.create({
      amount: 100,
      description: 'test_purchase_2',
      budgetId: TEST_BUDGET_ID,
      creator: TEST_USER_ID_2,
      payer: TEST_USER_ID_2,
    }),
    PurchaseModel.create({
      amount: 100,
      description: 'test_purchase_3',
      budgetId: TEST_BUDGET_ID,
      creator: TEST_USER_ID_2,
      payer: TEST_USER_ID_2,
    }),
    // PurchaseModel.create({
    //   amount: 10,
    //   description: 'test_purchase_4',
    //   budgetId: TEST_BUDGET_ID,
    //   creator: TEST_USER_ID_2,
    //   payer: TEST_USER_ID_2,
    // }),
    // PurchaseModel.create({
    //   amount: 200,
    //   description: 'test_purchase_5',
    //   budgetId: TEST_BUDGET_ID,
    //   creator: TEST_USER_ID_2,
    //   payer: TEST_USER_ID_2,
    // }),
  ]);
};

export default foo;

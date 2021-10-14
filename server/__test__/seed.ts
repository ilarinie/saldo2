import BudgetModel from '../models/BudgetModel'
import PurchaseModel, { BenefactorDocument } from '../models/PurchaseModel'
import UserModel from '../models/User'
import constants from './constants'

export const TEST_SALDO_BUDGET_ID = '6145af0340536d17d43c8c10'

export const TEST_SALDO_BUDGET_ID_2 = '6145af0340536d17d43c8c11'

const { TEST_USER_ID, TEST_USER_ID_2, TEST_USER_ID_3, TEST_BUDGET_ID, TEST_BUDGET_2_ID } = constants

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
  ])
}

export const createSaldoTestBudget = async () => {
  const createUsers = async () => {
    await Promise.all([
      UserModel.create({
        _id: TEST_USER_ID,
        name: 'test_user_1',
      }),
      UserModel.create({
        _id: TEST_USER_ID_2,
        name: 'test_user_2',
      }),
    ])
  }
  const createBudget = async () => {
    await BudgetModel.create({
      _id: TEST_SALDO_BUDGET_ID,
      name: 'saldo-budget',
      type: 'saldo',
      owners: [TEST_USER_ID],
      members: [TEST_USER_ID_2],
      deleted: false,
    })
  }
  const createPurchase = async (payer: string, benefactors: BenefactorDocument[], amount: number) => {
    return PurchaseModel.create({
      budgetId: TEST_SALDO_BUDGET_ID,
      amount,
      payer,
      benefactors,
      createdBy: TEST_USER_ID,
      deleted: false,
      description: `Doesnt't matter.`,
    })
  }

  await Promise.all([
    createUsers(),
    createBudget(),
    createPurchase(
      TEST_USER_ID,
      [
        { user: TEST_USER_ID, amountPaid: 0, amountBenefitted: 100 },
        { user: TEST_USER_ID_2, amountPaid: 100, amountBenefitted: 0 },
      ],
      100
    ),
    createPurchase(
      TEST_USER_ID,
      [
        { user: TEST_USER_ID, amountPaid: 100, amountBenefitted: 0 },
        { user: TEST_USER_ID_2, amountPaid: 0, amountBenefitted: 100 },
      ],
      100
    ),
    createPurchase(
      TEST_USER_ID_2,
      [
        { user: TEST_USER_ID, amountPaid: 0, amountBenefitted: 100 },
        { user: TEST_USER_ID_2, amountPaid: 100, amountBenefitted: 0 },
      ],
      100
    ),
  ])
}

export const createBudgetTestBudget = async () => {
  const createUsers = async () => {
    await Promise.all([
      UserModel.create({
        _id: TEST_USER_ID,
        name: 'test_user_1',
      }),
      UserModel.create({
        _id: TEST_USER_ID_2,
        name: 'test_user_2',
      }),
      UserModel.create({
        _id: TEST_USER_ID_3,
        name: 'test_user_3',
      }),
    ])
  }
  const createBudget = async () => {
    await BudgetModel.create({
      _id: TEST_SALDO_BUDGET_ID,
      name: 'budget-budget',
      type: 'budget',
      owners: [TEST_USER_ID],
      members: [TEST_USER_ID_2, TEST_USER_ID_3],
      deleted: false,
    })
  }

  const createDummyBudget = async () => {
    await BudgetModel.create({
      _id: TEST_SALDO_BUDGET_ID_2,
      name: 'budget-budget',
      type: 'budget',
      owners: [],
      members: [],
      deleted: false,
    })
  }
  const createPurchase = async (payer: string, benefactors: BenefactorDocument[], amount: number) => {
    return PurchaseModel.create({
      budgetId: TEST_SALDO_BUDGET_ID,
      amount,
      payer,
      benefactors,
      createdBy: TEST_USER_ID,
      deleted: false,
      description: `Doesnt't matter.`,
    })
  }

  await Promise.all([
    createUsers(),
    createBudget(),
    createDummyBudget(),
    // User 1 ostaa kaljakorin 30.00
    // User 1 paid: 30, ben 10
    // User 2 paid: 0, ben 10
    // User 3 paid: 0, ben 10
    createPurchase(
      TEST_USER_ID,
      [
        { user: TEST_USER_ID, amountPaid: 30, amountBenefitted: 10 },
        { user: TEST_USER_ID_2, amountPaid: 0, amountBenefitted: 10 },
        { user: TEST_USER_ID_3, amountPaid: 0, amountBenefitted: 10 },
      ],
      30
    ),
    // User 2 ostaa Makkaraa, mutta user 3 syö vain yhden
    // User 1 paid: 30, ben 15.5
    // User 2 paid: 12.3, ben 15.5
    // User 3 paid: 0, ben 11.3
    createPurchase(
      TEST_USER_ID,
      [
        { user: TEST_USER_ID_2, amountPaid: 12.3, amountBenefitted: 5.5 },
        { user: TEST_USER_ID, amountPaid: 0, amountBenefitted: 5.5 },
        { user: TEST_USER_ID_3, amountPaid: 0, amountBenefitted: 1.3 },
      ],
      12.3
    ),
    // User 3 ostaa sipsejä kaikille
    // User 1 paid: 30, ben 18.9
    // User 2 paid: 12.3, ben 18.9
    // User 3 paid: 9.3, ben 14.7
    createPurchase(
      TEST_USER_ID_2,
      [
        { user: TEST_USER_ID_3, amountPaid: 9.3, amountBenefitted: 3.4 },
        { user: TEST_USER_ID, amountPaid: 0, amountBenefitted: 3.4 },
        { user: TEST_USER_ID_2, amountPaid: 0, amountBenefitted: 3.4 },
      ],
      9.3
    ),
  ])
}

export default foo

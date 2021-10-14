/* eslint-disable */
const dotenv = require('dotenv')
dotenv.config()

import mongoose from 'mongoose'
import request from 'supertest'
import { connectToDatabase } from '../services/database'
import { app } from '../server'
import constants from './constants'
import { createBudgetTestBudget, TEST_SALDO_BUDGET_ID, TEST_SALDO_BUDGET_ID_2 } from './seed'

const { TEST_USER_ID, TEST_USER_ID_2, TEST_USER_ID_3, TEST_BUDGET_ID, TEST_BUDGET_2_ID } = constants

describe('PurchaseController spec', () => {
  beforeEach(async () => {
    try {
      await connectToDatabase(process.env.TEST_MONGO_URI + 'purchaseController')
      await createBudgetTestBudget()
    } catch (err) {
      console.log(err)
      console.log('ERRRR')
    }
  })

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
  })

  it('creates a purchase', async () => {
    const response = await request(app)
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
      })
    // Pre 51.6
    // User 1 paid: 30, ben 18.9
    // User 2 paid: 12.3, ben 18.9
    // User 3 paid: 9.3, ben 14.7
    expect(response.status).toBe(200)
    const resp2 = await request(app).get(`/api/budgets/${TEST_SALDO_BUDGET_ID}`)
    const budget = resp2.body.payload
    expect(budget.total).toBe(61.8)

    const user1Totals = budget.totals.find(b => b.user._id === TEST_USER_ID)

    expect(user1Totals.totalPaid).toBe(40.2)
    expect(user1Totals.totalBenefitted).toBe(22.3)

    const user2Totals = budget.totals.find(b => b.user._id === TEST_USER_ID_2)

    expect(user2Totals.totalPaid).toBe(12.3)
    expect(user2Totals.totalBenefitted).toBe(22.3)

    const user3Totals = budget.totals.find(b => b.user._id === TEST_USER_ID_3)

    expect(user3Totals.totalPaid).toBe(9.3)
    expect(user3Totals.totalBenefitted).toBe(18.1)
  })

  it('doesnt create a purchase if invalid benefactors', async () => {
    const lessThanTotal = await request(app)
      .post('/api/purchases')
      .send({
        budgetId: TEST_SALDO_BUDGET_ID,
        amount: 10.2,
        description: 'kanaa',
        benefactors: [
          {
            user: TEST_USER_ID,
            amountPaid: 9,
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
      })
    expect(lessThanTotal.status).toBe(406)

    const notEnoughBenefits = await request(app)
      .post('/api/purchases')
      .send({
        budgetId: TEST_SALDO_BUDGET_ID,
        amount: 10.2,
        description: 'kanaa',
        benefactors: [
          {
            user: TEST_USER_ID,
            amountPaid: 9,
            amountBenefitted: 3.4,
          },
          {
            user: TEST_USER_ID_2,
            amountPaid: 0,
            amountBenefitted: 2,
          },
          {
            user: TEST_USER_ID_3,
            amountPaid: 0,
            amountBenefitted: 3.4,
          },
        ],
      })
    expect(notEnoughBenefits.status).toBe(406)
    expect(notEnoughBenefits.body.payload.length).toBe(1)
    expect(notEnoughBenefits.body.payload[0].msg).toBe('Benefactor totals dont match with purchase amount')

    const wrongNumberOfUsers = await request(app)
      .post('/api/purchases')
      .send({
        budgetId: TEST_SALDO_BUDGET_ID,
        amount: 10.2,
        description: 'kanaa',
        benefactors: [
          {
            user: TEST_USER_ID,
            amountPaid: 9,
            amountBenefitted: 3.4,
          },
          {
            user: TEST_USER_ID_2,
            amountPaid: 0,
            amountBenefitted: 3.4,
          },
        ],
      })
    expect(wrongNumberOfUsers.status).toBe(406)
    expect(wrongNumberOfUsers.body.payload.length).toBe(1)
    expect(wrongNumberOfUsers.body.payload[0].msg).toBe('Incorrect amount of benefactors')

    const notBudgetMembers = await request(app)
      .post('/api/purchases')
      .send({
        budgetId: TEST_SALDO_BUDGET_ID,
        amount: 10.2,
        description: 'kanaa',
        benefactors: [
          {
            user: TEST_USER_ID,
            amountPaid: 9,
            amountBenefitted: 3.4,
          },
          {
            user: TEST_USER_ID_2,
            amountPaid: 0,
            amountBenefitted: 3.4,
          },
          {
            user: 'asdasdasd',
            amountPaid: 0,
            amountBenefitted: 3.4,
          },
        ],
      })
    expect(notBudgetMembers.status).toBe(406)
    expect(notBudgetMembers.body.payload[0].msg).toBe('Benefactors include invalid users')


    const noAmount = await request(app)
      .post('/api/purchases')
      .send({
        budgetId: TEST_SALDO_BUDGET_ID,
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
      })
    expect(noAmount.status).toBe(406)
    expect(noAmount.body.payload[0].msg).toBe('Invalid value')
    expect(noAmount.body.payload[0].param).toBe('amount')

    const noDescription = await request(app)
      .post('/api/purchases')
      .send({
        budgetId: TEST_SALDO_BUDGET_ID,
        amount: 10.2,
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
      })
    expect(noDescription.status).toBe(406)
    expect(noDescription.body.payload[0].msg).toBe('Invalid value')
    expect(noDescription.body.payload[0].param).toBe('description')

    const invalidBudget = await request(app)
      .post('/api/purchases')
      .send({
        budgetId: TEST_SALDO_BUDGET_ID_2,
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
      })
    expect(invalidBudget.status).toBe(400)
    expect(invalidBudget.body.message).toBe('Budget not accesible for user 61391c620c7d2d6d8db0d354')

  })
})

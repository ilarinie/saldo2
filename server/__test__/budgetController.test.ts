const dotenv = require('dotenv');
dotenv.config();

/* eslint-disable */
import mongoose from 'mongoose';
import request from 'supertest';
import { connectToDatabase } from '../database';
import { app } from '../server';
import constants from './constants';
import { createSaldoTestBudget, TEST_SALDO_BUDGET_ID } from './seed';

const { TEST_USER_ID, TEST_USER_ID_2, TEST_BUDGET_ID, TEST_BUDGET_2_ID } =
  constants;

// @ts-ignore
process.env.NODE_ENV = 'test';

describe('Endpoints spec', () => {
  beforeEach(async () => {
    try {
      await connectToDatabase(process.env.TEST_MONGO_URI);
      await createSaldoTestBudget();
    } catch (err) {
      console.log(err);
      console.log('ERRRR');
    }
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('Get user budgets', () => {
    it('finds budget', async () => {
      const res = await request(app).get('/api/budgets');
      expect(res.body.resp.length).toBe(1);
      const budget = res.body.resp[0];
      expect(budget.name).toBe('saldo-budget');
    });
  });

  describe('Gets specific budget', () => {
    it('finds budget if user belongs to it', async () => {
      const res = await request(app).get(
        `/api/budgets/${TEST_SALDO_BUDGET_ID}`
      );
      expect(res.status).toBe(200);
      const resp = res.body.resp;
      expect(resp.name).toBe('saldo-budget');

      const user1Totals = resp.totals.find((b) => b.user._id === TEST_USER_ID);
      expect(user1Totals.totalPaid).toBe(100);
      expect(user1Totals.totalBenefitted).toBe(200);
      expect(user1Totals.diff).toBe(-100);

      const user2Totals = resp.totals.find(
        (b) => b.user._id === TEST_USER_ID_2
      );
      expect(user2Totals.totalPaid).toBe(200);
      expect(user2Totals.totalBenefitted).toBe(100);
      expect(user2Totals.diff).toBe(100);
    });
    it('returns 403 if budget not accesible', async () => {
      const res = await request(app).get(`/api/budgets/${TEST_BUDGET_2_ID}`);
      expect(res.status).toBe(403);
      expect(res.text).toBe('Forbidden');
    });
  });

  describe('Creates a budget', () => {
    it('creates a budget', async () => {
      const res = await request(app).post(`/api/budgets`).send({
        name: 'newBudget',
      });
      expect(res.status).toBe(200);
      const budget = res.body.resp;
      expect(budget.name).toBe('newBudget');
      expect(budget.owners[0]._id).toBe(TEST_USER_ID);
    });
  });

  describe('Updates a budget', () => {
    it('updates budget name', async () => {
      const res = await request(app)
        .put(`/api/budgets/${TEST_SALDO_BUDGET_ID}`)
        .send({
          name: 'newBudget',
        });
      expect(res.status).toBe(200);
      const budget = res.body.resp;
      expect(budget.name).toBe('newBudget');
      expect(budget.owners[0]._id).toBe(TEST_USER_ID);
    });
    it('updates budget members', async () => {
      const res = await request(app)
        .put(`/api/budgets/${TEST_SALDO_BUDGET_ID}`)
        .send({
          members: [TEST_USER_ID_2],
        });
      expect(res.status).toBe(200);
      const budget = res.body.resp;
      expect(budget.members[0]._id).toBe(TEST_USER_ID_2);
    });
    it('removes budget members', async () => {
      const res = await request(app)
        .put(`/api/budgets/${TEST_SALDO_BUDGET_ID}`)
        .send({
          members: [],
        });
      expect(res.status).toBe(200);
      const budget = res.body.resp;
      expect(budget.members[0]).toBe(undefined);
    });
  });
});

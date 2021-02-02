const request = require('supertest');
const mongoose = require('mongoose');
const connectToDatabase = require('../database');
const { app } = require('../server');
const seed = require('./seed');
const PurchaseModel = require('../PurchaseModel');
process.env.NODE_ENV = 'test';
const testSecret = 'test_secret';
process.env.SECRET = testSecret;

describe('Endpoints spec', () => {
  beforeEach(async () => {
    await connectToDatabase(process.env.TEST_MONGO_URI);
    await seed();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /api/purchases', () => {
    it('Should respond with a valid request', async () => {
      const res = await request(app)
        .get('/api/purchases')
        .set('Authorization', testSecret);
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(5);
      expect(res.body[0].amount).toEqual(1.2);
      expect(res.body[0].description).toEqual('test_purchase_1');
    });
    it('Should respond with 401 with a unauthorized request', async () => {
      const res = await request(app).get('/api/purchases');
      expect(res.status).toEqual(401);
    });
  });

  describe('POST /api/purchases', () => {
    it('Should create a purchase with a valid request', async () => {
      const res = await request(app)
        .post('/api/purchases')
        .send({ amount: 2, description: 'testing' })
        .set('Authorization', testSecret);
      expect(res.status).toEqual(200);
      expect(res.body.amount).toEqual(2);
      expect(res.body.description).toEqual('testing');
    });
    it('Should not create a purchase with a invalid request', async () => {
      const res = await request(app)
        .post('/api/purchases')
        .send({ amount: 2 })
        .set('Authorization', testSecret);
      expect(res.status).toEqual(406);
      expect(res.body.message).toEqual('Invalid request');
    });
    it('Should not create a purchase with a valid request, unauthorized', async () => {
      const res = await request(app)
        .post('/api/purchases')
        .send({ amount: 2 })
        .set('Authorization', 'wrongSecret');
      expect(res.status).toEqual(401);
    });
  });

  describe('DELETE /api/purchases/:id', () => {
    it('Should delete a purchase with a valid request', async () => {
      const { _id } = await PurchaseModel.findOne({});
      const res = await request(app)
        .delete('/api/purchases/' + _id)
        .set('Authorization', testSecret);
      expect(res.status).toEqual(203);
      const { deleted } = await PurchaseModel.findOne({ _id });
      expect(deleted).toBe(true);
    });
    it('Should not delete a purchase with a unauthorized request', async () => {
      const { _id } = await PurchaseModel.findOne({});
      const res = await request(app)
        .delete('/api/purchases/' + _id)
        .set('Authorization', 'wrongSecret');
      expect(res.status).toEqual(401);
      const { deleted } = await PurchaseModel.findOne({ _id });
      expect(deleted).toBe(false);
    });
  });
});

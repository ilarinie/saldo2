const request = require('supertest');
const { app } = require('../server');
process.env.NODE_ENV = 'test';

describe('Server spec', () => {
    it('should respond to health check', async () => {
        const res = await request(app).get('/');
        expect(res.status).toEqual(200);
        expect(res.text).toEqual('Server running A-OK');
    })

})
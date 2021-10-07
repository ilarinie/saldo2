import request from 'supertest';
import { app } from '../server';

//@ts-ignore
process.env.NODE_ENV = 'test';

describe('Server spec', () => {
  it('should respond to health check', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('Server running A-OK');
  });
});

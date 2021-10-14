import dotenv from 'dotenv'
dotenv.config()
import request from 'supertest'
import { connectToDatabase } from '../services/database'
import { app } from '../server'
import mongoose from 'mongoose'


//@ts-ignore
process.env.NODE_ENV = 'test'

describe('Server spec', () => {
  beforeEach(async () => {
    try {
      await connectToDatabase(process.env.TEST_MONGO_URI + 'server')
    } catch (err) {
      console.error(err)
    }
  })
  afterEach(async () => {
    await mongoose.connection.close()
  })
  it('should respond to health check', async () => {
    const res = await request(app).get('/api')
    expect(res.status).toEqual(200)
    expect(res.text).toEqual('Server running A-OK')
  })
})

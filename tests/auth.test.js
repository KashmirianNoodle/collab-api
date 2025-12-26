
const request = require('supertest')
const app = require('../src/app')

describe('Auth', () => {
  it('registers user', async () => {
    const res = await request(app).post('/api/v1/auth/register')
      .send({ email: 'a@a.com', password: '123456' })
    expect(res.statusCode).toBe(201)
  })
})

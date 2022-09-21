// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('404 Handler', () => {
  // If the request for resources that can't be found, it should get 404 response "not found"
  test("any requests for resources that can't be found", async () => {
    const res = await request(app).get('/unknown_page').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('not found');
  });
});

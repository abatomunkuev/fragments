// tests/unit/getById.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('Unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/2a4c00af-08d6-4519-aaa5-7f312/info').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/2a4c00af-08d6-4519-aaa5-7f3122038a3b/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('Retrieve fragment metadata that does not exist, should return 404, user is authorized', async () => {
    const res = await request(app)
      .get('/v1/fragments/2a3c013fa-74x3-bbb1-139daj/info')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test('Retrieve fragment metadata by id, user is authorized', async () => {
    const data = 'This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '/info')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.type).toBe('application/json');
    expect(get_res.body.status).toBe('ok');
    expect(get_res.body).toMatchObject(post_res.body);
    expect(get_res.body.fragment).toMatchObject(post_res.body.fragment);
  });
});

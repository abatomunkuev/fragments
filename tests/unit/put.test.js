// tests/unit/put.test.js
const request = require('supertest');

const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('PUT /v1/fragments', () => {
  test('Unauthenticated requests are denied: return 401 Unauthorized', async () => {
    const res = await request(app).put('/v1/fragments/139dj913dj1');
    expect(res.body.error.message).toBe('Unauthorized');
    expect(res.status).toBe(401);
  });

  test('Incorrect credentials are denied: return 401 Unauthorized', async () => {
    const res = await request(app)
      .put('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(res.body.error.message).toBe('Unauthorized');
    expect(res.status).toBe(401);
  });

  test('Update fragment that does not exist, should return 404, user is authorized', async () => {
    const res = await request(app)
      .put('/v1/fragments/2a3c013fa-74x3-bbb1-139daj')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test('Update fragment without providing the data, should return 500', async () => {
    const res = await request(app)
      .put('/v1/fragments/2a3c013fa-74x3-bbb1-139daj')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
  });

  test("Update a fragment mismatched type 'text/plain', should return 400", async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(postRes.body.fragment.ownerId, postRes.body.fragment.id);
    expect(postRes.body.fragment).toEqual(fragment);

    const putRes = await request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a updated fragment');

    expect(putRes.statusCode).toBe(400);
    expect(putRes.body.error.message).toBe(
      "Content-Type of the request does not match the existing fragment's type"
    );
  });

  test("Create a fragment of type 'text/plain' and Update the data, user is authorized", async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(postRes.body.fragment.ownerId, postRes.body.fragment.id);
    expect(postRes.body.fragment).toEqual(fragment);

    const putRes = await request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a updated fragment');

    expect(putRes.statusCode).toBe(200);

    const res = await request(app)
      .get('/v1/fragments/' + fragment.id)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('This is a updated fragment');
  });
});

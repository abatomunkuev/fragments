// tests/unit/delete.test.js
const request = require('supertest');

const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('DELETE /v1/fragments', () => {
  test('Unauthenticated requests are denied: return 401 Unauthorized', async () => {
    const res = await request(app).delete('/v1/fragments/139dj913dj1');
    expect(res.body.error.message).toBe('Unauthorized');
    expect(res.status).toBe(401);
  });

  test('Incorrect credentials are denied: return 401 Unauthorized', async () => {
    const res = await request(app)
      .delete('/v1/fragments/139dj913dj1')
      .auth('invalid@email.com', 'incorrect_password');

    expect(res.body.error.message).toBe('Unauthorized');
    expect(res.status).toBe(401);
  });

  test('Delete fragment that does not exist, should return 404, user is authorized', async () => {
    const res = await request(app)
      .delete('/v1/fragments/2a3c013fa-74x3-bbb1-139daj')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test("Create a fragment of type 'text/plain' and delete it, user is authorized", async () => {
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

    // Delete
    const res = await request(app)
      .delete(`/v1/fragments/${postRes.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(postRes.body.status).toBe('ok');
  });
});

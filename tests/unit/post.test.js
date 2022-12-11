// tests/unit/post.test.js
const request = require('supertest');

const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('POST /v1/fragments', () => {
  test('Unauthenticated requests are denied: return 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    expect(res.body.error.message).toBe('Unauthorized');
    expect(res.status).toBe(401);
  });

  test('Incorrect credentials are denied: return 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(res.body.error.message).toBe('Unauthorized');
    expect(res.status).toBe(401);
  });

  test('Not supported Content-type: return 415 Unsupported Media Type', async () => {
    const unsupported_types = [
      { type: 'video/mp4', value: 'video placeholder' },
      { type: 'audio/mp3', value: 'audio placeholder' },
    ];

    unsupported_types.forEach(async ({ type, value }) => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .send(value)
        .set('Content-Type', type);
      expect(res.body.status).toBe('error');
      expect(res.status).toBe(415);
    });
  });

  test('Creating a fragment without providing data: return 500', async () => {
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.status).toBe(500);
  });

  test("Create a fragment of type 'text/plain', user is authorized", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
  });

  test("Create a fragment of type 'text/markdown', user is authorized", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('### This is a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
  });

  test("Create a fragment of type 'text/html', user is authorized", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('<h1>This is a fragment</h1>');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
  });

  test("Create a fragment of type 'application/json', user is authorized", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('{"brands": ["toyota", "bmw", "ford"]}');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
  });

  test('Ensure response include all necessary and expected properties', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('type');
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
    expect(res.body.fragment).toHaveProperty('size');
  });

  test('Ensure response includes all necessary and expected properties', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('type');
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
    expect(res.body.fragment).toHaveProperty('size');
  });

  test('Ensure response has all necessary and expected properties that have the correct type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(typeof res.body.fragment.id).toBe('string');
    expect(typeof res.body.fragment.ownerId).toBe('string');
    expect(typeof res.body.fragment.type).toBe('string');
    // Check if we can parse the datetime properties
    expect(Date.parse(res.body.fragment.created)).not.toBeNaN();
    expect(Date.parse(res.body.fragment.updated)).not.toBeNaN();
    expect(typeof res.body.fragment.size).toBe('number');
  });

  test("Create a fragment of type 'text/plain; charset=utf-8' with charset specified, user is authorized", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .send('This is a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
  });

  test("Create a fragment of type 'text/markdown; charset=utf-8' with charset specified, user is authorized", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown; charset=utf-8')
      .send('## This is a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
  });

  test("Create a fragment of type 'text/html; charset=utf-8' with charset specified, user is authorized", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html; charset=utf-8')
      .send('<h1>This is a fragment</h1>');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
  });

  test("Create a fragment of type 'application/json; charset=utf-8' with charset specified, user is authorized", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send('{"brands": ["toyota", "bmw", "ford"]}');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
  });

  test('Create a fragment with data of Buffer type, user is authorized', async () => {
    const data = Buffer.from('This is a fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    // Check if fragment exists in the In-Memory Database
    const fragment = await Fragment.byId(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
  });

  test('Ensure response returns correct Location header', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(res.header['location']).toBe(
      'http://localhost:8080/v1/fragments/' + res.body.fragment.id
    );
  });

  test('Ensure the size gets correctly calculated', async () => {
    const data = Buffer.from('This is a fragment');
    const size = Buffer.byteLength(data);
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .send(data);

    expect(res.body.fragment.size).toEqual(size);
  });
});

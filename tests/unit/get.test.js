// tests/unit/get.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  test('Unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('Get a empty fragments array (user has not posted any fragment), user is authorized', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(0);
  });

  test('Get a fragments array (user has posted fragments), user is authorized', async () => {
    const fragments_data = ['This is the first fragment', 'This is the second argument'];

    fragments_data.forEach(async (fragment_data) => {
      await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(fragment_data);
    });

    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(2);
  });

  test('Ensure GET /v1/fragments returns fragment ids, user is authorized', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(2);
    res.body.fragments.forEach((fragment_id) => {
      expect(typeof fragment_id).toBe('string');
      expect(fragment_id).toMatch(
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
      );
    });
  });
});

describe('GET /v1/fragments?expand=1', () => {
  test('Unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments?expand=1').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments?expand=1')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('Get a empty fragments array (user has not posted any fragment), user is authorized', async () => {
    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(0);
  });

  test('Get a fragments array (user has posted fragments), user is authorized', async () => {
    const fragments_data = ['This is the first fragment', 'This is the second argument'];

    fragments_data.forEach(async (fragment_data) => {
      await request(app)
        .post('/v1/fragments')
        .auth('user2@email.com', 'password2')
        .set('Content-Type', 'text/plain')
        .send(fragment_data);
    });

    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(2);
  });

  test('Ensure GET /v1/fragments?expand=1 returns a list of expanded fragment metadata', async () => {
    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(2);
    res.body.fragments.forEach((fragment) => {
      expect(typeof fragment.id).toBe('string');
      expect(fragment.id).toMatch(
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
      );
      expect(Object.prototype.hasOwnProperty.call(fragment, 'ownerId')).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(fragment, 'created')).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(fragment, 'updated')).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(fragment, 'type')).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(fragment, 'size')).toBe(true);
    });
  });
});

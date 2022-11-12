// tests/unit/getById.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('Unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/2a4c00af-08d6-4519-aaa5-7f312').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/2a4c00af-08d6-4519-aaa5-7f3122038a3b')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('Retrieve fragment that does not exist, should return 404, user is authorized', async () => {
    const res = await request(app)
      .get('/v1/fragments/2a3c013fa-74x3-bbb1-139daj')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test('Retrieve fragment by id, user is authorized', async () => {
    const data = 'This is a fragment';
    // Get the raw data
    const buffer = Buffer.from(data);
    // Determine the size of raw data
    const size = Buffer.byteLength(buffer);
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id)
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    // Check the content type
    expect(get_res.type).toBe('text/plain');
    // Check the size
    expect(Number(get_res.header['content-length'])).toBe(size);
    // Check the text value retrieved (fragment's data)
    expect(get_res.text).toEqual(data);
  });

  test('Retrieve fragment of text/plain type. Ensure response Content-Type matches, user is authorized', async () => {
    const data = 'This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id)
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/plain/);
    expect(get_res.text).toEqual(data);
  });

  test('Retrieve fragment of text/markdown type. Ensure response Content-Type matches, user is authorized', async () => {
    const data = '## This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id)
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/markdown/);
    expect(get_res.text).toEqual(data);
  });

  test('Retrieve fragment of text/html type. Ensure response Content-Type matches, user is authorized', async () => {
    const data = '<h1>This is a fragment</h1>';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id)
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/html/);
    expect(get_res.text).toEqual(data);
  });

  test('Retrieve fragment of application/json type. Ensure response Content-Type matches, user is authorized', async () => {
    const data = '{"car": "bmw"}';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id)
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/json/);
    expect(get_res.text).toEqual(data);
  });
});

describe('GET /v1/fragments/:id.ext', () => {
  test('Retrieve fragment of text/plain type converted to incorrect format, user is authorized, should response with error', async () => {
    const data = 'This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.incorrect')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(415);
    expect(get_res.body.status).toBe('error');
  });

  test('Retrieve fragment of text/plain type converted to not supported format, user is authorized, should response with error', async () => {
    const data = 'This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.md')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(415);
    expect(get_res.body.status).toBe('error');
  });

  test('Retrieve fragment of text/plain type converted to txt, user is authorized', async () => {
    const data = 'This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.txt')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/plain/);
    expect(get_res.text).toEqual(data);
  });

  test('Retrieve fragment of text/markdown type converted to incorrect format, user is authorized, should response with error', async () => {
    const data = '# This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.incorrect')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(415);
    expect(get_res.body.status).toBe('error');
  });

  test('Retrieve fragment of text/markdown type converted to not supported format, user is authorized, should response with error', async () => {
    const data = '# This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.json')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(415);
    expect(get_res.body.status).toBe('error');
  });

  test('Retrieve fragment of text/markdown type converted to txt, user is authorized', async () => {
    const data = '# This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.txt')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/plain/);
    expect(get_res.text).toEqual(data);
  });

  test('Retrieve fragment of text/markdown type converted to html, user is authorized', async () => {
    const data = '# This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.html')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/html/);
    expect(get_res.text).toEqual('<h1>This is a fragment</h1>\n');
  });

  test('Retrieve fragment of text/markdown type converted to md, user is authorized', async () => {
    const data = '# This is a fragment';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.md')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/markdown/);
    expect(get_res.text).toEqual('# This is a fragment');
  });

  test('Retrieve fragment of text/html type converted to incorrect format, user is authorized, should response with error', async () => {
    const data = '<h1>This is a fragment</h1>';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.incorrect')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(415);
    expect(get_res.body.status).toBe('error');
  });

  test('Retrieve fragment of text/html type converted to not supported format, user is authorized, should response with error', async () => {
    const data = '<h1>This is a fragment</h1>';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.md')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(415);
    expect(get_res.body.status).toBe('error');
  });

  test('Retrieve fragment of text/html type converted to txt, user is authorized', async () => {
    const data = '<h1>This is a fragment</h1>';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.txt')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/plain/);
    expect(get_res.text).toEqual(data);
  });

  test('Retrieve fragment of text/html type converted to html, user is authorized', async () => {
    const data = '<h1>This is a fragment</h1>';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.html')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/html/);
    expect(get_res.text).toEqual(data);
  });

  test('Retrieve fragment of application/json type converted to incorrect format, user is authorized, should response with error', async () => {
    const data = '{"car": "bmw"}';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.incorrect')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(415);
    expect(get_res.body.status).toBe('error');
  });

  test('Retrieve fragment of application/json type converted to not supported format, user is authorized, should response with error', async () => {
    const data = '{"car": "bmw"}';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.md')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(415);
    expect(get_res.body.status).toBe('error');
  });

  test('Retrieve fragment of application/json type converted to txt, user is authorized', async () => {
    const data = '{"car": "bmw"}';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.txt')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/plain/);
    expect(get_res.text).toEqual(data);
  });

  test('Retrieve fragment of application/json type converted to json, user is authorized', async () => {
    const data = '{"car": "bmw"}';
    // Create a fragment
    const post_res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);
    const get_res = await request(app)
      .get('/v1/fragments/' + post_res.body.fragment.id + '.json')
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toMatch(/json/);
    expect(get_res.text).toEqual(data);
  });
});

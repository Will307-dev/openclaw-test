const test = require('node:test');
const assert = require('node:assert/strict');

const { createServer } = require('../server');

function startServer() {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(0, () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`
      });
    });
  });
}

test('GET /health should return ok: true', async (t) => {
  const { server, baseUrl } = await startServer();
  t.after(() => {
    server.close();
  });

  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);

  const payload = await response.json();
  assert.deepEqual(payload, { ok: true });
});

test('GET / should serve index.html', async (t) => {
  const { server, baseUrl } = await startServer();
  t.after(() => {
    server.close();
  });

  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /text\/html/);

  const html = await response.text();
  assert.match(html, /<title>Tasks Demo<\/title>/);
});

test('POST /api/tasks should create a task', async (t) => {
  const { server, baseUrl } = await startServer();
  t.after(() => {
    server.close();
  });

  const createResponse = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'Write tests' })
  });

  assert.equal(createResponse.status, 201);
  const createPayload = await createResponse.json();

  assert.equal(typeof createPayload.task.id, 'string');
  assert.equal(createPayload.task.title, 'Write tests');
  assert.equal(typeof createPayload.task.createdAt, 'number');

  const listResponse = await fetch(`${baseUrl}/api/tasks`);
  assert.equal(listResponse.status, 200);

  const listPayload = await listResponse.json();
  assert.equal(listPayload.tasks.length, 1);
  assert.equal(listPayload.tasks[0].title, 'Write tests');
});

test('POST /api/tasks should reject invalid JSON payload', async (t) => {
  const { server, baseUrl } = await startServer();
  t.after(() => {
    server.close();
  });

  const response = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"title": "missing end quote}'
  });

  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.deepEqual(payload, { error: 'invalid JSON body' });
});

test('DELETE /api/tasks/:id should reject malformed encoded id', async (t) => {
  const { server, baseUrl } = await startServer();
  t.after(() => {
    server.close();
  });

  const response = await fetch(`${baseUrl}/api/tasks/%E0%A4%A`, {
    method: 'DELETE'
  });

  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.deepEqual(payload, { error: 'invalid task id' });
});

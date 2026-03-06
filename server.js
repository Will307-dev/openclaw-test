const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const PUBLIC_DIR = path.join(__dirname, 'public');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function createTaskStore() {
  const tasks = [];

  return {
    list() {
      return tasks;
    },
    add(title) {
      const task = {
        id: randomUUID(),
        title,
        createdAt: Date.now()
      };
      tasks.push(task);
      return task;
    },
    remove(id) {
      const index = tasks.findIndex((task) => task.id === id);
      if (index === -1) {
        return false;
      }
      tasks.splice(index, 1);
      return true;
    }
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': contentTypes['.json']
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const normalizedPath = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const safePath = path.normalize(normalizedPath).replace(/^([.][.][/\\])+/, '');
  const filePath = path.resolve(PUBLIC_DIR, safePath);

  if (filePath !== PUBLIC_DIR && !filePath.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'application/octet-stream'
    });
    res.end(data);
  });
}

function createServer(options = {}) {
  const store = options.store || createTaskStore();

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');

    try {
      if (req.method === 'GET' && url.pathname === '/health') {
        sendJson(res, 200, { ok: true });
        return;
      }

      if (req.method === 'GET' && url.pathname === '/api/tasks') {
        sendJson(res, 200, { tasks: store.list() });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/api/tasks') {
        const body = await readBody(req);
        const title = typeof body.title === 'string' ? body.title.trim() : '';

        if (!title) {
          sendJson(res, 400, { error: 'title is required' });
          return;
        }

        const task = store.add(title);
        sendJson(res, 201, { task });
        return;
      }

      if (req.method === 'DELETE' && url.pathname.startsWith('/api/tasks/')) {
        let id;
        try {
          id = decodeURIComponent(url.pathname.replace('/api/tasks/', ''));
        } catch {
          sendJson(res, 400, { error: 'invalid task id' });
          return;
        }

        if (!id) {
          sendJson(res, 400, { error: 'invalid task id' });
          return;
        }

        const removed = store.remove(id);

        if (!removed) {
          sendJson(res, 404, { error: 'task not found' });
          return;
        }

        sendJson(res, 200, { ok: true });
        return;
      }

      if (req.method === 'GET') {
        serveStatic(req, res);
        return;
      }

      sendJson(res, 404, { error: 'Not found' });
    } catch (err) {
      if (err.message === 'Invalid JSON') {
        sendJson(res, 400, { error: 'invalid JSON body' });
        return;
      }

      if (err.message === 'Request body too large') {
        sendJson(res, 413, { error: 'payload too large' });
        return;
      }

      sendJson(res, 500, { error: 'internal server error' });
    }
  });

  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  const server = createServer();
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = {
  createServer,
  createTaskStore
};

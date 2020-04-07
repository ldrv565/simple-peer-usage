const express = require('express');
const next = require('next');

const { parse } = require('url');
const { join } = require('path');

const port = parseInt(process.env.PORT, 10) || 8080;
const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', async (req, res, nextHandle) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === '/service-worker.js') {
      const filePath = join(__dirname, '.next', 'service-worker.js');

      return app.serveStatic(req, res, filePath);
    }

    if (pathname === '/manifest.json') {
      return handle(req, res, parsedUrl);
    }

    return nextHandle();
  });

  server.disable('x-powered-by');

  server.all('*', async (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.info(`> Server ready on port: ${port}`);
  });
});

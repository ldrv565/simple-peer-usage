const express = require('express');
const next = require('next');

const http = require('http');
const io = require('socket.io');
const SimpleSignalServer = require('simple-signal-server'); // require('simple-signal-server')

const { parse } = require('url');
const { join } = require('path');

const port = parseInt(process.env.PORT, 10) || 8080;
const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

const rooms = {
  'Room One': new Set(),
  'Room Two': new Set(),
  'Room Three': new Set()
};

app.prepare().then(() => {
  const server = express();

  const httpServer = http.createServer(app);

  const ioServer = io(httpServer, {
    serveClient: false,
    wsEngine: 'ws'
  });
  httpServer.listen(4000);

  const signal = new SimpleSignalServer(ioServer);

  signal.on('discover', request => {
    if (!request.discoveryData) {
      // return list of rooms
      request.discover(request.socket.id, {
        rooms: Object.keys(rooms)
      });
    } else {
      // return peers in a room
      const roomID = request.discoveryData;
      request.discover(request.socket.id, {
        roomResponse: roomID, // return the roomID so client can correlate discovery data
        peers: Array.from(rooms[roomID])
      });
      if (request.socket.roomID) {
        // if peer was already in a room
        console.log(request.socket.id, 'left room', request.socket.roomID);
        rooms[request.socket.roomID].delete(request.socket.id); // remove peer from that room
      }
      if (request.socket.roomID !== roomID) {
        // if peer is joining a new room
        request.socket.roomID = roomID; // track the current room in the persistent socket object
        console.log(request.socket.id, 'joined room', roomID);
        rooms[roomID].add(request.socket.id); // add peer to new room
      }
    }
  });

  server.all('*', async (req, res, nextHandle) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === '/service-worker.js') {
      const filePath = join(__dirname, '../', '.next', 'service-worker.js');

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

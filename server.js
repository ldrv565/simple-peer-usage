const authy = require('authy')('ndgZxYlaGt3lkG7em2a2IpT0wJQMlJ5G');
const express = require('express');
const next = require('next');

const http = require('http');
const io = require('socket.io');
const SimpleSignalServer = require('simple-signal-server'); // require('simple-signal-server')

const { parse } = require('url');
const { join } = require('path');

const bodyParser = require('body-parser');

const port = parseInt(process.env.PORT, 10) || 8080;
const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

const rooms = {};
let doctorID = null;
let doctorRequest = null;

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  const httpServer = http.createServer(app);

  const ioServer = io(httpServer, {
    serveClient: false,
    wsEngine: 'ws'
  });
  httpServer.listen(4000);

  const signal = new SimpleSignalServer(ioServer);

  signal.on('discover', request => {
    // doctor receive data about rooms

    if (!request.discoveryData) {
      doctorID = request.socket.id;
      doctorRequest = request;

      request.discover(doctorID, {
        rooms: Object.keys(rooms)
      });

      return null;
    }

    // if patient was disconnected doctor will remove room

    const { remove } = request.discoveryData;

    if (remove) {
      delete rooms[remove];
      request.socket.roomID = null;

      request.discover(doctorID, {
        rooms: Object.keys(rooms)
      });

      return null;
    }

    const { roomID } = request.discoveryData;

    // patient create room by his name

    if (request.socket.id !== doctorID) {
      request.socket.roomID = roomID;
      rooms[roomID] = {
        patient: request.socket.id,
        doctor: rooms[roomID] && rooms[roomID].doctor
      };

      request.discover(request.socket.id, {
        peer: rooms[roomID] && rooms[roomID].patient
      });

      // doctor will receive new rooms data

      if (doctorRequest) {
        doctorRequest.discover(doctorID, {
          rooms: Object.keys(rooms)
        });
      }

      return null;
    }

    // doctor receive patient peer id by room name and left previous room

    const response = {
      peerID: rooms[roomID].patient
    };

    request.discover(request.socket.id, response);
    if (request.socket.roomID) {
      rooms[request.socket.roomID].doctor = null;
    }

    if (request.socket.roomID !== roomID) {
      rooms[roomID].doctor = request.socket.id;
      request.socket.roomID = roomID;
    }

    return null;
  });

  server.post('/register', (req, res) => {
    const { email, phone, countryCode } = req.body;
    authy.register_user(email, phone, countryCode, (err, data) => {
      if (err) {
        return res.json(err);
      }

      return res.json(data);
    });
  });

  server.post('/sendToken', (req, res) => {
    const { userId } = req.body;
    authy.request_sms(userId, (err, data) => {
      if (err) {
        return res.json(err);
      }

      return res.json(data);
    });
  });

  server.post('/verify', (req, res) => {
    const { userId, token } = req.body;
    authy.verify(userId, token, true, (err, data) => {
      if (err) {
        return res.json(err);
      }

      return res.json(data);
    });
  });

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

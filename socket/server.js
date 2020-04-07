const http = require('http');
const io = require('socket.io');
const SimpleSignalServer = require('simple-signal-server'); // require('simple-signal-server')

const port = parseInt(process.env.PORT, 10) || 4000;
const isDev = process.env.NODE_ENV !== 'production';

const httpServer = http.createServer();

const ioServer = io(httpServer, {
  serveClient: false,
  wsEngine: 'ws'
});

httpServer.listen(port);

const signal = new SimpleSignalServer(ioServer);

const rooms = {
  'Room One': new Set(),
  'Room Two': new Set(),
  'Room Three': new Set()
};

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

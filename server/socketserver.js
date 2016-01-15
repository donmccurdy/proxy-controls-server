'use strict';
var p2p = require('socket.io-p2p-server').Server;

class SocketServer {

  constructor (io) {
    io.use(p2p);
    io.on('connection', this.onConnection.bind(this));
  }

  onConnection (socket) {
    console.log('a user connected');
    socket.emit('msg', { hello: 'world' });
    socket.on('msg', (o) => console.log(o));
  }

}

module.exports = SocketServer;

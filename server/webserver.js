'use strict';
var express = require('express'),
    http = require('http'),
    io = require('socket.io'),
    SocketServer = require('./socketserver');

class WebServer {

  constructor (options) {
    this.options = options;
    this.app = express();
    this.server = http.Server(this.app);
    this.io = io(this.server);
    this.socketServer = new SocketServer(this.io);
    this.app.use(express.static('_public'));
    this.server.listen(this.options.port, () =>
      console.log('listening on *:%d', this.options.port)
    );
  }

}

module.exports = WebServer;
